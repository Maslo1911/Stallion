const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role, RefreshToken } = require('../models');
const { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } = require('../utils/tokens');

const router = Router();
const SALT_ROUNDS = 10;

// ─── POST /api/auth/register ──────────────────────────────────────────────────
// Регистрация нового пользователя
// Body: { full_name, age, license, role_id, login, password }
router.post('/register', async (req, res) => {
    try {
        const { full_name, age, license, role_id, login, password } = req.body;

        if (!full_name || !password || !role_id || !login) {
            return res.status(400).json({ error: 'Поля full_name, login, password и role_id обязательны' });
        }

        // Хэшируем пароль перед сохранением — никогда не храним пароль в открытом виде
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            full_name, age, license, role_id, login,
            password_hash: hashedPassword,
        });

        // Не возвращаем пароль в ответе
        const { password_hash: _, ...userData } = user.toJSON();
        res.status(201).json(userData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
// Вход. Возвращает access и refresh токены.
// Body: { login, password }
router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(400).json({ error: 'Поля login и password обязательны' });
        }

        // Ищем пользователя вместе с ролью (роль нужна для payload токена)
        const user = await User.findOne({
            where: { login },
            include: [{ model: Role }],
        });

        if (!user) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        // Сравниваем введённый пароль с хэшем в базе
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        // Генерируем оба токена
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Сохраняем refresh-токен в БД (старый удаляем — один пользователь, один токен)
        await RefreshToken.destroy({ where: { user_id: user.id } });
        await RefreshToken.create({
            user_id: user.id,
            token: refreshToken,
            expires_at: getRefreshTokenExpiry(),
        });

        res.json({ accessToken, refreshToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/auth/refresh ───────────────────────────────────────────────────
// Обновление access-токена по refresh-токену.
// Body: { refreshToken }
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'refreshToken обязателен' });
        }

        // 1. Проверяем подпись и срок действия токена
        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch {
            return res.status(401).json({ error: 'Refresh-токен недействителен или истёк' });
        }

        // 2. Проверяем, что токен есть в базе и не протух по времени
        const stored = await RefreshToken.findOne({
            where: { token: refreshToken, user_id: payload.id },
        });

        if (!stored || new Date() > new Date(stored.expires_at)) {
            return res.status(401).json({ error: 'Refresh-токен не найден или истёк' });
        }

        // 3. Загружаем актуальные данные пользователя
        const user = await User.findByPk(payload.id, {
            include: [{ model: Role }],
        });

        if (!user) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }

        // 4. Выдаём новую пару токенов (rotation — старый refresh удаляем)
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        await stored.destroy();
        await RefreshToken.create({
            user_id: user.id,
            token: newRefreshToken,
            expires_at: getRefreshTokenExpiry(),
        });

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
// Выход. Инвалидирует refresh-токен.
// Body: { refreshToken }
router.post('/logout', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'refreshToken обязателен' });
        }

        await RefreshToken.destroy({ where: { token: refreshToken } });

        res.json({ message: 'Выход выполнен успешно' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;