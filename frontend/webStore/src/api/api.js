// src/api/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "https://algebra-javaweb-service.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

//#region PRODUCT
//export const getAllProducts = async () =>
//    await api.get("/products").then(res => res.data);

export const getAllProducts = async (filters = {}) => {
  const query = new URLSearchParams();

  if (filters.categoryId) query.append("categoryId", filters.categoryId);
  query.append("priceMin", filters.priceMin ?? 0);
  query.append("priceMax", filters.priceMax ?? 1000);

  const res = await api.get(`/products?${query.toString()}`);
  return res.data;
};

export const getProductById = async (id) =>
    await api.get(`/products/${id}`).then(res => res.data);

export const createProduct = async (product) =>
    await api.post("/products", product).then(res => res.data);

export const updateProduct = async (id, product) =>
    await api.put(`/products/${id}`, product).then(res => res.data);

export const deleteProduct = async (id) =>
    await api.delete(`/products/${id}`);
//#endregion

//#region CATEGORY
export const getAllCategories = async () =>
    await api.get("/categories").then(res => res.data);

export const getCategoryById = async (id) =>
    await api.get(`/categories/${id}`).then(res => res.data);

export const createCategory = async (category) =>
    await api.post("/categories", category).then(res => res.data);

export const updateCategory = async (id, category) =>
    await api.put(`/categories/${id}`, category).then(res => res.data);

export const deleteCategory = async (id) =>
    await api.delete(`/categories/${id}`).then(res => res.data)
//#endregion

//#region RATINGS
export const getRatings = async (productId) =>
    await api.get(`/products/${productId}/ratings`).then(res => res.data);

export const addRating = async (productId, rating) =>
    await api.post(`/products/${productId}/ratings`, rating).then(res => res.data);
//#endregion

//#region USER
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginUser = async (credentials) =>
    await api
        .post("/users/login", credentials)
        .then((res) => res.data);

export const registerUser = async (user) =>
    await api.post("/users/register", user).then((res) => res.data);

export const logoutUser = async () => {
  const token = localStorage.getItem("jwt");
  return api.post("/users/logout", null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile", error);
    throw error;
  }
};
//#endregion

//#region ADDRESS
export const getAddresses = async (userId) =>
    await api.get(`/users/${userId}/addresses`).then(res => res.data);

export const addAddress = async (userId, address) =>
    await api.post(`/users/${userId}/addresses`, address).then(res => res.data);

export const updateAddress = async (userId, address) =>
    await api.post(`/users/${userId}/addresses`, address).then(res => res.data);

export const deleteAddress = async (userId, addressId) =>
    await api.delete(`/users/${userId}/addresses/${addressId}`).then(res => res.data);
//#endregion

//#region ADMIN
export const getAuthLogs = async () =>
    await api.get("/admin/logs").then(res => res.data);
//#endregion

//#region CART
export const getCart = async () =>
  await api.get("/cart").then(res => res.data);

export const addToCart = async (productId, quantity = 1) =>
  await api.post("/cart/add", { productId, quantity });

export const updateCartItem = async (cartItemId, quantity) =>
  await api.put(`/cart/update/${cartItemId}`, quantity, {
    headers: { 'Content-Type': 'application/json' }
  });

export const removeCartItem = async (cartItemId) =>
  await api.delete(`/cart/remove/${cartItemId}`);
//#endregion

//#region ORDER
export const createOrder = async ({ userId, shippingAddress, paymentType }) => {
  const params = new URLSearchParams({ userId, shippingAddress, paymentType });
  const response = await api.post(`/orders?${params.toString()}`);
  return response.data;
};

export const getUserOrders = async (userId) => {
  const token = localStorage.getItem("jwt");

  const response = await api.get(`/orders/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};
//#endregion