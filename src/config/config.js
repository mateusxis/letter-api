const dotenv = require('dotenv');

module.exports = () => {
  if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
  }

  const getNodeEnv = () => {
    return process.env.NODE_ENV || 'development';
  };

  const getPortServer = () => {
    if (!process.env.PORT_SERVER) {
      throw new Error('"PORT_SERVER" must be defined.');
    }

    return process.env.PORT_SERVER;
  };

  const getApiBaseUrl = () => {
    const url = process.env.JSON_SERVER_API_BASE_URL;

    if (url) return url;

    throw new Error('"JSON_SERVER_API_BASE_URL" must be defined.');
  };

  const getApiDataRefreshInterval = () => {
    const interval = Number(process.env.SERVICE_LETTER_DATA_REFRESH_INTERVAL_MS);

    if (interval) return interval;

    throw new Error('"SERVICE_LETTER_DATA_REFRESH_INTERVAL_MS" must be defined.');
  };

  const getApiRequestTimeout = () => {
    const timeout = Number(process.env.SERVICE_LETTER_REQUEST_TIMEOUT_MS);

    if (timeout) return timeout;

    throw new Error('"SERVICE_LETTER_REQUEST_TIMEOUT_MS" must be defined.');
  };

  return {
    apiBaseUrl: getApiBaseUrl(),
    apiDataRefreshInterval: getApiDataRefreshInterval(),
    apiRequestTimeout: getApiRequestTimeout(),
    portServer: getPortServer(),
    nodeEnv: getNodeEnv()
  };
};
