"use strict";
// eslint-disable-next-line
const express = require("express");
const chalk = require("chalk");
const { createErrorResponse } = require("./ResponseFactory");

/**
 *
 * @param {Error} error the error to catch
 * @param {express.Request} req request parameter
 * @param {express.Response} res response parameter
 * @param {express.NextFunction} next next function
 */
function ErrorHandler(error, req, res, next) {
  console.error(chalk.gray(`======= [Express Error] =======`));
  console.error(chalk.redBright(error.stack));

  res.status(500).json(createErrorResponse("Internal Error"));
}

module.exports = ErrorHandler;
