require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

const horsesRouter  = require('./routes/horses');
const jockeysRouter = require('./routes/jockeys');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/horses',  horsesRouter);
app.use('/api/jockeys', jockeysRouter);
app.use('/api/owners', ownersRouter);
app.use('/api/races', racesRouter);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Подключение к PostgreSQL установлено');

        // sequelize.sync({ force: false }) — создаёт таблицы, если их нет.
        // Раскомментируйте при первом запуске или используйте миграции.
        // await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Не удалось подключиться к БД:', err.message);
        process.exit(1);
    }
})();