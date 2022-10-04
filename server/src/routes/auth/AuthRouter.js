"use strict";
const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { verifyUserAndResponseToken } = require("./AuthController");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_OR_KEY,
    },
    function verify(payload, done) {
      console.log(payload);
    },
  ),
);

router.post(
  "/login",
  check("phoneOrEmail", "phoneOrEmail cannot be empty"),
  check("password", "password cannot be empty")
    .isLength({ min: 5 })
    .withMessage("Password must have 5+ characters"),
  verifyUserAndResponseToken,
);

module.exports = router;
