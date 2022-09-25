const nock = require('nock');
const RequestError = require('./RequestError');
const request = require('./request')();

const BASE_PATH = 'http://request';

jest.mock('../../../package.json', () => ({
  version: '0.0.0'
}));

describe('request()', () => {
  beforeEach(() => {
    nock.cleanAll();
    delete process.env.FACILITY;
  });

  it('should make a request using default method successfully', async () => {
    const usersData = [
      {
        id: 1,
        nickname: 'mateusxis',
        name: 'Mateus'
      }
    ];

    nock(BASE_PATH).get('/users').reply(200, usersData);

    const response = await request(`${BASE_PATH}/users`);

    expect(response).toStrictEqual({
      status: 200,
      statusText: null, // Sadly, Nock doesn't return statusText.
      data: usersData,
      headers: {
        'content-type': 'application/json'
      },
      config: {
        credentials: false,
        headers: {
          'user-agent': 'request/0.0.0/no-facility'
        },
        method: 'GET',
        timeout: 0,
        url: `${BASE_PATH}/users`,
        retry: {
          retries: 0,
          condition: expect.any(Function)
        }
      }
    });
  });

  it('should set user-agent by default on server', async () => {
    nock(BASE_PATH).matchHeader('user-agent', 'request/0.0.0/no-facility').get('/').reply(200, 'OK', {
      'content-type': 'plain/text'
    });

    const response = await request(BASE_PATH);

    expect(response).toStrictEqual({
      status: 200,
      statusText: null, // Sadly, Nock doesn't return statusText.
      data: 'OK',
      headers: {
        'content-type': 'plain/text'
      },
      config: {
        credentials: false,
        headers: {
          'user-agent': 'request/0.0.0/no-facility'
        },
        method: 'GET',
        timeout: 0,
        url: BASE_PATH,
        retry: {
          retries: 0,
          condition: expect.any(Function)
        }
      }
    });
  });

  it('should set user-agent using facility env of application', async () => {
    process.env.FACILITY = 'service-name';

    nock(BASE_PATH).matchHeader('user-agent', 'request/0.0.0/service-name').get('/').reply(200, 'OK', {
      'content-type': 'plain/text'
    });

    const response = await request(BASE_PATH);

    expect(response).toStrictEqual({
      status: 200,
      statusText: null, // Sadly, Nock doesn't return statusText.
      data: 'OK',
      headers: {
        'content-type': 'plain/text'
      },
      config: {
        credentials: false,
        headers: {
          'user-agent': 'request/0.0.0/service-name'
        },
        method: 'GET',
        timeout: 0,
        url: BASE_PATH,
        retry: {
          retries: 0,
          condition: expect.any(Function)
        }
      }
    });
  });

  it('should overwrite default method', async () => {
    nock(BASE_PATH)
      .post('/users', ({ nickname, name }) => Boolean(nickname) && Boolean(name))
      .reply(201);

    const response = await request(`${BASE_PATH}/users`, {
      method: 'POST',
      body: {
        nickname: 'rafael.vision',
        name: 'Rafael'
      }
    });

    expect(response).toStrictEqual({
      data: null,
      headers: {},
      status: 201,
      statusText: null, // Sadly, Nock doesn't return statusText.
      config: {
        credentials: false,
        headers: {
          'user-agent': 'request/0.0.0/no-facility'
        },
        body: {
          nickname: 'rafael.vision',
          name: 'Rafael'
        },
        method: 'POST',
        timeout: 0,
        url: `${BASE_PATH}/users`,
        retry: {
          retries: 0,
          condition: expect.any(Function)
        }
      }
    });
  });

  it('should overwrite default header user-agent', async () => {
    nock(BASE_PATH).matchHeader('user-agent', 'my-app').get('/').reply(200, 'OK', {
      'content-type': 'plain/text'
    });

    const response = await request(BASE_PATH, {
      headers: {
        'user-agent': 'my-app'
      }
    });

    expect(response).toStrictEqual({
      status: 200,
      statusText: null, // Sadly, Nock doesn't return statusText.
      data: 'OK',
      headers: {
        'content-type': 'plain/text'
      },
      config: {
        credentials: false,
        headers: {
          'user-agent': 'my-app'
        },
        method: 'GET',
        timeout: 0,
        url: BASE_PATH,
        retry: {
          retries: 0,
          condition: expect.any(Function)
        }
      }
    });
  });

  it('should overwrite default retries', async () => {
    const usersData = [
      {
        id: 1,
        nickname: 'mateusxis',
        name: 'Mateus'
      }
    ];

    nock(BASE_PATH).get('/users').reply(200, usersData);

    const response = await request(`${BASE_PATH}/users`, {
      retry: {
        retries: 10
      }
    });

    expect(response).toStrictEqual({
      status: 200,
      statusText: null, // Sadly, Nock doesn't return statusText.
      data: usersData,
      headers: {
        'content-type': 'application/json'
      },
      config: {
        credentials: false,
        headers: {
          'user-agent': 'request/0.0.0/no-facility'
        },
        method: 'GET',
        timeout: 0,
        url: `${BASE_PATH}/users`,
        retry: {
          retries: 10,
          condition: expect.any(Function)
        }
      }
    });
  });

  it('should call condition when retry attempt fail', async () => {
    const usersData = [
      {
        id: 1,
        nickname: 'mateusxis',
        name: 'Mateus'
      }
    ];

    nock(BASE_PATH).get('/users').reply(400).get('/users').reply(200, usersData);

    const mockCondition = jest.fn(() => false);

    let exception;

    try {
      await request(`${BASE_PATH}/users`, {
        retry: {
          retries: 1,
          condition: mockCondition
        }
      });
    } catch (e) {
      exception = e;
    }

    expect(mockCondition).toHaveBeenCalledWith(exception);
  });

  it('should call onRetry', async () => {
    let exception;
    const mockOnRetry = jest.fn();

    nock(BASE_PATH).get('/users').twice().reply(400);

    try {
      await request(`${BASE_PATH}/users`, {
        retry: {
          retries: 1,
          onRetry: mockOnRetry
        }
      });
    } catch (e) {
      exception = e;
    }

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
    expect(mockOnRetry).toHaveBeenCalledWith(exception);
  });

  it('should throw RequestError instance when request timed out', async () => {
    nock(BASE_PATH).get('/').delay(500).reply(200, 'OK');

    const actualExpect = () =>
      request(BASE_PATH, {
        timeout: 100
      });

    await expect(actualExpect).rejects.toThrow(RequestError);
  });

  it('should set response object when throw RequestError', async () => {
    nock(BASE_PATH).get('/').delay(500).reply(200, 'OK');

    let responseError;

    try {
      await request(BASE_PATH, {
        timeout: 100
      });
    } catch (e) {
      responseError = e.response;
    }

    expect(responseError).toStrictEqual({
      config: {
        timeout: 100,
        credentials: false,
        headers: {
          'user-agent': 'request/0.0.0/no-facility'
        },
        method: 'GET',
        url: BASE_PATH,
        retry: {
          retries: 0,
          condition: expect.any(Function)
        }
      },
      data: undefined,
      headers: undefined,
      status: undefined,
      statusText: undefined
    });
  });

  it('should not set user-agent', async () => {
    window = {};

    nock(BASE_PATH).get('/').reply(200, 'OK', {
      'content-type': 'plain/text'
    });

    const response = await request(BASE_PATH);

    expect(response).toStrictEqual({
      status: 200,
      statusText: null, // Sadly, Nock doesn't return statusText.
      data: 'OK',
      headers: {
        'content-type': 'plain/text'
      },
      config: {
        credentials: false,
        method: 'GET',
        timeout: 0,
        url: BASE_PATH,
        retry: {
          retries: 0,
          condition: expect.any(Function)
        }
      }
    });
  });
});
