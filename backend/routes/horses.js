const { Router } = require('express');
const { Horse, Owner } = require('../models');

const router = Router();

// ─── GET /api/horses ──────────────────────────────────────────────────────────
// Получить список всех лошадей (с владельцем)
router.get('/', async (req, res) => {
    try {
        const horses = await Horse.findAll({
            include: [{ model: Owner, attributes: ['id', 'full_name'] }],
        });
        res.json(horses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/horses/:id ──────────────────────────────────────────────────────
// Получить лошадь по идентификатору
router.get('/:id', async (req, res) => {
    try {
        const horse = await Horse.findByPk(req.params.id, {
            include: [{ model: Owner, attributes: ['id', 'full_name', 'phone_number'] }],
        });

        if (!horse) {
            return res.status(404).json({ error: 'Лошадь не найдена' });
        }

        res.json(horse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/horses ─────────────────────────────────────────────────────────
// Добавить лошадь
// Body: { nickname, color, age, owner_id }
const { authenticate, requireRole } = require('../middleware/auth');

// Protect write operations (admin only)
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const { nickname, color, age, owner_id } = req.body;

        if (!nickname) {
            return res.status(400).json({ error: 'Поле nickname обязательно' });
        }

        const horse = await Horse.create({ nickname, color, age, owner_id });
        res.status(201).json(horse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── PUT /api/horses/:id ──────────────────────────────────────────────────────
// Обновить данные лошади
// Body: { nickname?, color?, age?, owner_id? }
router.put('/:id', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const horse = await Horse.findByPk(req.params.id);

        if (!horse) {
            return res.status(404).json({ error: 'Лошадь не найдена' });
        }

        const { nickname, color, age, owner_id } = req.body;
        await horse.update({ nickname, color, age, owner_id });

        res.json(horse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/horses/:id ───────────────────────────────────────────────────
// Удалить лошадь по идентификатору
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
    try {
        const horse = await Horse.findByPk(req.params.id);

        if (!horse) {
            return res.status(404).json({ error: 'Лошадь не найдена' });
        }

        await horse.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;