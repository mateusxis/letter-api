const Router = require('koa-router');

module.exports = ({ letterDomain, letterService }) => {
  const router = new Router();

  router.get('/liveness', async (ctx) => {
    ctx.body = 'OK';
  });

  router.get('/readiness', async (ctx) => {
    const isFulfilled = await letterService.isFulfilled();

    ctx.body = isFulfilled ? 'OK' : 'NOK';
  });

  router.get('/letters', async (ctx) => {
    const letters = await letterDomain.getLetters();

    ctx.body = letters;
  });

  return router;
};
