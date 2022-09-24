const DEFAULT_REFRESH_INTERVAL = 3600000;

class RunnerError extends Error {
  constructor(message) {
    super(message);

    this.name = 'RunnerError';
  }
}

class Runner {
  constructor(options) {
    const { service, logger, dataRefreshInterval = DEFAULT_REFRESH_INTERVAL } = options;
    this.service = service;
    this.logger = logger;
    this.dataRefreshInterval = dataRefreshInterval;
  }

  isInitialized() {
    return Boolean(this.service.isFulfilled());
  }

  isRunning() {
    return Boolean(this.intervalToken);
  }

  async refresh() {
    try {
      const isInitialized = this.isInitialized();
      await this.service.refresh();

      this.logger?.info(
        `[${this.service.getIdentifier()}] Data ${isInitialized ? 'updated' : 'initialized'} successfully`
      );
    } catch (error) {
      this.logger?.error(`[${this.service.getIdentifier()}] Unable to refresh data`);
      if (!this.isInitialized()) throw new RunnerError('Initialization failed');
    }

    this.logger?.debug(
      `[${this.service.getIdentifier()}] Next update at ${new Date(Date.now() + this.dataRefreshInterval)}`
    );
  }

  async init() {
    if (this.isInitialized() && this.isRunning()) {
      this.logger?.info(`[${this.service.getIdentifier()}] Client is already initialized and running`);
      return;
    }

    if (!this.isInitialized()) await this.refresh();
    if (!this.isRunning()) await this.run();
  }

  run() {
    if (this.isRunning()) throw new RunnerError('Client is already running');
    this.intervalToken = setInterval(this.refresh.bind(this), this.dataRefreshInterval);
  }

  stop() {
    if (!this.isRunning()) throw new RunnerError('Client is not running');

    clearInterval(this.intervalToken);

    this.intervalToken = undefined;
  }

  getService() {
    return this.service;
  }
}

module.exports = Runner;
