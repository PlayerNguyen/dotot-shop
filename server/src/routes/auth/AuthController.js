"use strict";
const { compareSync } = require("bcryptjs");
// eslint-disable-next-line
const express = require("express");
const { validationResult } = require("express-validator");
const KnexDriver = require("../../../driver/KnexDriver");
const Tables = require("../../../driver/Table");

const {
  createErrorResponse,
  createSuccessResponse,
} = require("../../utils/ResponseFactory");
const jwt = require("jsonwebtoken");

/**
 * Verify a user and response a json web token for users
 *
 * @param {express.Request} req a request express from middleware handle
 * @param {express.Response} res a response express from middleware handle
 * @param {express.NextFunction} next next function to handle next middleware
 */
async function verifyUserAndResponseToken(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(
          createErrorResponse("Missing or empty fields", undefined, errors),
        );
    }

    const { phoneOrEmail, password } = req.body;

    // Check if the username is found or not
    const userResponse = await KnexDriver.select("*")
      .from(Tables.Users)
      .where("Phone", phoneOrEmail)
      .orWhere("Email", phoneOrEmail);

    if (userResponse.length === 0) {
      return res.status(404).json(createErrorResponse("User not found"));
    }

    const firstUserResponse = userResponse[0];

    // Otherwise, compare password with hashed password
    if (!compareSync(password, firstUserResponse.Password)) {
      return res.status(401).json(createErrorResponse("Password not match"));
    }

    // Create a json web token
    const payload = {
      id: firstUserResponse.Id,
    };
    const responseToken = jwt.sign(payload, process.env.JWT_SECRET_OR_KEY);

    // Then response a token for user
    res.json(createSuccessResponse({ token: responseToken }));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  verifyUserAndResponseToken,
};
