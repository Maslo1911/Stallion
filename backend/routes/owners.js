const { Router } = require('express');
const { Owner, Horse } = require('../models');

const router = Router();

// ─── GET /api/owners ──────────────────────────────────────────────────────────
// Получить список всех владельцев
router.get('/', async (req, res) => {
    try {
        const owners = await Owner.findAll();
        res.json(owners);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/owners/:id ──────────────────────────────────────────────────────
// Получить владельца по идентификатору
router.get('/:id', async (req, res) => {
    try {
        const owner = await Owner.findByPk(req.params.id);

        if (!owner) {
            return res.status(404).json({ error: 'Владелец не найден' });
        }

        res.json(owner);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/owners ─────────────────────────────────────────────────────────
// Добавить владельца
// Body: { full_name, phone_number, address }
router.post('/', async (req, res) => {
    try {
        const { full_name, phone_number, address } = req.body;

        if (!full_name) {
            return res.status(400).json({ error: 'Поле full_name обязательно' });
        }

        const owner = await Owner.create({ full_name, phone_number, address });
        res.status(201).json(owner);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── PUT /api/owners/:id ──────────────────────────────────────────────────────
// Обновить данные владельца
// Body: { full_name?, phone_number?, address? }
router.put('/:id', async (req, res) => {
    try {
        const owner = await Owner.findByPk(req.params.id);

        if (!owner) {
            return res.status(404).json({ error: 'Владелец не найден' });
        }

        const { full_name, phone_number, address } = req.body;
        await owner.update({ full_name, phone_number, address });

        res.json(owner);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/owners/:id ───────────────────────────────────────────────────
// Удалить владельца по идентификатору
router.delete('/:id', async (req, res) => {
    try {
        const owner = await Owner.findByPk(req.params.id);

        if (!owner) {
            return res.status(404).json({ error: 'Владелец не найден' });
        }

        await owner.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/owners/:id/horses ───────────────────────────────────────────────
// Получить список лошадей заданного владельца
router.get('/:id/horses', async (req, res) => {
    try {
        const owner = await Owner.findByPk(req.params.id, {
            include: [{ model: Horse }],
        });

        if (!owner) {
            return res.status(404).json({ error: 'Владелец не найден' });
        }

        res.json(owner.Horses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;