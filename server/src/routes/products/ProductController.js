"use strict";
// eslint-disable-next-line
const express = require("express");
const { validationResult } = require("express-validator");
const { createErrorResponse } = require("../../utils/ResponseFactory");

/**
 * Create a new product
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function createProduct(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(createErrorResponse("Invalid request body", undefined, errors));

    return next();
  }

  const { price, name, description } = req.body;
}

module.exports = { createProduct };
