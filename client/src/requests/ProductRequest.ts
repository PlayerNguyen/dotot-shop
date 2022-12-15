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

function deleteProduct(id: string) {
  return AxiosInstance.delete(`/products/product/${id.toString()}`);
}

function createProduct(data: FormData) {
  return AxiosInstance.post(`/products/product`, data);
}

function getProductImages(productId: string) {
  return AxiosInstance.get(`/products/product-image/${productId}`);
}

const ProductRequest = {
  fetchAllProducts,
  fetchProduct,
  fetchProductParams,
  deleteProduct,
  createProduct,
  getProductImages,
};
export default ProductRequest;
