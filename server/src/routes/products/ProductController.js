"use strict";
// eslint-disable-next-line
const express = require("express");
const { validationResult } = require("express-validator");
const KnexDriver = require("../../../driver/KnexDriver");
const Tables = require("../../../driver/Table");
const {
  createErrorResponse,
  createSuccessResponse,
} = require("../../utils/ResponseFactory");
const { v4: uuid } = require("uuid");
const chalk = require("chalk");
const { getUserFromAuth } = require("./../../middlewares/AuthMiddleware");

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
  const generatedUniqueId = uuid();

  try {
    // Insert the product
    const insertResponse = await KnexDriver.insert({
      Id: generatedUniqueId,
      Price: price,
      Name: name,
      Description: description,
    }).into(Tables.Products);

    console.log(
      chalk.gray(
        `creating ${insertResponse} product with metadata ${JSON.stringify({
          Id: generatedUniqueId,
          Price: price,
          Name: name,
          Description: description,
        })}`,
      ),
    );

    // Insert user product
    const user = getUserFromAuth(req);
    const userId = user.id;

    await KnexDriver.insert({
      UserId: userId,
      ProductId: generatedUniqueId,
    }).into(Tables.UserProducts);

    // console.log(`result `, insertionCenterHooks);

    res.json(createSuccessResponse({ id: generatedUniqueId }));
  } catch (err) {
    next(err);
  }
}

module.exports = { createProduct };
