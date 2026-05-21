const jwt = require('jsonwebtoken');

/**
 * Проверяет access-токен в заголовке Authorization.
 * При успехе кладёт данные пользователя в req.user и передаёт управление дальше.
 *
 * Использование: router.get('/secret', authenticate, handler)
 */
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];

    // Заголовок должен быть вида: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Токен не передан' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = payload; // { id, role }
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Токен истёк' });
        }
        return res.status(401).json({ error: 'Токен недействителен' });
    }
}

/**
 * Фабрика middleware для проверки роли.
 * Используется после authenticate.
 *
 * Использование: router.delete('/users/:id', authenticate, requireRole('admin'), handler)
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role)) {
            return res.status(403).json({ error: 'Доступ запрещён' });
        }
        next();
    };
}

module.exports = { authenticate, requireRole };