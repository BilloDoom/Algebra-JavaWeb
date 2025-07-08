// src/api/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

//#region PRODUCT
export const getAllProducts = async () =>
    await api.get("/products").then(res => res.data);

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