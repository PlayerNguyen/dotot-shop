"use strict";
// const uuid = require("uuid");
const { validationResult } = require("express-validator");
const { createErrorResponse } = require("../../utils/ResponseFactory");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function createUser(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(
        createErrorResponse(`Missing or invalid fields`, undefined, errors),
      );
  } else {
  }
}

module.exports = {
  createUser,
};
