const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
// const config = require('../../config');
// const dbConfig = require('../../config/db')[config.environment];

const basename = path.basename(__filename);
const db = {};
// console.log(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
console.log(process.env.DATABASE_URL, {
  dialect: 'postgres',
  ssl: { rejectUnauthorized: false }
});
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  ssl: { rejectUnauthorized: false }
});

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.endsWith('Model.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
