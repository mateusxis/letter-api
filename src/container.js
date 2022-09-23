const { createContainer, asFunction } = require('awilix');

const router = require('./application/routes');
const server = require('./application/server');
const configEnvs = require('./config');

const container = createContainer();

container.register({
  config: asFunction(configEnvs).singleton(),
  router: asFunction(router).singleton(),
  server: asFunction(server).singleton()
});

module.exports = container;
