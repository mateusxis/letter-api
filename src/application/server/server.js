const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = () => {
  const app = new Koa();
  const router = new Router();

  router.get('/liveness', async (ctx) => {
    ctx.body = 'OK';
  });

  app.use(cors()).use(router.routes());

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