const config = require('./config');

jest.mock('dotenv', () => ({
  config: jest.fn()
}));

beforeEach(() => {
  process.env.PORT_SERVER = 3000;
  process.env.NODE_ENV = 'development';
  process.env.JSON_SERVER_API_BASE_URL = 'https://json-server.com';
  process.env.SERVICE_LETTER_REQUEST_TIMEOUT_MS = 5000;
  process.env.SERVICE_LETTER_DATA_REFRESH_INTERVAL_MS = 60000;

  jest.resetAllMocks();
});

describe('config()', () => {
  it('should call config return variables', () => {
    expect(config()).toEqual({
      apiBaseUrl: 'https://json-server.com',
      apiDataRefreshInterval: 60000,
      apiRequestTimeout: 5000,
      portServer: '3000',
      nodeEnv: 'development'
    });
  });

  it('should set node env like "production"', () => {
    process.env.NODE_ENV = 'production';

    expect(config().nodeEnv).toEqual('production');
  });

  it('should throw error missing service letter data refresh interval ms variable', () => {
    delete process.env.SERVICE_LETTER_DATA_REFRESH_INTERVAL_MS;

    expect(() => config()).toThrowError('"SERVICE_LETTER_DATA_REFRESH_INTERVAL_MS" must be defined.');
  });

  it('should throw error missing service letter data request timeout ms variable', () => {
    delete process.env.SERVICE_LETTER_REQUEST_TIMEOUT_MS;

    expect(() => config()).toThrowError('"SERVICE_LETTER_REQUEST_TIMEOUT_MS" must be defined.');
  });

  it('should throw error missing json server api base url variable', () => {
    delete process.env.JSON_SERVER_API_BASE_URL;

    expect(() => config()).toThrowError('"JSON_SERVER_API_BASE_URL" must be defined.');
  });

  it('should throw error missing port server variable', () => {
    delete process.env.PORT_SERVER;

    expect(() => config()).toThrowError('"PORT_SERVER" must be defined.');
  });

  it('should throw error missing node env variable', () => {
    delete process.env.NODE_ENV;

    expect(config().nodeEnv).toEqual('development');
  });
});
