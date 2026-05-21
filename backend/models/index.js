const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Permission = sequelize.define('Permission', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { tableName: 'permission', timestamps: false });

const Role = sequelize.define('Role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { tableName: 'role', timestamps: false });

const RolePermission = sequelize.define('RolePermission', {
    role_id: { type: DataTypes.INTEGER },
    permission_id: { type: DataTypes.INTEGER },
}, { tableName: 'role_permission', timestamps: false });

const Owner = sequelize.define('Owner', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
}, { tableName: 'owner', timestamps: false });

const Horse = sequelize.define('Horse', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nickname: { type: DataTypes.STRING, allowNull: false },
    color: { type: DataTypes.STRING },
    age: { type: DataTypes.INTEGER },
    owner_id: { type: DataTypes.INTEGER },
}, { tableName: 'horse', timestamps: false });

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER },
    license: { type: DataTypes.STRING },
    role_id: { type: DataTypes.INTEGER },
    login: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'user', timestamps: false });

const RefreshToken = sequelize.define('RefreshToken', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    token: { type: DataTypes.TEXT, allowNull: false, unique: true },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'refresh_token', timestamps: false });

const Hippodrome = sequelize.define('Hippodrome', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
}, { tableName: 'hippodrome', timestamps: false });

const Race = sequelize.define('Race', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    hippodrome_id: { type: DataTypes.INTEGER },
    date: { type: DataTypes.DATEONLY },
    time: { type: DataTypes.TIME },
    prize: { type: DataTypes.DECIMAL(12, 2) },
    status: { type: DataTypes.STRING, defaultValue: 'planned' },
}, { tableName: 'race', timestamps: false });

const Participation = sequelize.define('Participation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    race_id: { type: DataTypes.INTEGER },
    horse_id: { type: DataTypes.INTEGER },
    jockey_id: { type: DataTypes.INTEGER },
    place: { type: DataTypes.INTEGER },
}, { tableName: 'participation', timestamps: false });

// ─── Associations ─────────────────────────────────────────────────────────────
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id' });

User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

User.hasMany(RefreshToken, { foreignKey: 'user_id' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

Owner.hasMany(Horse, { foreignKey: 'owner_id' });
Horse.belongsTo(Owner, { foreignKey: 'owner_id' });

Hippodrome.hasMany(Race, { foreignKey: 'hippodrome_id' });
Race.belongsTo(Hippodrome, { foreignKey: 'hippodrome_id' });

Race.hasMany(Participation, { foreignKey: 'race_id', as: 'participations' });
Horse.hasMany(Participation, { foreignKey: 'horse_id' });
User.hasMany(Participation, { foreignKey: 'jockey_id' });

Participation.belongsTo(Race, { foreignKey: 'race_id' });
Participation.belongsTo(Horse, { foreignKey: 'horse_id' });
Participation.belongsTo(User, { foreignKey: 'jockey_id', as: 'Jockey' });

module.exports = {
    sequelize,
    Permission, Role, RolePermission,
    Owner, Horse,
    User, RefreshToken,
    Hippodrome, Race, Participation,
};