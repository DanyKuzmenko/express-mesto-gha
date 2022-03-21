class ErrorNotFound extends Error {
  constructor(message) {
    super(message);
    this.errorMessage = message;
    this.statusCode = 404;
  }
}

module.exports = ErrorNotFound;
