const RequestError = require('./RequestError');

describe('RequestError()', () => {
  it('should expose request information', () => {
    const requestError = new RequestError('Request error.', {
      response: {
        data: {},
        status: 404,
        statusText: 'Not found',
        headers: {}
      }
    });

    expect(requestError).toStrictEqual(
      expect.objectContaining({
        message: 'Request error.',
        response: {
          data: {},
          status: 404,
          statusText: 'Not found',
          headers: {}
        }
      })
    );
  });
});
