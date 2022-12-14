import AxiosInstance from "./AxiosInstance";

async function createCategory(name: string, description: string) {
  if (!(name && description)) {
    throw new Error(`Parameters name and description cannot be null`);
  }
  return AxiosInstance.post(`/products/categories/`, { name, description });
}

async function updateCategory(id: string, name: string, description: string) {
  if (!(id && name && description)) {
    throw new Error(`Parameters id, name, and description cannot be null`);
  }
  return AxiosInstance.put(`/products/categories/${id}`, { name, description });
}

async function deleteCategory(id: string) {
  return AxiosInstance.delete(`/products/categories/${id}`);
}

async function getAllCategory() {
  return AxiosInstance.get(`/products/categories/`);
}

async function getCategoryById(id: string) {
  return AxiosInstance.get(`/products/categories/category/${id}`);
}

const CategoryRequest = {
  getCategoryById,
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
export default CategoryRequest;
