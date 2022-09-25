const { createContainer, asFunction } = require('awilix');

const router = require('./application/routes');
const server = require('./application/server');
const letterDomain = require('./domain/letter');
const requestFactory = require('./infrastructure/request');
const loggerFactory = require('./infrastructure/logger');
const letterService = require('./integrations/letterService');
const configEnvs = require('./config');

const container = createContainer();

container.register({
  config: asFunction(configEnvs).singleton(),
  letterDomain: asFunction(letterDomain).singleton(),
  letterService: asFunction(letterService).singleton(),
  logger: asFunction(loggerFactory).singleton(),
  request: asFunction(requestFactory).singleton(),
  router: asFunction(router).singleton(),
  server: asFunction(server).singleton()
});

module.exports = container;
