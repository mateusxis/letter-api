const nock = require('nock');
const httpClient = require('./httpClient');
const RequestError = require('../RequestError');

const BASE_PATH = 'http://request';

describe('httpClient()', () => {
  it('should make a GET request', async () => {
    const usersData = [
      {
        id: 1,
        nickname: 'mateusxis',
        name: 'Mateus'
      }
    ];

    nock(BASE_PATH).get('/users').reply(200, usersData);

    const response = await httpClient(`${BASE_PATH}/users`, {
      method: 'GET'
    });

    expect(response).toStrictEqual({
      status: 200,
      statusText: null, // Sadly, Nock doesn't return statusText.
      data: usersData,
      headers: {
        'content-type': 'application/json'
      },
      config: {
        method: 'GET',
        url: `${BASE_PATH}/users`
      }
    });
  });

  it('should make a POST request', async () => {
    nock(BASE_PATH)
      .post('/users', ({ nickname, name }) => Boolean(nickname) && Boolean(name))
      .reply(201);

    const response = await httpClient(`${BASE_PATH}/users`, {
      method: 'POST',
      body: {
        nickname: 'rafael.vision',
        name: 'Rafael'
      }
    });

    expect(response).toStrictEqual({
      status: 201,
      data: null,
      headers: {},
      statusText: null, // Sadly, Nock doesn't return statusText.
      config: {
        method: 'POST',
        body: {
          nickname: 'rafael.vision',
          name: 'Rafael'
        },
        url: `${BASE_PATH}/users`
      }
    });
  });

  it('should make a PUT request', async () => {
    nock(BASE_PATH).put('/users').query({ id: 1 }).reply(201);

    const response = await httpClient(`${BASE_PATH}/users`, {
      method: 'PUT',
      params: {
        id: 1
      },
      body: {
        nickname: 'mateus.vision',
        name: 'Mateus'
      }
    });

    expect(response).toStrictEqual({
      status: 201,
      data: null,
      headers: {},
      statusText: null, // Sadly, Nock doesn't return statusText.
      config: {
        method: 'PUT',
        params: {
          id: 1
        },
        body: {
          nickname: 'mateus.vision',
          name: 'Mateus'
        },
        url: `${BASE_PATH}/users`
      }
    });
  });

  it('should make a DELETE request', async () => {
    nock(BASE_PATH).delete('/users').query({ id: 2 }).reply(204);

    const response = await httpClient(`${BASE_PATH}/users`, {
      method: 'DELETE',
      params: {
        id: 2
      }
    });

    expect(response).toStrictEqual({
      status: 204,
      headers: {},
      data: null,
      statusText: null, // Sadly, Nock doesn't return statusText.
      config: {
        method: 'DELETE',
        params: {
          id: 2
        },
        url: `${BASE_PATH}/users`
      }
    });
  });

  it('should make a PATCH request', async () => {
    nock(BASE_PATH).patch('/users').query({ id: 2 }).reply(204);

    const response = await httpClient(`${BASE_PATH}/users`, {
      method: 'PATCH',
      params: {
        id: 2
      },
      body: {
        title: 'Making an amazing HTTP Client!'
      }
    });

    expect(response).toStrictEqual({
      status: 204,
      headers: {},
      data: null,
      statusText: null, // Sadly, Nock doesn't return statusText.
      config: {
        body: {
          title: 'Making an amazing HTTP Client!'
        },
        method: 'PATCH',
        params: {
          id: 2
        },
        url: `${BASE_PATH}/users`
      }
    });
  });

  it('should set headers on request', async () => {
    nock(BASE_PATH).matchHeader('user-agent', 'httpClient').get('/users').reply(200);

    const response = await httpClient(`${BASE_PATH}/users`, {
      method: 'GET',
      headers: {
        'user-agent': 'httpClient'
      }
    });

    expect(response).toStrictEqual({
      status: 200,
      headers: {},
      data: null,
      statusText: null, // Sadly, Nock doesn't return statusText.
      config: {
        headers: {
          'user-agent': 'httpClient'
        },
        method: 'GET',
        url: `${BASE_PATH}/users`
      }
    });
  });

  it('should retry a request when the server respond with error', async () => {
    const usersData = [
      {
        id: 1,
        nickname: 'mateusxis',
        name: 'Mateus'
      }
    ];

    nock(BASE_PATH).get('/users').reply(400).get('/users').reply(200, usersData);

    const response = await httpClient(`${BASE_PATH}/users`, {
      method: 'GET',
      retry: {
        retries: 1
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
        method: 'GET',
        url: `${BASE_PATH}/users`,
        retry: {
          retries: 1
        }
      }
    });
  });

  it('should throw an expection when attempts complete in error', async () => {
    nock(BASE_PATH).get('/users').reply(400).get('/users').reply(500);

    const actualRequestPromise = () =>
      httpClient(`${BASE_PATH}/users`, {
        method: 'GET',
        retry: {
          retries: 1,
          condition: () => true
        }
      });

    await expect(actualRequestPromise).rejects.toThrow(RequestError);
  });

  it('should throw error when condition is false', async () => {
    nock(BASE_PATH).get('/users').reply(400).get('/users').reply(500);

    const actualRequestPromise = () =>
      httpClient(`${BASE_PATH}/users`, {
        method: 'GET',
        retry: {
          retries: 3,
          condition: (error) => error.response.status <= 500
        }
      });

    await expect(actualRequestPromise).rejects.toThrow(RequestError);
  });

  it('should call onRetry after every failed attempt', async () => {
    const usersData = [
      {
        id: 1,
        nickname: 'mateusxis',
        name: 'Mateus'
      }
    ];

    const mockOnRetry = jest.fn();

    nock(BASE_PATH).get('/users').reply(400).get('/users').reply(200, usersData);

    await httpClient(`${BASE_PATH}/users`, {
      method: 'GET',
      retry: {
        retries: 2,
        onRetry: mockOnRetry
      }
    });

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should throw error when server respond with error status code', async () => {
    nock(BASE_PATH).get('/users').reply(400);

    const actualRequestPromise = () =>
      httpClient(`${BASE_PATH}/users`, {
        method: 'GET'
      });

    await expect(actualRequestPromise).rejects.toThrow(RequestError);
  });

  it('should throw error when server does not respond in time', async () => {
    nock(BASE_PATH).get('/users').delay(1000).reply(200);

    const actualRequestPromise = () =>
      httpClient(`${BASE_PATH}/users`, {
        method: 'GET',
        timeout: 100
      });

    await expect(actualRequestPromise).rejects.toThrow(RequestError);
  });

  it('should not throw a request error on bad httpClient usage', async () => {
    const actualRequestPromise = () => httpClient(null);

    await expect(actualRequestPromise).rejects.not.toThrow(RequestError);
  });

  it('should set response object when request throw any error', async () => {
    nock(BASE_PATH).get('/users').reply(400);

    let responseError;

    try {
      await httpClient(`${BASE_PATH}/users`, {
        method: 'GET'
      });
    } catch (e) {
      responseError = e.response;
    }

    expect(responseError).toStrictEqual({
      status: 400,
      headers: {},
      data: null,
      statusText: null, // Sadly, Nock doesn't return statusText.
      config: {
        method: 'GET',
        url: `${BASE_PATH}/users`
      }
    });
  });
});
