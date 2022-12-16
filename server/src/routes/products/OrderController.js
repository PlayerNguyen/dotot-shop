"use strict";
// eslint-disable-next-line
const express = require("express");
const KnexDriver = require("../../../driver/KnexDriver");
const Tables = require("../../../driver/Table");
const { getUserFromAuth } = require("../../middlewares/AuthMiddleware");
const {
  createErrorResponse,
  createSuccessResponse,
} = require("../../utils/ResponseFactory");
const { v4: uuid } = require("uuid");
/**
 * Create a new order
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function createOrder(req, res, next) {
  const requestUser = getUserFromAuth(req);

  const { addressId, products } = req.body;
  if (!addressId) {
    return res.json(createErrorResponse(`Invalid addressId field`));
  }
  const searchAddress = await KnexDriver.select("*")
    .from(Tables.UserAddresses)
    .where({ Id: addressId })
    .first();

  // Searching for address
  if (!searchAddress) {
    return res
      .status(400)
      .json(createErrorResponse(`Address with id ${addressId} is not found`));
  }

  // Searching for product
  if (!products || !Array.isArray(products)) {
    return res.status(400).json(createErrorResponse(`Invalid products field`));
  }

  const {
    ProvinceName,
    DistrictName,
    WardName,
    ContactPhone: PhoneNumber,
    StreetName: AddressName,
  } = searchAddress;
  const OrderId = uuid();

  // Insert the order first
  await KnexDriver.insert({
    Id: OrderId,
    PhoneNumber,
    ProvinceName,
    DistrictName,
    WardName,
    AddressName,
    UserId: requestUser.id,
  }).into(Tables.Order);

  // Insert product of the orders
  for (const product of products) {
    // Check availability for product by getting is status
    const { ProductName, ProductId, ProductPrice, ProductCondition } = product;
    const statusResponse = await KnexDriver.select("*")
      .from(Tables.ProductStatus)
      .where({ ProductId })
      .first();

    if (statusResponse && statusResponse.Status !== "selling") {
      return res
        .status(500)
        .json(
          createErrorResponse(
            `The item ${ProductId} - ${ProductName} was sold`,
          ),
        );
    }

    // Insert products
    await KnexDriver.insert({
      ProductName,
      ProductId,
      ProductPrice,
      ProductCondition,
      OrderId,
    }).into(Tables.ProductOrders);

    // Change status of the product
    await KnexDriver.update({ Status: `pending` })
      .from(Tables.ProductStatus)
      .where({ ProductId });
  }

  res.json(createSuccessResponse({ Id: OrderId }));
}

/**
 * Get an order of user :userId
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function getOrderByUserId(req, res, next) {
  // TODO: admin can access this
}

/**
 * Get all orders. Must be an admin to execute this
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function getAllOrders(req, res, next) {}
/**
 * Get order using request.
 *
 * @param {express.Request} req the request parameter
 * @param {express.Response} res  the response parameter
 * @param {express.NextFunction} next the next function
 */
async function getOrderFromRequestUser(req, res, next) {
  const user = getUserFromAuth(req);

  const orderList = await KnexDriver.select(
    "or.Id as OrderId",
    `or.UserId as OrderUserId`,
    `or.ProvinceName as OrderProvinceName`,
    `or.DistrictName as OrderDistrictName`,
    `or.WardName as OrderWardName`,
  )
    .from(`${Tables.Order} as or`)
    // .leftJoin(`${Tables.ProductOrders} as po`, `po.OrderId`, `or.Id`)
    // .leftJoin(`${Tables.ProductStatus} as ps`, `ps.ProductId`, `po.ProductId`)
    .where({ UserId: user.id });
  // .groupBy("po.ProductId");

  let products = null;
  for (const order of orderList) {
    const productOrders = await KnexDriver.select("*")
      .from(`${Tables.ProductOrders} as po`)
      .where({ OrderId: order.OrderId })
      .leftJoin(`${Tables.Products} as p`, `po.ProductId`, `p.Id`)
      .leftJoin(`${Tables.ProductStatus} as ps`, `ps.ProductId`, `p.Id`);

    const fetchItems = productOrders.map((productOrder) => {
      // console.log(productOrder);
      const {
        Status,
        Id: ProductId,
        ProductName,
        ProductPrice,
        Condition: ProductCondition,
      } = productOrder;
      return {
        Status,
        ProductId,
        ProductName,
        ProductPrice,
        ProductCondition,
      };
    });
    products = fetchItems;
    // console.log(fetchItems);
    // products.push();
  }
  const responseItem = orderList.map((order) => {
    return {
      Order: {
        Id: order.OrderId,
        UserId: order.OrderUserId,
        Province: order.OrderProvinceName,
        District: order.OrderDistrictName,
        WardName: order.OrderWardName,
      },
      Products: products,
    };
  });
  res.json(createSuccessResponse(responseItem));
}

module.exports = {
  createOrder,
  getOrderByUserId,
  getAllOrders,
  getOrderFromRequestUser,
};
