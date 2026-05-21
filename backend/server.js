require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const bcrypt = require('bcrypt');

const horsesRouter = require('./routes/horses');
const usersRouter = require('./routes/users');
const ownersRouter = require('./routes/owners');
const racesRouter = require('./routes/races');
const hippodromesRouter = require('./routes/hippodromes');
const participationsRouter = require('./routes/participations');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware (CORS & JSON) ──────────────────────────────────────────────────
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/horses', horsesRouter);
app.use('/api/users', usersRouter);
app.use('/api/owners', ownersRouter);
app.use('/api/races', racesRouter);
app.use('/api/hippodromes', hippodromesRouter);
app.use('/api/participations', participationsRouter);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// ─── Auto-Seeder Utility ──────────────────────────────────────────────────────
const seedDatabase = async () => {
    const { Owner, Hippodrome, User, Role, Permission, Horse, Race, Participation } = require('./models');

    const ownerCount = await Owner.count();
    const horseCount = await Horse.count();
    const userCount = await User.count();
    const raceCount = await Race.count();
    const hippoCount = await Hippodrome.count();
    const partCount = await Participation.count();
    const roleCount = await Role.count();
    const permCount = await Permission.count();

    if (ownerCount > 0 || horseCount > 0 || userCount > 0 || raceCount > 0 || hippoCount > 0 || partCount > 0 || roleCount > 0 || permCount > 0) {
        console.log('ℹ️ База данных уже содержит записи, автозаполнение пропущено.');
        return;
    }

    console.log('🌱 Наполнение базы данных демонстрационными данными...');

    // 1. Роли (Roles)
    await Role.bulkCreate([
        { id: 1, name: 'admin' },
        { id: 2, name: 'jockey' },
    ]);

    // 2. Разрешения (Permissions)
    await Permission.bulkCreate([
        { id: 1, name: 'manage_races' },
        { id: 2, name: 'manage_horses' },
        { id: 3, name: 'register_to_race' },
    ]);

    // 3. Связи Роль-Разрешение (Role-Permission)
    const adminRole = await Role.findByPk(1);
    const jockeyRole = await Role.findByPk(2);

    await adminRole.addPermissions([1, 2, 3]);
    await jockeyRole.addPermissions([3]);

    // 4. Владельцы (Owners)
    await Owner.bulkCreate([
        { id: 1, full_name: 'Уильям Харрисон', phone_number: '+44 7700 900000', address: 'Лондон, Великобритания' },
        { id: 2, full_name: 'Сара Дженкинс', phone_number: '+1 502 555 0199', address: 'Луисвилл, Кентукки' },
    ]);

    // 5. Ипподромы (Hippodromes)
    await Hippodrome.bulkCreate([
        { id: 1, name: 'Королевский Аскот', city: 'Аскот', address: 'Ascot SL5 7JX, UK' },
        { id: 2, name: 'Ипподром Мейдан', city: 'Дубай', address: 'Al Meydan Rd, Dubai, UAE' },
        { id: 3, name: 'Черчилль-Даунс', city: 'Луисвилл', address: '700 Central Ave, KY, USA' },
    ]);

    // 6. Пользователи (Users / Jockeys & Admins)
    const bcrypt = require('bcrypt');

    await User.bulkCreate([
        { id: 1, full_name: 'Фрэнки Деттори', age: 52, license: 'LIC-001', role_id: 2, login: 'jockey1', password_hash: bcrypt.hashSync('jockeypass', 10) },
        { id: 2, full_name: 'Райан Мур', age: 40, license: 'LIC-002', role_id: 2, login: 'jockey2', password_hash: bcrypt.hashSync('jockeypass', 10) },
        { id: 3, full_name: 'Ошин Мерфи', age: 28, license: 'LIC-003', role_id: 2, login: 'jockey3', password_hash: bcrypt.hashSync('jockeypass', 10) },
        { id: 4, full_name: 'Главный Администратор', age: 35, license: null, role_id: 1, login: 'admin', password_hash: bcrypt.hashSync('adminpass', 10) },
    ]);

    // 7. Лошади (Horses)
    await Horse.bulkCreate([
        { id: 1, nickname: 'Удар молнии', color: 'Гнедая', age: 4, owner_id: 1 },
        { id: 2, nickname: 'Полуночное эхо', color: 'Вороная', age: 5, owner_id: 2 },
        { id: 3, nickname: 'Золотой галоп', color: 'Рыжая', age: 3, owner_id: 1 },
        { id: 4, nickname: 'Серебряная стрела', color: 'Серая', age: 6, owner_id: 2 },
    ]);

    // 8. Скачки (Races)
    await Race.bulkCreate([
        { id: 1, name: 'Золотой кубок', hippodrome_id: 1, date: '2026-06-18', time: '15:40:00', prize: 500000.00 },
        { id: 2, name: 'Мировой кубок Дубая', hippodrome_id: 2, date: '2026-03-27', time: '20:45:00', prize: 12000000.00 },
        { id: 3, name: 'Кентукки Дерби', hippodrome_id: 3, date: '2026-05-02', time: '18:50:00', prize: 3000000.00 },
        { id: 4, name: 'Осенний спринт', hippodrome_id: 1, date: '2025-09-15', time: '14:00:00', prize: 50000.00 },
    ]);

    // 9. Участия (Participations)
    await Participation.bulkCreate([
        { id: 1, race_id: 1, horse_id: 1, jockey_id: 1, place: null },
        { id: 2, race_id: 1, horse_id: 2, jockey_id: 2, place: null },
        { id: 3, race_id: 3, horse_id: 3, jockey_id: 3, place: 1 },
        { id: 4, race_id: 4, horse_id: 4, jockey_id: 1, place: 2 },
    ]);

    // Сбросить автоинкремент последовательностей PostgreSQL
    const tables = ['owner', 'horse', 'user', 'role', 'permission', 'hippodrome', 'race', 'participation'];
    for (const t of tables) {
        try {
            await sequelize.query(`SELECT setval('${t}_id_seq', COALESCE((SELECT MAX(id) FROM "${t}"), 0) + 1, false);`);
        } catch (e) {
            console.log(`Warning resetting sequence for table ${t}:`, e.message);
        }
    }

    console.log('✅ База данных успешно заполнена демонстрационными данными!');
};

// ─── Start ────────────────────────────────────────────────────────────────────
(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Подключение к PostgreSQL установлено');

        // Создаем таблицы, если их нет, или обновляем их структуру
        await sequelize.sync({ alter: true });
        console.log('✅ Структура базы данных синхронизирована');

        // Наполняем базу данных демонстрационными данными
        await seedDatabase();

        app.listen(PORT, () => {
            console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Не удалось подключиться к БД:', err.message);
        process.exit(1);
    }
    const valid = await bcrypt.compare('password123', '$2b$10$S0el1lXte1QzvzzFaD2rmO7TB.5KYtfyfhX5PpinaYhUC9XsUpoLW');
    console.log(valid); // true
})();
