"use strict";
const express = require("express");
const { check, param } = require("express-validator");
const AuthMiddleware = require("../../middlewares/AuthMiddleware");
const {
  createProduct,
  getProductFromId,
  removeProduct,
  updateProduct,
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

// router.get(`/`, param());
module.exports = router;
