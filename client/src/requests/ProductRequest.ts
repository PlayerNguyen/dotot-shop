import AxiosInstance from "./AxiosInstance";

function fetchAllProducts(abortController?: AbortController) {
  return AxiosInstance.get("/products/", {
    signal: abortController ? abortController.signal : undefined,
  });
}

function fetchProduct(id: string, abortController?: AbortController) {
  if (id === undefined) {
    throw new Error(`fetchProduct requires id field`);
  }
  return AxiosInstance.get(`/products/product/${id}`, {
    signal: abortController ? abortController.signal : undefined,
  });
}

const ProductRequest = {
  fetchAllProducts,
  fetchProduct,
};
export default ProductRequest;
