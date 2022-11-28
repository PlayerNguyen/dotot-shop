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
const {
  convertToPng,
  generateBlurHash,
} = require("../../utils/ImageCompressUtil");
const fs = require("fs");
const { getStaticDirectory } = require("../../Static");
const path = require("path");
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
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function updateUserAvatar(req, res, next) {
  try {
    const user = getUserFromAuth(req);
    const file = req.file;
    const { fromX, fromY, width, height } = req.body;

    if (!(fromX && fromY && width && height)) {
      return res.status(409).json(createErrorResponse("Invalid crop fields"));
    }

    const sharpPngObject = convertToPng(file.buffer);
    // const { imageWidth, imageHeight } = await sharpPngObject.metadata();
    console.log(req.body);

    const pngBuffer = await sharpPngObject
      .extract({
        left: Number.parseFloat(fromX),
        top: Number.parseFloat(fromY),
        width: Number.parseInt(width),
        height: Number.parseInt(height),
      })
      .toBuffer();

    // Generate a blur hash
    const _blurHash = await generateBlurHash(pngBuffer);

    // Insert resource object
    const resourceId = uuid();
    const resourcePath = path.resolve(getStaticDirectory(), resourceId);
    const resourceObject = {
      Id: resourceId,
      Name: file.originalname,
      Path: resourcePath,
      BlurHash: _blurHash,
      Author: user.id,
    };

    // Write a file into system
    fs.writeFileSync(resourcePath, pngBuffer);

    // eslint-disable-next-line
    await KnexDriver(Tables.Resources).insert(resourceObject);

    // Using the current avatar
    const selectFirstUserId = await KnexDriver.select("*")
      .from(Tables.UserAvatars)
      .where({ UserId: user.id })
      .first();
    if (!selectFirstUserId) {
      // Create new relationship
      await KnexDriver.insert({ ResourceId: resourceId, UserId: user.id }).into(
        Tables.UserAvatars,
      );
    } else {
      // Delete old avatar resource?

      // Update the current relation
      await KnexDriver.update({ ResourceId: resourceId })
        .from(Tables.UserAvatars)
        .where({ UserId: user.id });
    }

    res.json(
      createSuccessResponse({
        avatarId: resourceId,
        avatarBlurHash: _blurHash,
        avatarUrl: `/resources/raw/${resourceId}`,
      }),
    );
  } catch (err) {
    next(err);
  }
}
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function updateUserPassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = getUserFromAuth(req);
    const currentHashedPassword = await KnexDriver.select("password")
      .from(Tables.Users)
      .where({ Id: user.id });
    // Confirm current password
    if (!bcrypt.compareSync(currentPassword, currentHashedPassword)) {
      return res.json(createErrorResponse("The current password is not match"));
    }

    // The new password is same with the current password
    if (bcrypt.compareSync(newPassword, currentHashedPassword)) {
      return res.json(
        createErrorResponse(
          "A new password cannot be the same as the current password",
        ),
      );
    }

    // Generate hash for new password
    const salt = bcrypt.genSaltSync(process.env.BCRYPT_HASH_ROUNDS);
    const hash = bcrypt.hashSync(newPassword, salt);
    // Update current password
    await KnexDriver.update({ password: hash })
      .from(Tables.Users)
      .where({ Id: user.id });
    res.json(createSuccessResponse());
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createUser,
  getUserById,
  getUserProfile,
  updateUserAvatar,
  updateUserPassword,
};
