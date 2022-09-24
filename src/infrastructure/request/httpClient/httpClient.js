const retry = require('async-retry');
const axios = require('axios');
const RequestError = require('../RequestError');

const transformAxiosResponse = (axiosResponse) => ({
  status: axiosResponse?.status,
  statusText: axiosResponse?.statusText,
  headers: axiosResponse?.headers,
  data: !axiosResponse?.headers?.['content-type'] && axiosResponse?.data === '' ? null : axiosResponse?.data
});

const httpClientRequest = async (url, options) => {
  const config = {
    ...options,
    url
  };

  try {
    const axiosResponse = await axios({
      url,
      method: options?.method,
      timeout: options?.timeout,
      headers: options?.headers,
      params: options?.params,
      data: options?.body,
      withCredentials: options?.credentials,
      signal: options?.signal,
      auth: options?.auth,
      validateStatus: (status) => status >= 200 && status < 300
    });

    const response = transformAxiosResponse(axiosResponse);

    response.config = config;

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = transformAxiosResponse(error.response);

      response.config = config;

      throw new RequestError(error.message, {
        response
      });
    }

    throw error;
  }
};

const httpClient = async (url, options) => {
  if (options?.retry?.retries > 0) {
    return retry(
      async (bail) => {
        try {
          const response = await httpClientRequest(url, options);

          return response;
        } catch (error) {
          if (!options.retry.condition(error)) {
            return bail(error);
          }

          throw error;
        }
      },
      {
        retries: options.retry.retries,
        onRetry: (error) => options.retry.onRetry?.(error)
      }
    );
  }

  return httpClientRequest(url, options);
};

module.exports = httpClient;
