const express = require("express");
const uuid = require("uuid");

module.exports = {
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  createUser: (req, res, next) => {
    next(new Error("no implementation"));
  },
  
};
