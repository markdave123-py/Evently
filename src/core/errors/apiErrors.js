// Define a type for error details descriptor
/**
 * @typedef {Object} ErrorDetailsDescriptor
 * @property {string} message - Error message
 * @property {string} path - Path where the error occurred
 */

// Base class for API errors
class ApiError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, ApiError.prototype);

    this._statusCode = null;
    this._message = message;
    this._details = null;
  }

  get statusCode() {
    throw new Error('Abstract method "statusCode" must be implemented.');
  }

  get message() {
    return this._message;
  }

  get details() {
    return this._details;
  }
}

class CustomApiError extends ApiError {
  constructor(message, statusCode, details) {
    super(message);
    this._statusCode = statusCode;
    this._details = details;
  }

  get statusCode() {
    return this._statusCode;
  }
}

export { ApiError, CustomApiError };
