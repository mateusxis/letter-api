const Runner = require('./Runner');
const Service = require('./Service');

let runner = null;
let service = null;

module.exports = ({ logger, request, config }) => {
  const init = async () => {
    const url = config.apiBaseUrl;
    const timeout = config.apiRequestTimeout;
    const dataRefreshInterval = config.apiDataRefreshInterval;

    service = new Service({ url, timeout, request });
    runner = new Runner({ service, logger, dataRefreshInterval });

    await runner.init();
  };

  const getLetters = async () => await service.getLetters();

  const isFulfilled = async () => await service.isFulfilled();

  return {
    init,
    isFulfilled,
    getLetters
  };
};
