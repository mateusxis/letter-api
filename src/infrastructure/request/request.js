const merge = require('lodash.merge');
const packageJson = require('../../../package.json');
const httpClient = require('./httpClient');

const isServer = () => typeof window === 'undefined';

module.exports = () => {
  const request = (url, customOptions) => {
    const defaultOptions = {
      method: 'GET',
      timeout: 0,
      credentials: false,
      retry: {
        retries: 0,
        condition: () => true
      }
    };

    if (isServer()) {
      const facility = process.env.FACILITY || 'no-facility';
      defaultOptions.headers = {
        'user-agent': `request/${packageJson.version}/${facility}`
      };
    }

    const options = merge(defaultOptions, customOptions || {});

    return httpClient(url, options);
  };

  return request;
};
