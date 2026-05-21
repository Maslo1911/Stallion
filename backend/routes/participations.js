const { Router } = require('express');
const { Participation, Horse, User, Race, Hippodrome } = require('../models');

const router = Router();

// ─── GET /api/participations ──────────────────────────────────────────────────
// Получить список всех участий (с лошадью, жокеем и скачкой)
router.get('/', async (req, res) => {
    try {
        const participations = await Participation.findAll({
            include: [
                { model: Horse },
                { model: User, as: 'Jockey' },
                {
                    model: Race,
                    include: [{ model: Hippodrome, attributes: ['id', 'name', 'city'] }]
                }
            ]
        });
        res.json(participations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/participations ─────────────────────────────────────────────────
// Зарегистрировать участие
// Body: { race_id, horse_id, jockey_id, place }
router.post('/', async (req, res) => {
    try {
        const { race_id, horse_id, jockey_id, place } = req.body;

        if (!race_id || !horse_id || !jockey_id) {
            return res.status(400).json({ error: 'Поля race_id, horse_id и jockey_id обязательны' });
        }

        const participation = await Participation.create({ race_id, horse_id, jockey_id, place });

        // Вернуть созданное участие с подгруженными связями
        const fullParticipation = await Participation.findByPk(participation.id, {
            include: [
                { model: Horse },
                { model: User, as: 'Jockey' },
                { model: Race }
            ]
        });

        res.status(201).json(fullParticipation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── PUT /api/participations/:id ──────────────────────────────────────────────
// Обновить данные участия (например, установить место)
// Body: { place }
router.put('/:id', async (req, res) => {
    try {
        const participation = await Participation.findByPk(req.params.id);

        if (!participation) {
            return res.status(404).json({ error: 'Участие не найдено' });
        }

        const { place } = req.body;
        await participation.update({ place });

        const fullParticipation = await Participation.findByPk(participation.id, {
            include: [
                { model: Horse },
                { model: User, as: 'Jockey' },
                { model: Race }
            ]
        });

        res.json(fullParticipation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/participations/:id ───────────────────────────────────────────
// Удалить/отменить участие по идентификатору
router.delete('/:id', async (req, res) => {
    try {
        const participation = await Participation.findByPk(req.params.id);

        if (!participation) {
            return res.status(404).json({ error: 'Участие не найдено' });
        }

        await participation.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
