const logger = require('loglevel');

module.exports = () => {
  const debug = (message) => logger.debug(message);

  const info = (message) => logger.info(message);

  const warn = (message) => logger.warn(message);

  const error = (message) => logger.error(message);

  return { debug, info, warn, error };
};
