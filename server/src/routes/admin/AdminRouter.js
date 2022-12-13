"use strict";
const express = require("express");
const AuthMiddleware = require("../../middlewares/AuthMiddleware");
const { getAdminProducts } = require("./AdminController");
const router = express.Router();

router.get("/products", AuthMiddleware.requestAuthenticate, getAdminProducts);

module.exports = router;
