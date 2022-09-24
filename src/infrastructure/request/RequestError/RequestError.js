class RequestError extends Error {
  constructor(message, metadata) {
    super(message);

    this.message = message;
    this.response = metadata.response;
    this.isRequestError = true;
  }
}

module.exports = RequestError;
