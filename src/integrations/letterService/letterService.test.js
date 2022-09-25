const letterService = require('./letterService');
const Service = require('./Service');
const Runner = require('./Runner');

jest.mock('./Service');
jest.mock('./Runner');

const logger = {};
const request = () => jest.fn();
const config = {
  apiBaseUrl: 'https://json-server.com',
  apiDataRefreshInterval: 60000,
  apiRequestTimeout: 5000
};

describe('letterService', () => {
  describe('init()', () => {
    beforeEach((done) => {
      jest.clearAllMocks();
      done();
    });

    it('should initiate service', async () => {
      await letterService({ logger, config, request }).init({ logger });

      const mockRunner = Runner.mock.instances[0];

      expect(Service).toHaveBeenNthCalledWith(1, {
        url: 'https://json-server.com',
        timeout: 5000,
        request
      });
      expect(Runner).toHaveBeenNthCalledWith(1, { service: expect.any(Service), logger, dataRefreshInterval: 60000 });
      expect(mockRunner.init).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLetters()', () => {
    beforeEach((done) => {
      jest.clearAllMocks();
      done();
    });

    it('should call Service.getLetters() ', async () => {
      await letterService({ logger, config, request }).init({ logger });

      const mockService = Service.mock.instances[0];

      letterService({ logger, config, request }).getLetters();

      expect(mockService.getLetters).toHaveBeenNthCalledWith(1);
    });
  });

  describe('isFulfilled()', () => {
    beforeEach((done) => {
      jest.clearAllMocks();
      done();
    });

    it('should call Service.isFulfilled() ', async () => {
      await letterService({ logger, config, request }).init({ logger });

      const mockService = Service.mock.instances[0];

      letterService({ logger, config, request }).isFulfilled();

      expect(mockService.isFulfilled).toHaveBeenNthCalledWith(1);
    });
  });
});
