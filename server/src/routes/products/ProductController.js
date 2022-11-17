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
const AuthMiddleware = require("./../../middlewares/AuthMiddleware");

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
async function removeProduct(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(createErrorResponse("Invalid parameter", undefined, errors));
    return next();
  }

  try {
    const { productId } = req.params;
    const selectedProduct = await KnexDriver.select(
      `${Tables.Products}.*`,
      `${Tables.UserProducts}.UserId`,
    )
      .from(Tables.Products)
      .where(`${Tables.Products}.Id`, productId)
      .join(
        `${Tables.UserProducts}`,
        `${Tables.Products}.Id`,
        "=",
        `${Tables.UserProducts}.ProductId`,
      )
      .first();

    const user = getUserFromAuth(req);

    // Check if the product is empty or not
    if (!selectedProduct) {
      res.status(404).json(createErrorResponse("Product not found"));
      return next();
    }

    // Not the owner and not admin
    if (
      !(user && user.role !== "admin" && user.id !== selectedProduct.UserId)
    ) {
      res
        .status(401)
        .json(createErrorResponse("You have no permission to do this action"));
      return next();
    }

    // Remove the product
    await KnexDriver.del()
      .from(Tables.UserProducts)
      .where("ProductId", productId);
    await KnexDriver.del()
      .from(Tables.ProductCategory)
      .where("ProductId", productId);
    await KnexDriver.del().from(Tables.Products).where("Id", productId);

    res.json(createSuccessResponse());
  } catch (e) {
    next(e);
  }
}
/**
 * Update product using specific id
 * @param {express.Request} req  the request parameter
 * @param {express.Response} res the response parameter
 * @param {express.NextFunction} next the next function
 */
async function updateProduct(req, res, next) {
  try {
    const errors = validationResult(req);

    const { productId } = req.params;
    // Select the product
    const selectedProduct = await KnexDriver.select(
      `${Tables.Products}.*`,
      `${Tables.UserProducts}.UserId`,
    )
      .from(Tables.Products)
      .where("Id", productId)
      .join(
        Tables.UserProducts,
        `${Tables.UserProducts}.ProductId`,
        "=",
        `${Tables.Products}.Id`,
      )
      .first();

    // Not found product
    if (selectedProduct === null || selectedProduct === undefined) {
      res.status(404).json(createErrorResponse("Product not found"));
      return next();
    }

    // The updated body is empty
    if (errors.isEmpty()) {
      res
        .status(400)
        .json(createErrorResponse("Invalid parameter", undefined, errors));
      return next();
    }

    const user = AuthMiddleware.getUserFromAuth(req);
    const hasAnyPermission = user.role !== "admin" || user.role !== "moderate";

    // Whether current user do not have permissions to do the action
    if (!(user && hasAnyPermission && user.id !== selectedProduct.UserId)) {
      res
        .status(401)
        .json(createErrorResponse("You have no permission to do this action"));
      return next();
    }

    // Catch everything from body
    // const { Name, Description, Price } = req.body;
    // if (!(Name && Description && Price)) {
    //   res.status(400).json(createErrorResponse("Empty body request"));
    //   return next();
    // }

    // eslint-disable-next-line
    await KnexDriver(Tables.Products)
      .update({ Name, Description, Price })
      .where("Id", productId);
    res.json(
      createSuccessResponse({
        id: productId,
      }),
    );
  } catch (err) {
    next(err);
  }
}
/**
 * Get all products with limit
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function getAllProducts(req, res, next) {
  const { limit, page, search } = req.params;
  const response = await KnexDriver.select("*")
    .from(Tables.Products)
    .limit(limit === undefined ? 10 : Number.parseInt(limit));

  res.status(200).json(createSuccessResponse(response));
}

module.exports = {
  createProduct,
  getProductFromId,
  removeProduct,
  getAllProducts,
  updateProduct,
};
