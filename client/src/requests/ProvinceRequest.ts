import AxiosInstance from "./AxiosInstance";

function fetchProvince() {
  return AxiosInstance.get(`/provinces/`);
}

function fetchDistrictFromProvince(provinceId: string) {
  return AxiosInstance.get(`/provinces/province/${provinceId}/districts`)
}

function fetchWardFromDistrict(districtId: string) {
  return AxiosInstance.get(`/provinces/district/${districtId}/wards`)
}

export default { fetchProvince, fetchDistrictFromProvince, fetchWardFromDistrict };
