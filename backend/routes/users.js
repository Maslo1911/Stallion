const { Router } = require('express');
const bcrypt = require('bcrypt');
const { User, Role } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');

const router = Router();
const SALT_ROUNDS = 10;

// ─── GET /api/users ───────────────────────────────────────────────────────────
// Получить список всех пользователей (с ролью)
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, attributes: ['id', 'name'] }],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
// Получить пользователя по идентификатору
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Role, attributes: ['id', 'name'] }],
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/users ──────────────────────────────────────────────────────────
// Добавить пользователя
// Body: { full_name, age, license, role_id, login, password }
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { full_name, age, license, role_id, login, password } = req.body;

    if (!full_name || !role_id || !login || !password) {
      return res.status(400).json({ error: 'Поля full_name, role_id, login и password обязательны' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      full_name,
      age,
      license,
      role_id,
      login,
      password_hash: hashedPassword
    });

    const { password_hash: _, ...userData } = user.toJSON();
    res.status(201).json(userData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /api/users/:id ───────────────────────────────────────────────────────
// Обновить данные пользователя
// Body: { full_name?, age?, license?, role_id?, login?, password? }
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const { full_name, age, license, role_id, login, password } = req.body;
    
    const updateData = { full_name, age, license, role_id, login };
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    await user.update(updateData);

    const { password_hash: _, ...userData } = user.toJSON();
    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
// Удалить пользователя по идентификатору
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    await user.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;