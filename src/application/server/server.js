const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const KoaLogger = require('koa-logger');

module.exports = ({ config, router }) => {
  const app = new Koa();

  app
    .use(new KoaLogger())
    .use(helmet())
    .use(compress())
    .use(cors())
    .use(bodyParser({ enableTypes: ['json'] }))
    .use(router.routes(), router.allowedMethods());

  const start = () => {
    try {
      app.listen(config.portServer, () => {
        console.log(`Server listening on ${config.portServer}`);
      });
    } catch (err) {
      console.log('Problem initializing application dependencies');
      process.exit(1);
    }
  };

  return { start };
};
