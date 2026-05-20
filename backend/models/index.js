const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ─── Owner ───────────────────────────────────────────────────────────────────
const Owner = sequelize.define('Owner', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name:     { type: DataTypes.STRING, allowNull: false },
    phone_number:  { type: DataTypes.STRING },
    address:       { type: DataTypes.STRING },
}, { tableName: 'owner', timestamps: false });

// ─── Horse ────────────────────────────────────────────────────────────────────
const Horse = sequelize.define('Horse', {
    id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nickname: { type: DataTypes.STRING, allowNull: false },
    color:    { type: DataTypes.STRING },
    age:      { type: DataTypes.INTEGER },
    owner_id: { type: DataTypes.INTEGER, references: { model: Owner, key: 'id' } },
}, { tableName: 'horse', timestamps: false });

// ─── Jockey ───────────────────────────────────────────────────────────────────
const Jockey = sequelize.define('Jockey', {
    id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING, allowNull: false },
    age:       { type: DataTypes.INTEGER },
    license:   { type: DataTypes.STRING },
}, { tableName: 'jokey', timestamps: false });

// ─── Hippodrome ───────────────────────────────────────────────────────────────
const Hippodrome = sequelize.define('Hippodrome', {
    id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:    { type: DataTypes.STRING, allowNull: false },
    city:    { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
}, { tableName: 'hippodrome', timestamps: false });

// ─── Race ─────────────────────────────────────────────────────────────────────
const Race = sequelize.define('Race', {
    id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:           { type: DataTypes.STRING, allowNull: false },
    hippodrome_id:  { type: DataTypes.INTEGER, references: { model: Hippodrome, key: 'id' } },
    date:           { type: DataTypes.DATEONLY },
    time:           { type: DataTypes.TIME },
    prize:          { type: DataTypes.DECIMAL(12, 2) },
}, { tableName: 'race', timestamps: false });

// ─── Participation ────────────────────────────────────────────────────────────
const Participation = sequelize.define('Participation', {
    id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    race_id:   { type: DataTypes.INTEGER, references: { model: Race,   key: 'id' } },
    horse_id:  { type: DataTypes.INTEGER, references: { model: Horse,  key: 'id' } },
    jockey_id: { type: DataTypes.INTEGER, references: { model: Jockey, key: 'id' } },
    place:     { type: DataTypes.INTEGER },
}, { tableName: 'participation', timestamps: false });

// ─── Associations ─────────────────────────────────────────────────────────────
Owner.hasMany(Horse,            { foreignKey: 'owner_id' });
Horse.belongsTo(Owner,          { foreignKey: 'owner_id' });

Hippodrome.hasMany(Race,        { foreignKey: 'hippodrome_id' });
Race.belongsTo(Hippodrome,      { foreignKey: 'hippodrome_id' });

Race.hasMany(Participation,     { foreignKey: 'race_id',   as: 'participations' });
Horse.hasMany(Participation,    { foreignKey: 'horse_id' });
Jockey.hasMany(Participation,   { foreignKey: 'jockey_id' });

Participation.belongsTo(Race,   { foreignKey: 'race_id' });
Participation.belongsTo(Horse,  { foreignKey: 'horse_id' });
Participation.belongsTo(Jockey, { foreignKey: 'jockey_id' });

module.exports = { sequelize, Owner, Horse, Jockey, Hippodrome, Race, Participation };