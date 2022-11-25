"use strict";
const express = require("express");
const { requestAuthenticate } = require("../../middlewares/AuthMiddleware");
const ResourceRouter = express.Router();
const memoryUploadMiddleware = require("../../utils/MulterHelper");
const {
  handleUploadImages,
  getResourceMetadata,
  getResourceRaw,
} = require("./ResourceController");

/**
 * Upload new image
 */
ResourceRouter.post(
  "/",
  requestAuthenticate,
  memoryUploadMiddleware.fields([
    {
      name: "images",
      maxCount: 10,
    },
  ]),
  handleUploadImages,
);

ResourceRouter.get("/resource/:resourceId", getResourceMetadata);
ResourceRouter.get("/raw/:resourceId", getResourceRaw);

module.exports = ResourceRouter;
