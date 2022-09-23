const container = require('./src/container');

const server = container.resolve('server');

server.start();
