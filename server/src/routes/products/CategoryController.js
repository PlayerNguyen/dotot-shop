"use strict";
// eslint-disable-next-line
const express = require("express");
const KnexDriver = require("../../../driver/KnexDriver");
const Tables = require("../../../driver/Table");
const { getUserFromAuth } = require("../../middlewares/AuthMiddleware");
const {
  createSuccessResponse,
  createErrorResponse,
} = require("../../utils/ResponseFactory");

/**
 * Get all available categories
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function getAllCategories(req, res, next) {
  const response = await KnexDriver.select("*").from(Tables.Categories);

  res.json(createSuccessResponse(response));
}

/**
 * Add new category
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function addCategory(req, res, next) {
  const user = getUserFromAuth(req);

  // Not an admin or mod, return to break
  if (!user.role) {
    return res.json(createErrorResponse(`Unauthorized`));
  }

  const { name, description } = req.body;
  await KnexDriver.insert({ Name: name, Description: description }).into(
    Tables.Categories,
  );

  res.json(createSuccessResponse(`Success create category`));
}

/**
 * Remove category using :categoryId param
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function removeCategory(req, res, next) {
  const user = getUserFromAuth(req);

  // Not an admin or mod
  if (!user.role) {
    return res.status(409).json(createErrorResponse(`Unauthorized`));
  }

  const { categoryId } = req.params;
  if (!categoryId) {
    return res
      .status(400)
      .json(createErrorResponse(`Invalid field categoryId`));
  }
  const isCategoryExist = await KnexDriver.select("*")
    .from(Tables.Categories)
    .where({ Id: categoryId })
    .first();

  if (!isCategoryExist) {
    return res
      .status(404)
      .json(createErrorResponse(`Category with ${categoryId} not found`));
  }

  // Remove the category then response
  await KnexDriver.delete().from(Tables.Categories).where({ Id: categoryId });
  res.status(createSuccessResponse("Successfully deleted the category"));
}

/**
 * Update using :categoryId param and body
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function updateCategory(req, res, next) {
  const user = getUserFromAuth(req);

  // Not an admin or mod
  if (!user.role) {
    return res.status(409).json(createErrorResponse(`Unauthorized`));
  }

  const { categoryId } = req.params;
  if (!categoryId) {
    return res
      .status(400)
      .json(createErrorResponse(`Invalid field categoryId`));
  }
  const isCategoryExist = await KnexDriver.select("*")
    .from(Tables.Categories)
    .where({ Id: categoryId })
    .first();

  if (!isCategoryExist) {
    return res
      .status(404)
      .json(createErrorResponse(`Category with ${categoryId} not found`));
  }

  // handle body vars
  const { name, description } = req.body;
  // Not found neither name nor description
  if (!(name && description)) {
    return res
      .status(400)
      .json(createErrorResponse(`The body variables are invalid `));
  }

  // Remove the category then response
  await KnexDriver.update({ Name: name, Description: description })
    .from(Tables.Categories)
    .where({ Id: categoryId });
  res.status(createSuccessResponse("Successfully update the category"));
}

module.exports = {
  getAllCategories,
  addCategory,
  removeCategory,
  updateCategory,
};
