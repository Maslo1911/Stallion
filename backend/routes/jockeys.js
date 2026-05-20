const { Router } = require('express');
const { Jockey } = require('../models');

const router = Router();

// ─── GET /api/jockeys ─────────────────────────────────────────────────────────
// Получить список всех жокеев
router.get('/', async (req, res) => {
    try {
        const jockeys = await Jockey.findAll();
        res.json(jockeys);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/jockeys/:id ─────────────────────────────────────────────────────
// Получить жокея по идентификатору
router.get('/:id', async (req, res) => {
    try {
        const jockey = await Jockey.findByPk(req.params.id);

        if (!jockey) {
            return res.status(404).json({ error: 'Жокей не найден' });
        }

        res.json(jockey);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/jockeys ────────────────────────────────────────────────────────
// Добавить жокея
// Body: { full_name, age, license }
router.post('/', async (req, res) => {
    try {
        const { full_name, age, license } = req.body;

        if (!full_name) {
            return res.status(400).json({ error: 'Поле full_name обязательно' });
        }

        const jockey = await Jockey.create({ full_name, age, license });
        res.status(201).json(jockey);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── PUT /api/jockeys/:id ─────────────────────────────────────────────────────
// Обновить данные жокея
// Body: { full_name?, age?, license? }
router.put('/:id', async (req, res) => {
    try {
        const jockey = await Jockey.findByPk(req.params.id);

        if (!jockey) {
            return res.status(404).json({ error: 'Жокей не найден' });
        }

        const { full_name, age, license } = req.body;
        await jockey.update({ full_name, age, license });

        res.json(jockey);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/jockeys/:id ──────────────────────────────────────────────────
// Удалить жокея по идентификатору
router.delete('/:id', async (req, res) => {
    try {
        const jockey = await Jockey.findByPk(req.params.id);

        if (!jockey) {
            return res.status(404).json({ error: 'Жокей не найден' });
        }

        await jockey.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;