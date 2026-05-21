const jwt = require('jsonwebtoken');

/**
 * Генерирует access-токен (короткоживущий).
 * Payload содержит id пользователя и его роль.
 */
function generateAccessToken(user) {
    return jwt.sign(
        { id: user.id, role: user.Role?.name },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
    );
}

/**
 * Генерирует refresh-токен (долгоживущий).
 * Payload содержит только id — минимум данных.
 */
function generateRefreshToken(user) {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
    );
}

/**
 * Возвращает дату истечения refresh-токена как объект Date.
 * Нужно для сохранения в базу.
 */
function getRefreshTokenExpiry() {
    const days = 7;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

module.exports = { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry };