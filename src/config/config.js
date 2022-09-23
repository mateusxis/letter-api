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

  return {
    portServer: getPortServer(),
    nodeEnv: getNodeEnv()
  };
};
