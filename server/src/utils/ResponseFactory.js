"use strict";
module.exports = {
  createSuccessResponse: (data) => {
    // Set to success if the status is empty

    return {
      status: "success",
      data,
    };
  },

  createFailResponse: (data) => {
    return {
      status: "fail",
      data,
    };
  },
  /**
   * Create a error response object
   *
   * @param {string} message
   * @param {number | string | undefined} code
   * @param {any | undefined} data
   * @return {object} an object
   */
  createErrorResponse: (message, code, data) => {
    if (!message) {
      throw Error(`message cannot be undefined`);
    }
    return { status: "error", message, code, data };
  },
};
