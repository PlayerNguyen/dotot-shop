import AxiosInstance from "./AxiosInstance";

function fetchAllProducts(abortController?: AbortController) {
  return AxiosInstance.get("/products/", {
    signal: abortController ? abortController.signal : undefined,
  });
}

const ProductRequest = {
  fetchAllProducts,
};
export default ProductRequest;
