const logger = require('./logger');
const logLevel = require('loglevel');

jest.mock('loglevel');

describe('logger()', () => {
  it('should call logger.debug', () => {
    logger().debug('debug');

    expect(logLevel.debug).toHaveBeenCalledWith('debug');
  });

  it('should call logger.info', () => {
    logger().info('info');

    expect(logLevel.info).toHaveBeenCalledWith('info');
  });

  it('should call logger.warn', () => {
    logger().warn('warn');

    expect(logLevel.warn).toHaveBeenCalledWith('warn');
  });

  it('should call logger.error', () => {
    logger().error('error');

    expect(logLevel.error).toHaveBeenCalledWith('error');
  });
});
