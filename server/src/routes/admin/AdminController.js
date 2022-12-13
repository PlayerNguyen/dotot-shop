"use strict";
// eslint-disable-next-line
const express = require("express");
const KnexDriver = require("../../../driver/KnexDriver");
const Tables = require("../../../driver/Table");
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function getAdminProducts(req, res, next) {
  const { limit, page } = req.body;
  await KnexDriver.select("count(*)").from(Tables.Products);
  // TODO: select *, response length of all and current page
}

module.exports = {
  getAdminProducts,
};
