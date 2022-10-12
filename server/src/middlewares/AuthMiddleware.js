"use strict";
// eslint-disable-next-line
const express = require("express");
const { createErrorResponse } = require("../utils/ResponseFactory");
const jwt = require("jsonwebtoken");
const KnexDriver = require("../../driver/KnexDriver");
const Tables = require("../../driver/Table");

/**
 * Request authenticate middlewares
 *
 * @param {express.Request} req request object passed from the previous middleware
 * @param {express.Response} res response object passed from previous middleware
 * @param {express.NextFunction} next the next function to call next middleware
 */
async function requestAuthenticate(req, res, next) {
  try {
    // Get the token from headers
    if (!req.headers.authorization) {
      return res.status(401).json(createErrorResponse("Unauthorized"));
    }

    // Sanitize request header
    const unsanitizedAuthorization = req.headers.authorization;
    const splittedAuthorized = unsanitizedAuthorization.split(" ");
    if (splittedAuthorized.length == 1) {
      return res
        .status(401)
        .json(
          createErrorResponse(
            "Invalid authorization requested header. It must be `JWT ${token}`",
          ),
        );
    }
    const token = splittedAuthorized[1];

    // Validate a token
    const payload = jwt.verify(token, String(process.env.JWT_SECRET_OR_KEY));
    const { id } = payload;

    // Select user from database
    const responseUser = await KnexDriver.select([
      `${Tables.Users}.Email`,
      `${Tables.Users}.FirstName`,
      `${Tables.Users}.LastName`,
      `${Tables.Users}.Phone`,
      `${Tables.UserRoles}.Role`,
    ])
      .from(Tables.Users)
      .where("Id", id)
      .leftJoin(
        Tables.UserRoles,
        `${Tables.Users}.Id`,
        "=",
        `${Tables.UserRoles}.UserId`,
      )
      .first();

    // Handle if the user not found
    if (!responseUser) {
      return res
        .status(401)
        .json(createErrorResponse("Invalid user, unauthorized"));
    }

    const { Email, FirstName, LastName, Phone, Role } = responseUser;
    req.sessionUser = {
      id,
      email: Email,
      firstName: FirstName,
      lastName: LastName,
      phone: Phone,
      role: Role,
    };

    next();
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param {express.Request} request the express request from previous middleware
 * @return {Object}
 */
function getUserFromAuth(request) {
  return request.sessionUser;
}

const AuthMiddleware = {
  requestAuthenticate,
  getUserFromAuth,
};
module.exports = AuthMiddleware;
