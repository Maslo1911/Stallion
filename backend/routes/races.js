const { Router } = require('express');
const { Race, Hippodrome, Participation, Horse, User } = require('../models');

const router = Router();

// ─── GET /api/races ───────────────────────────────────────────────────────────
// Получить список всех скачек (с ипподромом)
router.get('/', async (req, res) => {
    try {
        const races = await Race.findAll({
            include: [{ model: Hippodrome, attributes: ['id', 'name', 'city'] }],
        });
        res.json(races);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/races/:id ───────────────────────────────────────────────────────
// Получить скачку по идентификатору
router.get('/:id', async (req, res) => {
    try {
        const race = await Race.findByPk(req.params.id, {
            include: [{ model: Hippodrome }],
        });

        if (!race) {
            return res.status(404).json({ error: 'Скачка не найдена' });
        }

        res.json(race);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/races ──────────────────────────────────────────────────────────
// Добавить скачку
// Body: { name, hippodrome_id, date, time, prize }
router.post('/', async (req, res) => {
    try {
        const { name, hippodrome_id, date, time, prize } = req.body;

        if (!name || !hippodrome_id || !date) {
            return res.status(400).json({ error: 'Поля name, hippodrome_id и date обязательны' });
        }

        const race = await Race.create({ name, hippodrome_id, date, time, prize });
        res.status(201).json(race);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── PUT /api/races/:id ───────────────────────────────────────────────────────
// Обновить данные скачки
// Body: { name?, hippodrome_id?, date?, time?, prize? }
router.put('/:id', async (req, res) => {
    try {
        const race = await Race.findByPk(req.params.id);

        if (!race) {
            return res.status(404).json({ error: 'Скачка не найдена' });
        }

        const { name, hippodrome_id, date, time, prize, status } = req.body;
        await race.update({ name, hippodrome_id, date, time, prize, status });

        res.json(race);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/races/:id ────────────────────────────────────────────────────
// Удалить скачку по идентификатору
router.delete('/:id', async (req, res) => {
    try {
        const race = await Race.findByPk(req.params.id);

        if (!race) {
            return res.status(404).json({ error: 'Скачка не найдена' });
        }

        await race.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/races/:id/results ───────────────────────────────────────────────
// Получить результаты заданной скачки
router.get('/:id/results', async (req, res) => {
    try {
        const race = await Race.findByPk(req.params.id);

        if (!race) {
            return res.status(404).json({ error: 'Скачка не найдена' });
        }

        const results = await Participation.findAll({
            where: { race_id: req.params.id },
            include: [
                { model: Horse, attributes: ['id', 'nickname', 'color'] },
                { model: User, as: 'Jockey', attributes: ['id', 'full_name', 'license'] },
            ],
            order: [['place', 'ASC']], // сортируем по занятому месту
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/races/:id/results ─────────────────────────────────────────────
// Добавить результат участника в скачку
// Body: { horse_id, jockey_id, place }
router.post('/:id/results', async (req, res) => {
    try {
        const race = await Race.findByPk(req.params.id);

        if (!race) {
            return res.status(404).json({ error: 'Скачка не найдена' });
        }

        const { horse_id, jockey_id, place } = req.body;

        if (!horse_id || !jockey_id) {
            return res.status(400).json({ error: 'Поля horse_id и jockey_id обязательны' });
        }

        const result = await Participation.create({
            race_id: req.params.id,
            horse_id,
            jockey_id,
            place,
        });

        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;