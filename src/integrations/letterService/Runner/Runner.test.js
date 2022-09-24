const Runner = require('./Runner');

jest.useFakeTimers();

class FakeService {
  constructor() {
    this.data = false;
  }

  getIdentifier() {
    return 'Service Identifier';
  }

  isFulfilled() {
    return this.data;
  }

  async refresh() {
    this.data = true;
  }
}

class FakeLogger {
  info() {}

  error() {}

  debug() {}
}

describe('Runner()', () => {
  describe('isInitialized()', () => {
    it('should call service.isFulfilled()', async () => {
      const service = new FakeService();
      const logger = new FakeLogger();

      const runner = new Runner({ service, logger, dataRefreshInterval: 30000 });
      const spyServiceIsFullfilled = jest.spyOn(service, 'isFulfilled');

      await runner.isInitialized();

      expect(spyServiceIsFullfilled).toHaveBeenCalled();
    });
  });

  describe('init()', () => {
    beforeEach((done) => {
      jest.clearAllMocks();
      done();
    });

    it('should initialize runner without logger', async () => {
      const service = new FakeService();

      const runner = new Runner({ service, dataRefreshInterval: 30000 });
      await runner.init();

      expect(runner.isInitialized()).toBeTruthy();
      expect(runner.isRunning()).toBeTruthy();
    });

    it('should initialize correctly and schedule next tick', async () => {
      const service = new FakeService();
      const logger = new FakeLogger();

      const runner = new Runner({ service, logger, dataRefreshInterval: 30000 });
      await runner.init();

      expect(runner.isInitialized()).toBeTruthy();
      expect(runner.isRunning()).toBeTruthy();
      jest.advanceTimersByTime(30000);
      expect(runner.isRunning()).toBeTruthy();
    });

    it('should schedule next tick', async () => {
      const service = new FakeService();
      const logger = new FakeLogger();

      const spyServiceRefresh = jest.spyOn(service, 'refresh');

      const runner = new Runner({ service, logger, dataRefreshInterval: 30000 });
      await runner.refresh();

      expect(runner.isInitialized()).toBeTruthy();
      expect(runner.isRunning()).toBeFalsy();

      await runner.init();

      expect(runner.isInitialized()).toBeTruthy();
      expect(runner.isRunning()).toBeTruthy();
      expect(spyServiceRefresh).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(30000);

      expect(runner.isRunning()).toBeTruthy();
      expect(spyServiceRefresh).toHaveBeenCalledTimes(2);
    });

    it('should initialize data', async () => {
      const service = new FakeService();

      const runner = new Runner({ service, dataRefreshInterval: 30000 });

      runner.run();

      expect(runner.isInitialized()).toBeFalsy();
      expect(runner.isRunning()).toBeTruthy();

      await runner.init();

      expect(runner.isInitialized()).toBeTruthy();
      expect(runner.isRunning()).toBeTruthy();
    });

    it('should log when client is already initialized and running', async () => {
      const service = new FakeService();
      const logger = new FakeLogger();

      const spyLogger = jest.spyOn(logger, 'info');
      const runner = new Runner({ service, logger, dataRefreshInterval: 30000 });

      await runner.init();
      await runner.init();

      expect(runner.isInitialized()).toBeTruthy();
      expect(runner.isRunning()).toBeTruthy();
      expect(spyLogger).toHaveBeenCalledWith('[Service Identifier] Client is already initialized and running');
    });

    it('should not run or refresh twice when client is already initialized and running', async () => {
      const service = new FakeService();

      const runner = new Runner({ service, dataRefreshInterval: 30000 });
      const spyRunnerRefresh = jest.spyOn(runner, 'refresh');
      const spyRunnerRun = jest.spyOn(runner, 'run');

      await runner.init();
      await runner.init();

      expect(runner.isInitialized()).toBeTruthy();
      expect(runner.isRunning()).toBeTruthy();

      expect(spyRunnerRefresh).toHaveBeenCalledTimes(1);
      expect(spyRunnerRun).toHaveBeenCalledTimes(1);
    });
  });

  describe('run()', () => {
    beforeEach((done) => {
      jest.clearAllMocks();
      done();
    });

    it('should schedule next tick', () => {
      const service = new FakeService();
      const logger = new FakeLogger();

      const runner = new Runner({ service, logger, dataRefreshInterval: 30000 });
      const spyServiceRefresh = jest.spyOn(service, 'refresh');

      expect(runner.isInitialized()).toBeFalsy();
      expect(runner.isRunning()).toBeFalsy();

      runner.run();

      expect(runner.isInitialized()).toBeFalsy();
      expect(runner.isRunning()).toBeTruthy();
      expect(spyServiceRefresh).not.toHaveBeenCalled();

      jest.advanceTimersByTime(30000);

      expect(spyServiceRefresh).toHaveBeenCalledTimes(1);
    });

    it('should raise exception when triyng to run an already initialized and running service', async () => {
      const service = new FakeService();
      const logger = new FakeLogger();

      const runner = new Runner({ service, logger, dataRefreshInterval: 30000 });

      await runner.init();
      expect(() => runner.run()).toThrow('Client is already running');
    });

    it('should raise exception when re-runned', () => {
      const service = new FakeService();
      const logger = new FakeLogger();

      const runner = new Runner({ service, logger, dataRefreshInterval: 30000 });

      runner.run();
      expect(() => runner.run()).toThrow('Client is already running');
    });
  });

  describe('stop()', () => {
    beforeEach((done) => {
      jest.clearAllMocks();
      done();
    });

    it('should stop the next tick when the service is already initialized and running', async () => {
      const service = new FakeService();
      const logger = new FakeLogger();

      const runner = new Runner({ service, logger, dataRefreshInterval: 30000 });
      expect(runner.isInitialized()).toBeFalsy();
      expect(runner.isRunning()).toBeFalsy();

      await runner.init();

      expect(runner.isInitialized()).toBeTruthy();
      expect(runner.isRunning()).toBeTruthy();

      runner.stop();

      expect(runner.isRunning()).toBeFalsy();
    });

    it('should stop the next tick when the service is already running', () => {
      const service = new FakeService();
      const logger = new FakeLogger();

      const runner = new Runner({ service, logger, dataRefreshInterval: 30000 });

      runner.run();

      expect(runner.isInitialized()).toBeFalsy();
      expect(runner.isRunning()).toBeTruthy();

      runner.stop();

      expect(runner.isInitialized()).toBeFalsy();
      expect(runner.isRunning()).toBeFalsy();
    });

    it('should raise exception when stop the service already stopped', async () => {
      const service = new FakeService();
      const logger = new FakeLogger();

      const runner = new Runner({ service, logger, dataRefreshInterval: 30000 });

      expect(() => runner.stop()).toThrow('Client is not running');

      await runner.init();
      runner.stop();

      expect(() => runner.stop()).toThrow('Client is not running');
      expect(runner.isInitialized()).toBeTruthy();
      expect(runner.isRunning()).toBeFalsy();
    });
  });

  describe('refresh()', () => {
    beforeEach((done) => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
      done();
    });

    it('should initialize data successfully', async () => {
      const service = new FakeService();
      const logger = new FakeLogger();

      const runner = new Runner({ service, logger, dataRefreshInterval: 30000 });
      const spyRefresh = jest.spyOn(service, 'refresh');
      const spyLogger = jest.spyOn(logger, 'info');

      await runner.refresh();

      expect(runner.isInitialized()).toBeTruthy();
      expect(runner.isRunning()).toBeFalsy();
      expect(spyRefresh).toHaveBeenCalled();
      expect(spyLogger).toHaveBeenLastCalledWith('[Service Identifier] Data initialized successfully');
    });

    it('should update data successfully', async () => {
      const service = new FakeService();
      const logger = new FakeLogger();

      const runner = new Runner({ service, logger, dataRefreshInterval: 30000 });
      const spyRefresh = jest.spyOn(service, 'refresh');
      const spyLogger = jest.spyOn(logger, 'info');

      await runner.refresh();
      await runner.refresh();

      expect(runner.isInitialized()).toBeTruthy();
      expect(runner.isRunning()).toBeFalsy();
      expect(spyRefresh).toHaveBeenCalled();
      expect(spyLogger).toHaveBeenLastCalledWith('[Service Identifier] Data updated successfully');
    });

    it('should throw exception when service fails on refreshing it is not initialized', async () => {
      const service = new FakeService();

      const spyRefresh = jest.spyOn(service, 'refresh').mockImplementationOnce(() => {
        throw Error('Network Error');
      });
      const runner = new Runner({ service });

      await expect(runner.refresh()).rejects.toThrow('Initialization failed');
      expect(spyRefresh).toHaveBeenCalled();
    });

    it('should not throw exception when service fails on refreshing but it was already initialized', async () => {
      const service = new FakeService();

      const runner = new Runner({ service });

      await runner.init();

      const spyServiceRefresh = jest.spyOn(service, 'refresh').mockImplementationOnce(() => {
        throw Error('Network Error');
      });

      await expect(runner.refresh()).resolves.not.toThrow();
      expect(spyServiceRefresh).toHaveBeenCalled();
    });

    it('should log error when service throws an exception on refreshing', async () => {
      const service = new FakeService();
      const logger = new FakeLogger();

      const spyLogger = jest.spyOn(logger, 'error');
      const spyRefresh = jest.spyOn(service, 'refresh').mockImplementationOnce(() => {
        throw Error('Network Error');
      });

      const runner = new Runner({ service, logger });

      await expect(runner.refresh()).rejects.toThrow('Initialization failed');
      expect(spyRefresh).toHaveBeenCalled();
      expect(spyLogger).toHaveBeenLastCalledWith('[Service Identifier] Unable to refresh data');
    });
  });

  describe('getService()', () => {
    it('should return a service', () => {
      const service = new FakeService();
      const logger = new FakeLogger();

      const runner = new Runner({ service, logger });

      expect(runner.getService()).toEqual(service);
    });
  });
});
