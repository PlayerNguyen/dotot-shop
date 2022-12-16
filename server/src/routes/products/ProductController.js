"use strict";
// eslint-disable-next-line
const express = require("express");
const { validationResult } = require("express-validator");
const KnexDriver = require("../../../driver/KnexDriver");
const Tables = require("../../../driver/Table");
const {
  createErrorResponse,
  createSuccessResponse,
} = require("../../utils/ResponseFactory");
const { v4: uuid } = require("uuid");
const chalk = require("chalk");
const { getUserFromAuth } = require("./../../middlewares/AuthMiddleware");
const AuthMiddleware = require("./../../middlewares/AuthMiddleware");
const { generateBlurHash } = require("../../utils/ImageCompressUtil");
const sharp = require("sharp");
const fs = require("fs");
const { getStaticDirectory } = require("../../Static");
const path = require("path");

/**
 * Create a new product
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function createProduct(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(createErrorResponse("Invalid request body", undefined, errors));

    return next();
  }
  const authorUser = getUserFromAuth(req);
  const { price, name, description, condition, category } = req.body;
  const generatedUniqueProductId = uuid();

  try {
    // Insert the product
    const insertResponse = await KnexDriver.insert({
      Id: generatedUniqueProductId,
      Price: price,
      Name: name,
      Description: description === undefined ? "" : description,
      CreatedAt: Date.now(),
      Condition: condition,
    }).into(Tables.Products);

    console.log(
      chalk.gray(
        `creating ${insertResponse} product with metadata ${JSON.stringify({
          Id: generatedUniqueProductId,
          Price: price,
          Name: name,
          Description: description,
        })}`,
      ),
    );

    // Insert user product
    const user = getUserFromAuth(req);
    const userId = user.id;

    await KnexDriver.insert({
      UserId: userId,
      ProductId: generatedUniqueProductId,
    }).into(Tables.UserProducts);

    // Insert category
    await KnexDriver.insert({
      CategoryId: category,
      ProductId: generatedUniqueProductId,
    }).into(Tables.ProductCategory);

    // Handle the image resources
    const { cropMap } = req.body;
    const generatedResources = [];

    let deserializedCropMap = [];
    if (req.files !== undefined && req.files.length > 0) {
      // Must have a crop map field
      if (!cropMap) {
        return res
          .status(500)
          .json(createErrorResponse("cropMap parameter is not found"));
      }

      // Crop map must be an array
      deserializedCropMap = JSON.parse(cropMap);
      if (!Array.isArray(deserializedCropMap)) {
        return res
          .status(500)
          .json(
            createErrorResponse("cropMap must be a json serialized array text"),
          );
      }

      // Crop map must equal the length of the files
      if (req.files.length !== deserializedCropMap.length) {
        return res
          .status(500)
          .json(
            createErrorResponse(
              "cropMap length must be the same as `images` field",
            ),
          );
      }

      // Any of them not an image
      if (req.files.some((e) => !e.mimetype.includes("image/"))) {
        return res
          .status(500)
          .json(createErrorResponse("some file are not an image"));
      }

      // Allocate the store location and insert resources first
      for (let i = 0; i < req.files.length; i++) {
        /**
         * @type {Express.Multer.File}
         */
        const requestFile = req.files[i];
        const resourceId = uuid();
        const generateObject = {
          Id: resourceId,
          Name: requestFile.originalname,
          Path: path.resolve(getStaticDirectory(), resourceId),
          BlurHash: await generateBlurHash(req.files[i].buffer),
          Author: authorUser.id,
        };
        await KnexDriver.insert(generateObject).into(Tables.Resources);
        await KnexDriver.insert({
          ResourceId: resourceId,
          ProductId: generatedUniqueProductId,
        }).into(Tables.ProductImage);

        generatedResources.push(generateObject);

        // Write a draft file before process an image
        if (!fs.existsSync(getStaticDirectory())) {
          fs.mkdirSync(getStaticDirectory());
        }

        fs.writeFileSync(generatedResources[i].Path, req.files[i].buffer);
      }
    }

    // Require a discount
    if (req.body.salePrice) {
      await KnexDriver.insert({
        ProductId: generatedUniqueProductId,
        SalePrice: req.body.salePrice,
      }).into(Tables.SaleProducts);
    }

    // Insert product status
    await KnexDriver.insert({
      ProductId: generatedUniqueProductId,
      Status: "PENDING",
    }).into(Tables.ProductStatus);

    res.json(createSuccessResponse({ id: generatedUniqueProductId }));

    // Process all uploaded resources as image
    for (let i = 0; i < generatedResources.length; i++) {
      /**
       * @type {Express.Multer.File}
       */
      const file = req.files[i];
      const cropProperty = deserializedCropMap[i];

      // Normalize the crop scale from percent to real 2d coordinate system
      const fileBufferMetadata = await sharp(file.buffer).metadata();
      const { width: fileWidth, height: fileHeight } = fileBufferMetadata;
      const {
        x: percentX,
        y: percentY,
        width: percentWidth,
        height: percentHeight,
      } = cropProperty;
      const cropNormalize = {
        x: (percentX / 100) * fileWidth,
        y: (percentY / 100) * fileHeight,
        width: (percentWidth / 100) * fileWidth,
        height: (percentHeight / 100) * fileHeight,
      };

      // Extract crop region as buffer and convert it to png format
      const croppedPngBuffer = await sharp(file.buffer)
        .extract({
          width: Math.round(cropNormalize.width),
          height: Math.round(cropNormalize.height),
          left: Math.round(cropNormalize.x),
          top: Math.round(cropNormalize.y),
        })
        // .png()
        .png({ quality: 1, compressionLevel: 9, effect: 1 })
        .toBuffer();
      // Extract blur hash
      const blurHashBuffer = await generateBlurHash(croppedPngBuffer);

      // Write cropped buffer into static serve folder
      if (!fs.existsSync(getStaticDirectory())) {
        fs.mkdirSync(getStaticDirectory());
      }
      fs.writeFileSync(generatedResources[i].Path, croppedPngBuffer);

      // Update blur hash for the current metadata
      await KnexDriver.update({ BlurHash: blurHashBuffer.toString() })
        .into(Tables.Resources)
        .where({ Id: generatedResources[i].Id });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Get a product by a specific id
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function getProductFromId(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(createErrorResponse("Invalid parameter", undefined, errors));
    return next();
  }

  const { productId } = req.params;

  try {
    const product = await KnexDriver.select(
      `${Tables.Products}.*`,
      `${Tables.Users}.Id as userId`,
      `${Tables.Users}.FirstName`,
      `${Tables.Users}.LastName`,
      `${Tables.Categories}.Id as categoryId`,
      `${Tables.Categories}.Name as categoryName`,
      `${Tables.Categories}.Description as categoryDescription`,
      `${Tables.Categories}.Slug as categorySlug`,
      `sp.SalePrice as SalePrice`,
    )
      .from(Tables.Products)
      .where(`${Tables.Products}.Id`, productId)
      .join(
        Tables.UserProducts,
        `${Tables.Products}.Id`,
        "=",
        `${Tables.UserProducts}.ProductId`,
      )
      .leftJoin(
        Tables.Users,
        `${Tables.UserProducts}.UserId`,
        "=",
        `${Tables.Users}.Id`,
      )
      .leftJoin(
        Tables.ProductCategory,
        `${Tables.ProductCategory}.ProductId`,
        "=",
        `${Tables.Products}.Id`,
      )
      .leftJoin(
        Tables.Categories,
        `${Tables.Categories}.Id`,
        "=",
        `${Tables.ProductCategory}.CategoryId`,
      )
      .leftJoin(
        `${Tables.SaleProducts} as sp`,
        `sp.ProductId`,
        `${Tables.Products}.Id`,
      )

      .first();

    if (!product) {
      res.status(404).json(createErrorResponse("Product not found"));
      return next();
    }

    // Get resources whether exists
    let resourceList = await KnexDriver.select(
      "r.Id as Id",
      "r.BlurHash as BlurHash",
    )
      .from(Tables.ProductImage)
      .where(`ProductId`, "=", productId)
      .join(
        `${Tables.Resources} AS r`,
        `r.Id`,
        "=",
        `${Tables.ProductImage}.ResourceId`,
      );
    resourceList = resourceList.map((resource) => {
      const { Id, BlurHash } = resource;
      return {
        Id,
        BlurHash,
        Url: `${process.env.HOST_NAME}resources/raw/${Id}`,
      };
    });
    const responseUser = {
      name: product.Name,
      description: product.Description,
      price: product.Price,
      id: product.Id,
      views: product.Views,
      likes: product.Likes,
      user: {
        id: product.userId,
        firstName: product.FirstName,
        lastName: product.LastName,
      },
      category: {
        id: product.categoryId,
        name: product.categoryName,
        slug: product.categorySlug,
        description: product.categoryDescription,
      },
      images: resourceList,
      salePrice: product.SalePrice,
    };

    // Increase product view
    // eslint-disable-next-line
    await KnexDriver(Tables.Products)
      .update({ Views: product.Views + 1 })
      .where({ Id: product.Id });
    // Response to user
    res.json(createSuccessResponse(responseUser));
  } catch (e) {
    next(e);
  }
}
/**
 * Remove the product using specific id
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function removeProduct(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res
      .status(400)
      .json(createErrorResponse("Invalid parameter", undefined, errors));
    return next();
  }

  try {
    const { productId } = req.params;
    const selectedProduct = await KnexDriver.select(
      `${Tables.Products}.*`,
      `${Tables.UserProducts}.UserId`,
    )
      .from(Tables.Products)
      .where(`${Tables.Products}.Id`, productId)
      .leftJoin(
        `${Tables.UserProducts}`,
        `${Tables.Products}.Id`,
        "=",
        `${Tables.UserProducts}.ProductId`,
      )
      .first();

    const user = getUserFromAuth(req);

    // Check if the product is empty or not
    if (!selectedProduct) {
      res.status(404).json(createErrorResponse("Product not found"));
      return next();
    }

    // Not the owner and not admin
    if (
      // !(user && user.role !== "admin" && user.id !== selectedProduct.UserId)
      !user ||
      user.role !== "admin" ||
      user.id !== selectedProduct.UserId
    ) {
      res
        .status(401)
        .json(createErrorResponse("You have no permission to do this action"));
      return next();
    }

    // Remove the product
    await KnexDriver.del()
      .from(Tables.UserProducts)
      .where("ProductId", productId);
    await KnexDriver.del()
      .from(Tables.ProductImage)
      .where("ProductId", productId);
    await KnexDriver.del()
      .from(Tables.ProductStatus)
      .where("ProductId", productId);
    await KnexDriver.del()
      .from(Tables.ProductCategory)
      .where("ProductId", productId);
    await KnexDriver.del().from(Tables.Products).where("Id", productId);

    res.json(createSuccessResponse());
  } catch (e) {
    next(e);
  }
}
/**
 * Update product using specific id
 * @param {express.Request} req  the request parameter
 * @param {express.Response} res the response parameter
 * @param {express.NextFunction} next the next function
 */
