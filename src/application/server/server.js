const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const KoaLogger = require('koa-logger');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = ({ router }) => {
  const app = new Koa();

  app
    .use(new KoaLogger())
    .use(helmet())
    .use(compress())
    .use(cors())
    .use(bodyParser({ enableTypes: ['json'] }))
    .use(router.routes());

  const start = () => {
    try {
      app.listen(process.env.PORT, () => {
        console.log(`Server listening on ${process.env.PORT}`);
      });
    } catch (err) {
      console.log('Problem initializing application dependencies');
      process.exit(1);
    }
  };

  return { start };
};