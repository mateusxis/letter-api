const Router = require('koa-router');

module.exports = () => {
  const rootRouter = require('./root')();

  const router = new Router();

  router.use('/', rootRouter.routes(), rootRouter.allowedMethods());

  return router;
};
