const config = require('../config').common.database;
const logger = require('../app/logger');

module.exports = {
  development: {
    username: config.username,
    password: config.password,
    database: config.name,
    host: config.host,
    port: config.port,
    dialect: 'postgres',
    logging: logger.info
  },
  testing: {
    username: config.username,
    password: config.password,
    database: config.name,
    host: config.host,
    port: config.port,
    dialect: 'postgres',
    logging: logger.info
  },
  production: {
    username: config.username,
    password: config.password,
    database: config.name,
    host: config.host,
    port: config.port,
    dialect: 'postgres',
    logging: logger.info,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    }
  }
};