async function updateProduct(req, res, next) {
  try {
    const errors = validationResult(req);

    const { productId } = req.params;
    // Select the product
    const selectedProduct = await KnexDriver.select(
      `${Tables.Products}.*`,
      `${Tables.UserProducts}.UserId`,
    )
      .from(Tables.Products)
      .where("Id", productId)
      .join(
        Tables.UserProducts,
        `${Tables.UserProducts}.ProductId`,
        "=",
        `${Tables.Products}.Id`,
      )
      .first();

    // Not found product
    if (selectedProduct === null || selectedProduct === undefined) {
      res.status(404).json(createErrorResponse("Product not found"));
      return next();
    }

    // The updated body is empty
    if (errors.isEmpty()) {
      res
        .status(400)
        .json(createErrorResponse("Invalid parameter", undefined, errors));
      return next();
    }

    const user = AuthMiddleware.getUserFromAuth(req);
    const hasAnyPermission = user.role !== "admin" || user.role !== "moderate";

    // Whether current user do not have permissions to do the action
    if (!(user && hasAnyPermission && user.id !== selectedProduct.UserId)) {
      res
        .status(401)
        .json(createErrorResponse("You have no permission to do this action"));
      return next();
    }

    // Catch everything from body
    // const { Name, Description, Price } = req.body;
    // if (!(Name && Description && Price)) {
    //   res.status(400).json(createErrorResponse("Empty body request"));
    //   return next();
    // }

    // eslint-disable-next-line
    await KnexDriver(Tables.Products)
      .update({ Name, Description, Price })
      .where("Id", productId);
    res.json(
      createSuccessResponse({
        id: productId,
      }),
    );
  } catch (err) {
    next(err);
  }
}
/**
 * Get all products with parameters
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function getAllProducts(req, res, next) {
  const { limit, page, search, sortedBy } = req.query;
  const productSize = await KnexDriver.count("id as size")
    .from(Tables.Products)
    .first();
  const response = await KnexDriver.select(
    "p.Id",
    "p.Name",
    "p.Price",
    "p.Likes",
    "p.Description",
    "p.Views",
    "p.CreatedAt",
    "p.Condition",
    "sp.SalePrice",
  )
    .from(`${Tables.Products} as p`)
    .limit(limit === undefined ? 10 : Number.parseInt(limit))
    .offset(page === undefined ? 0 : Number.parseInt(limit * page))
    .orderBy(sortedBy ? sortedBy : "createdAt")
    .whereRaw(
      search
        ? `p.Name LIKE '%${search}%' OR p.Description LIKE '%${search}%'`
        : ``,
    )
    .leftJoin(`${Tables.SaleProducts} as sp`, `sp.ProductId`, `p.Id`);

  res.status(200).json(
    createSuccessResponse({
      products: response,
      totalSize: productSize.size,
    }),
  );
}

/**
 * Get product image list
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function getProductImages(req, res, next) {
  const { productId } = req.params;
  const _ = await KnexDriver.select("")
    .from(`${Tables.ProductImage} as pi`)
    .where(`pi.ProductId`, `=`, productId)
    .join(`${Tables.Resources} as r`, `r.Id`, `=`, `pi.ResourceId`);
  console.log();
  const responseArray = _.map((item) => {
    return {
      ResourceId: item.ResourceId,
      ProductId: item.ProductId,
      BlurHash: item.BlurHash,
      Url: `${process.env.HOST_NAME}resources/raw/${item.ResourceId}`,
    };
  });

  res.json(createSuccessResponse(responseArray));
}

module.exports = {
  createProduct,
  getProductFromId,
  removeProduct,
  getAllProducts,
  updateProduct,
  getProductImages,
};
