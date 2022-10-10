"use strict";
const express = require("express");
const { check } = require("express-validator");
const AuthMiddleware = require("../../middlewares/AuthMiddleware");
const { createProduct } = require("./ProductController");
const router = express.Router();

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

module.exports = router;
