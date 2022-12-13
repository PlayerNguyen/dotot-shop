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

function fetchProductParams(
  page: number,
  limit: number,
  search?: string,
  abortController?: AbortController
) {
  const _ = new URLSearchParams();
  _.append("limit", String(limit));
  _.append("page", String(page));
  if (search !== undefined) {
    _.append("search", search);
  }

  return AxiosInstance.get(`/products/?${_.toString()}`, {
    signal: abortController ? abortController.signal : undefined,
  });
}

const ProductRequest = {
  fetchAllProducts,
  fetchProduct,
  fetchProductParams,
};
export default ProductRequest;
