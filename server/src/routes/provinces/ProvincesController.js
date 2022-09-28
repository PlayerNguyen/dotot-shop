"use strict";
const driver = require("../../../driver/KnexDriver");
const Tables = require("../../../driver/Table");
const {
  createErrorResponse,
  createSuccessResponse,
} = require("../../utils/ResponseFactory");

const ProvincesController = {
  /**
   *
   * @param {Express.Request} _req
   * @param {Express.Response} res
   */
  selectAllProvinces: async (_req, res) => {
    const dataResponse = await driver.select("*").from(Tables.Provinces);
    // Unless found any province
    if (dataResponse.length == 0) {
      throw Error("Provinces not found");
    }
    res.json(createSuccessResponse(dataResponse));
  },
  /**
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  selectProvinceById: async (req, res) => {
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
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} next
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
    const districtResponse = await driver
      .select("*")
      .from(Tables.Districts)
      .where("ProvinceId", "=", provinceId);

    if (!districtResponse) {
      return next(Error("District response is undefined"));
    }

    res.json(createSuccessResponse(districtResponse));
  },
  /**
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} _next
   */
  selectAllWardsByDistrict: async (req, res, _next) => {
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
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Express.NextFunction} _next
   */
  selectWardById: async (req, res, _next) => {
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
