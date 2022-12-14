"use strict";
// eslint-disable-next-line
const express = require("express");
const { createErrorResponse } = require("../utils/ResponseFactory");
const jwt = require("jsonwebtoken");
const KnexDriver = require("../../driver/KnexDriver");
const Tables = require("../../driver/Table");

/**
 * @typedef SessionUser
 * @type {object}
 * @property {string} id
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} phone
 * @property {undefined | "admin" | "moderate"} role
 */

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
    if (token === null || token === undefined) {
      throw new Error(`Token cannot be undefined`);
    }
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

      `${Tables.Resources}.Id as ResourceId`,
      `${Tables.Resources}.Name as ResourceName`,
      `${Tables.Resources}.BlurHash as ResourceBlurHash`,
    ])
      .from(Tables.Users)
      .where(`${Tables.Users}.Id`, id)
      .leftJoin(
        Tables.UserRoles,
        `${Tables.Users}.Id`,
        "=",
        `${Tables.UserRoles}.UserId`,
      )
      .leftJoin(
        Tables.UserAvatars,
        `${Tables.Users}.Id`,
        "=",
        `${Tables.UserAvatars}.UserId`,
      )
      .leftJoin(
        Tables.Resources,
        `${Tables.Resources}.Id`,
        "=",
        `${Tables.UserAvatars}.ResourceId`,
      )
      .first();

    // Handle if the user not found
    if (!responseUser) {
      return res
        .status(401)
        .json(createErrorResponse("Invalid user, unauthorized"));
    }

    const {
      Email,
      FirstName,
      LastName,
      Phone,
      Role,
      ResourceId,
      ResourceName,
      ResourceBlurHash,
    } = responseUser;

    // eslint-disable-next-line
    const avatar =
      ResourceId === null
        ? null
        : {
            id: ResourceId,
            name: ResourceName,
            blurHash: ResourceBlurHash,
            url: `/resources/raw/${ResourceId}`,
          };
    req.sessionUser = {
      id,
      email: Email,
      firstName: FirstName,
      lastName: LastName,
      phone: Phone,
      role: Role,
      avatar,
    };

    next();
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param {express.Request} request the express request from previous middleware
 * @return {SessionUser}
 */
function getUserFromAuth(request) {
  return request.sessionUser;
}

const AuthMiddleware = {
  requestAuthenticate,
  getUserFromAuth,
};
module.exports = AuthMiddleware;
