"use strict";
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const KnexDriver = require("../../../driver/KnexDriver");
const Tables = require("../../../driver/Table");
const {
  createErrorResponse,
  createSuccessResponse,
} = require("../../utils/ResponseFactory");
const bcrypt = require("bcryptjs");

/**
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
      .where({ Phone: phone, Email: email });

    if (lookupResponse.length !== 0) {
      res
        .status(409)
        .json(createErrorResponse("User with phone and email is found"));
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

    if (responseInsertion.length === 1 && responseInsertion[0] === 0) {
      res.json(createSuccessResponse({ id: generatedUniqueId }));
    } else {
      next(new Error("Cannot generate user due to unexpected error"));
    }
  }
}

module.exports = {
  createUser,
};
