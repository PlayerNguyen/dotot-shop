"use strict";
// eslint-disable-next-line
const express = require("express");
const KnexDriver = require("../../../driver/KnexDriver");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { v4: uuid } = require("uuid");
const Tables = require("../../../driver/Table");
const {
  createErrorResponse,
  createSuccessResponse,
} = require("../../utils/ResponseFactory");
const { getUserFromAuth } = require("../../middlewares/AuthMiddleware");

/**
 * Create a new user
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function createUser(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(
        createErrorResponse(`Missing or invalid fields`, undefined, errors),
      );
  } else {
    // Looking for the user
    const { phone, email } = req.body;
    const lookupResponse = await KnexDriver.select("*")
      .from(Tables.Users)
      .where({ Phone: phone })
      .orWhere({ Email: email });

    if (lookupResponse.length !== 0) {
      res
        .status(409)
        .json(createErrorResponse("User with phone or email is found"));
      return;
    }

    const { firstName, lastName, password } = req.body;
    const saltRounded = bcrypt.genSaltSync(
      parseInt(process.env.BCRYPT_HASH_ROUNDS || 10),
    );
    const hashedPassword = bcrypt.hashSync(password, saltRounded);
    const generatedUniqueId = uuid();
    const responseInsertion = await KnexDriver.insert({
      Id: generatedUniqueId,
      Phone: phone,
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      Password: hashedPassword,
    }).into(Tables.Users);

    // Response after create
    if (responseInsertion.length === 1 && responseInsertion[0] === 0) {
      res.json(createSuccessResponse({ id: generatedUniqueId }));
    } else {
      next(new Error("Cannot generate user due to unexpected error"));
    }
  }
}

/**
 * Get user by supply user's id
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function getUserById(req, res, next) {
  const { userId } = req.params;

  // If not found user field
  if (!userId) {
    return res.status(409).json(createErrorResponse(`User field not found`));
  }

  // Fetch user and response
  const userResponse = await KnexDriver.select("Id", "FirstName", "LastName")
    .from(Tables.Users)
    .where({ Id: userId });

  // if not found user
  if (userResponse.length === 0) {
    return res.status(404).json(createErrorResponse(`User not found`));
  }

  const { Id, FirstName, LastName } = userResponse[0];
  res.json(
    createSuccessResponse({
      id: Id,
      firstName: FirstName,
      lastName: LastName,
    }),
  );
}
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function getUserProfile(req, res, next) {
  const user = getUserFromAuth(req);
  res.json(createSuccessResponse(user));
}

module.exports = {
  createUser,
  getUserById,
  getUserProfile,
};
