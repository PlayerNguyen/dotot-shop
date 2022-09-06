const express = require("express");
const {
  selectAllProvinces,
  selectAllDistricts,
  selectProvinceById,
  selectAllWardsByDistrict,
  selectWardById,
} = require("./ProvincesController");
const router = express.Router();

router.get(`/`, selectAllProvinces);
router.get(`/province/:provinceId`, selectProvinceById);
router.get(`/province/:provinceId/districts`, selectAllDistricts);
router.get(`/district/:districtId/wards`, selectAllWardsByDistrict);
router.get(`/ward/:wardId`, selectWardById);

module.exports = router;
