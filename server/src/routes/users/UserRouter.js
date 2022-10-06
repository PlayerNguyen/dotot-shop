"use strict";
const express = require("express");
const { createUser, getUserById, getUserProfile } = require("./UserController");
// eslint-disable-next-line
const router = express.Router();
const { check } = require("express-validator");
const AuthMiddleware = require("../../middlewares/AuthMiddleware");

router.post(
  `/register`,
  check("phone", "Phone must not be empty")
    .isMobilePhone()
    .withMessage("Invalid phone format"),
  check("email", "Email must not be empty")
    .isEmail()
    .withMessage("Invalid email format"),
  check("firstName", `firstName must not be empty`),
  check("lastName", "lastName must not be empty"),
  check("password", "password must not be empty")
    .isLength({ min: 6 })
    .withMessage("Password length must above 5 characters"),
  createUser,
);

router.get("/user/:userId", getUserById);
router.get("/profile", AuthMiddleware.requestAuthenticate, getUserProfile);

module.exports = router;
