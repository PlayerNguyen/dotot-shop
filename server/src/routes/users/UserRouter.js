"use strict";
const express = require("express");
const {
  createUser,
  getUserById,
  getUserProfile,
  updateUserAvatar,
  updateUserPassword,
} = require("./UserController");
// eslint-disable-next-line
const router = express.Router();
const { check } = require("express-validator");
const AuthMiddleware = require("../../middlewares/AuthMiddleware");
const memoryUploadMiddleware = require("../../utils/MulterHelper");

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

router.post(
  "/avatar",
  AuthMiddleware.requestAuthenticate,
  memoryUploadMiddleware.single("avatar"),
  updateUserAvatar,
);

router.get("/user/:userId", getUserById);

router.get("/profile", AuthMiddleware.requestAuthenticate, getUserProfile);

router.put('/change-password', AuthMiddleware.requestAuthenticate, updateUserPassword);

module.exports = router;
