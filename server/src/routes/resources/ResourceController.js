"use strict";
// eslint-disable-next-line
const express = require("express");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { createSuccessResponse } = require("../../utils/ResponseFactory");
const { v4: uuid } = require("uuid");
const { hasStaticDirectory, getStaticDirectory } = require("../../Static");
const {
  convertToPng,
  generateBlurHash,
} = require("../../utils/ImageCompressUtil");
const KnexDriver = require("../../../driver/KnexDriver");
const Tables = require("../../../driver/Table");
const { getUserFromAuth } = require("../../middlewares/AuthMiddleware");
const validator = require("validator");

// eslint-disable-next-line valid-jsdoc
/**
 * Convert uploads image and create metadata for it
 *
 * @param {Express.Multer.File} file a file to convert
 * @param {string} authorUserId a unique id (uuid) of the user
 */
async function convertAndCreateImageProfile(file, authorUserId) {
  if (!(typeof authorUserId === "string")) {
    throw new Error(`Invalid authorUserId, it must be a string`);
  }
  // Not uuid
  if (!validator.default.isUUID(authorUserId)) {
    throw new Error(`authorUserId must be an uuid type`);
  }
  return new Promise((resolve, reject) => {
    const imageId = uuid();
    const fileNamePath = path.resolve(getStaticDirectory(), imageId);

    let imageProperty = {
      Id: imageId,
      Name: file.originalname,
      Path: fileNamePath,
      Author: authorUserId,
    };

    const imageWriter = convertToPng(file.buffer);

    const writer = fs.createWriteStream(fileNamePath, {
      highWaterMark: 1024 * 1024,
    });

    const handler = imageWriter.pipe(writer);

    handler.on("error", reject);

    handler.on("finish", async () => {
      const blurHashed = await generateBlurHash(file.buffer);
      imageProperty = { ...imageProperty, BlurHash: blurHashed };
      KnexDriver.select("*")
        .from(Tables.Users)
        .where({ Id: authorUserId })
        .then((response) => {
          console.log(response);
        })
        .next(reject);
      // Create image property for resources on database
      KnexDriver.insert(imageProperty)
        .into(Tables.Resources)
        .then(resolve)
        .catch(reject);
    });
  });
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function handleUploadImages(req, res, next) {
  try {
    /**
     * @type {Express.Multer.File[]}
     */
    const files = req.files.images;
    const currentUser = getUserFromAuth(req);

    // Empty upload files
    if (files.length === 0) {
      return next(new Error(`Invalid input files (empty)`));
    }

    // Any of them not an image
    if (files.some((e) => !e.mimetype.includes("image/"))) {
      return next(new Error("Invalid image type"));
    }

    Promise.all(
      [...files].map((file) =>
        convertAndCreateImageProfile(file, currentUser.id),
      ),
    )
      .then((_) => {
        console.log(`debug out: `, _);
      })
      .catch(next);

    // Handle each files, doing this synchronously
    for (const file of files) {
      // Take input buffer
      const imageWriter = sharp(file.buffer)
        // Load as png stream
        .png({
          quality: 1,
          compressionLevel: 9,
          effort: 1,
        });

      if (!hasStaticDirectory()) {
        fs.mkdirSync(getStaticDirectory());
      }

      const fileName = uuid();
      console.log(`${file.originalname} -> ${fileName}`);

      const writer = fs.createWriteStream(
        path.resolve(getStaticDirectory(), file.originalname),
      );

      imageWriter.pipe(writer);
    }

    res.status(200).json(createSuccessResponse(""));
  } catch (err) {
    next(err);
  }
}

module.exports = { handleUploadImages };
