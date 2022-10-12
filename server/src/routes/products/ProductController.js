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

/**
 * Get a product by a specific id
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function getProductFromId(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(createErrorResponse("Invalid parameter", undefined, errors));
    return next();
  }

  const { productId } = req.params;

  try {
    const product = await KnexDriver.select(
      `${Tables.Products}.*`,
      `${Tables.Users}.Id as userId`,
      `${Tables.Users}.FirstName`,
      `${Tables.Users}.LastName`,
    )
      .from(Tables.Products)
      .where(`${Tables.Products}.Id`, productId)
      .join(
        Tables.UserProducts,
        `${Tables.Products}.Id`,
        "=",
        `${Tables.UserProducts}.ProductId`,
      )
      .join(
        Tables.Users,
        `${Tables.UserProducts}.UserId`,
        "=",
        `${Tables.Users}.Id`,
      )
      .first();
    if (!product) {
      res.status(404).json(createErrorResponse("Product not found"));
      return next();
    }

    const responseUser = {
      name: product.Name,
      description: product.Description,
      price: product.Price,
      id: product.Id,
      views: product.Views,
      likes: product.Likes,
      user: {
        id: product.userId,
        firstName: product.FirstName,
        lastName: product.LastName,
      },
    };

    res.json(createSuccessResponse(responseUser));
  } catch (e) {
    next(e);
  }
}
/**
 * Remove the product using specific id
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function removeProduct(req, res, next) {}

/**
 * Get all products with limit
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function getAllProducts(req, res, next) {
  // const { limit, page, search } = req.params;
}

module.exports = { createProduct, getProductFromId, getAllProducts };
