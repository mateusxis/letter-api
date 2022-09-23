const Router = require('koa-router');

module.exports = () => {
  const router = new Router();

  router.get('liveness', async (ctx) => {
    ctx.body = 'OK';
  });

  return router;
};
