const app = require('./app');
const migrationsManager = require('./migrations');
const config = require('./config');
const logger = require('./app/logger');

const port = config.common.api.port || 8080;

Promise.resolve()
  .then(() => migrationsManager.check())
  .then(async () => {
    app.listen(port);
    logger.info(`Listening on port: ${port}`);
  })
  .catch(err => console.log(err));
