const config = require('./config');

jest.mock('dotenv', () => ({
  config: jest.fn()
}));

beforeEach(() => {
  process.env.PORT_SERVER = 3000;
  process.env.NODE_ENV = 'development';

  jest.resetAllMocks();
});

describe('config()', () => {
  it('should call config return variables', () => {
    expect(config()).toEqual({ portServer: '3000', nodeEnv: 'development' });
  });

  it('should set node env like "production"', () => {
    process.env.NODE_ENV = 'production';

    expect(config().nodeEnv).toEqual('production');
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
