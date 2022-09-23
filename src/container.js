const { createContainer, asFunction } = require('awilix');

const router = require('./application/router');
const server = require('./application/server');

const container = createContainer();

container.register({
  router: asFunction(router).singleton(),
  server: asFunction(server).singleton()
});

module.exports = container;