"use strict";
// const uuid = require("uuid");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function createUser(req, res, next) {
  next(new Error("no implementation"));
}

module.exports = {
  createUser,
};
