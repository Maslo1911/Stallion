const { Router } = require('express');
const { Hippodrome } = require('../models');

const router = Router();

// ─── GET /api/hippodromes ─────────────────────────────────────────────────────
// Получить список всех ипподромов
router.get('/', async (req, res) => {
    try {
        const hippodromes = await Hippodrome.findAll();
        res.json(hippodromes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/hippodromes/:id ─────────────────────────────────────────────────
// Получить ипподром по идентификатору
router.get('/:id', async (req, res) => {
    try {
        const hippodrome = await Hippodrome.findByPk(req.params.id);

        if (!hippodrome) {
            return res.status(404).json({ error: 'Ипподром не найден' });
        }

        res.json(hippodrome);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/hippodromes ────────────────────────────────────────────────────
// Добавить ипподром
// Body: { name, city, address }
router.post('/', async (req, res) => {
    try {
        const { name, city, address } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Поле name обязательно' });
        }

        const hippodrome = await Hippodrome.create({ name, city, address });
        res.status(201).json(hippodrome);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── PUT /api/hippodromes/:id ─────────────────────────────────────────────────
// Обновить данные ипподрома
// Body: { name?, city?, address? }
router.put('/:id', async (req, res) => {
    try {
        const hippodrome = await Hippodrome.findByPk(req.params.id);

        if (!hippodrome) {
            return res.status(404).json({ error: 'Ипподром не найден' });
        }

        const { name, city, address } = req.body;
        await hippodrome.update({ name, city, address });

        res.json(hippodrome);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/hippodromes/:id ──────────────────────────────────────────────
// Удалить ипподром по идентификатору
router.delete('/:id', async (req, res) => {
    try {
        const hippodrome = await Hippodrome.findByPk(req.params.id);

        if (!hippodrome) {
            return res.status(404).json({ error: 'Ипподром не найден' });
        }

        await hippodrome.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
