const express = require("express");
const driver = require("../../../driver/KnexDriver");
const Tables = require("../../../driver/Table");
const {
  createResponse,
  ResponseStatus,
  createErrorResponse,
  createSuccessResponse,
} = require("../../utils/ResponseFactory");

const ProvincesController = {
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  selectAllProvinces: async (req, res, next) => {
    const dataResponse = await driver.select("*").from(Tables.Provinces);
    // Unless found any province
    if (dataResponse.length == 0) {
      throw Error("Provinces not found");
    }
    res.json(createSuccessResponse(dataResponse));
  },
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  selectProvinceById: async (req, res, next) => {
    const { provinceId } = req.params;

    // If the provinceId is invalid
    const provinceResponse = await driver
      .select("*")
      .from(Tables.Provinces)
      .where({ Id: provinceId })
      .first();

    // Province is not found
    if (!provinceResponse) {
      return res.status(404).json(createErrorResponse("Province is not found"));
    }

    res.json(createSuccessResponse(provinceResponse));
  },
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  selectAllDistricts: async (req, res, next) => {
    const { provinceId } = req.params;

    // If the provinceId is invalid
    const provinceResponse = await driver
      .select("*")
      .from(Tables.Provinces)
      .where({ Id: provinceId })
      .first();

    // Province is not found
    if (!provinceResponse) {
      return res.status(404).json(createErrorResponse("Province is not found"));
    }

    // Select all districts from province id
    let districtResponse = await driver
      .select("*")
      .from(Tables.Districts)
      .where("ProvinceId", "=", provinceId);

    if (!districtResponse) {
      return next(Error("District response is undefined"));
    }

    res.json(createResponse(districtResponse));
  },
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  selectAllWardsByDistrict: async (req, res, next) => {
    const { districtId } = req.params;

    // Check If Has districtId
    const districtExist = await driver
      .select("*")
      .from(Tables.Districts)
      .where("Id", "=", districtId);
    // If district is not exists
    if (districtExist.length == 0) {
      return res.status(404).json(createErrorResponse("District not found"));
    }

    // Select all wards
    const wards = await driver
      .select("*")
      .from(Tables.Wards)
      .where("DistrictId", "=", districtId);

    res.json(createSuccessResponse(wards));
  },
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  selectWardById: async (req, res, next) => {
    const { wardId } = req.params;

    // Select the ward from id
    const wardResponse = await driver
      .select("*")
      .from(Tables.Wards)
      .where("Id", "=", wardId)
      .first();

    if (!wardResponse) {
      return res.status(404).json(createErrorResponse("Ward not found"));
    }

    // Response the current ward
    res.json(createSuccessResponse(wardResponse));
  },
};
module.exports = ProvincesController;
