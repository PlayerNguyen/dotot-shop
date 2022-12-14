"use strict";
const express = require("express");
const { check, param } = require("express-validator");
const { requestAuthenticate } = require("../../middlewares/AuthMiddleware");
const AuthMiddleware = require("../../middlewares/AuthMiddleware");
const {
  getAllCategories,
  addCategory,
  removeCategory,
  updateCategory,
  getCategoryById,
} = require("./CategoryController");
const {
  createProduct,
  getProductFromId,
  removeProduct,
  updateProduct,
  getAllProducts,
  getProductImages,
} = require("./ProductController");
const router = express.Router();

/**
 * Create new product
 */
router.post(
  `/product/`,
  AuthMiddleware.requestAuthenticate,
  check("name", "The name value cannot be undefined or empty")
    .isLength({ min: 5 })
    .withMessage("The name length must be greater than 5 characters"),
  check("price", "The price value cannot be undefined or empty")
    .isFloat({
      gt: 0.0,
    })
    .withMessage("The price must be a float and greater than 0.0"),
  createProduct,
);

/**
 * Get product using the specific id
 *
 */
router.get(
  `/product/:productId`,
  param("productId")
    .isUUID(4)
    .withMessage("The product id must be in a format of uuid v4"),
  getProductFromId,
);

router.delete(
  `/product/:productId`,
  AuthMiddleware.requestAuthenticate,
  param("productId")
    .isUUID(4)
    .withMessage("The product id must be in a format of uuid v4"),
  removeProduct,
);

router.put(
  `/product/:productId`,
  AuthMiddleware.requestAuthenticate,
  param("productId")
    .isUUID(4)
    .withMessage("The product id must be in a format of uuid v4"),
  updateProduct,
);

router.get(`/product-image/:productId`, getProductImages);

/**
 * List all available categories
 */
router.get(`/categories/`, getAllCategories);

/**
 * Add new category
 * Body: { name: string, description: string }
 */
router.post(`/categories`, requestAuthenticate, addCategory);

/**
 * Delete the :categoryId category
 * Params: :categoryId
 */
router.delete(`/categories/:categoryId`, requestAuthenticate, removeCategory);

/**
 * Update the :categoryId category
 * Params: :categoryId
 * Body: { name: string, description: string }
 */
router.put(`/categories/:categoryId`, requestAuthenticate, updateCategory);

/**
 * Get the specific category
 * Params: :categoryId
 */
router.get(`/categories/category/:categoryId`, getCategoryById);

router.get(`/`, getAllProducts);
module.exports = router;
