import axios from "axios";
import API_BASE_URL from "../../config/api";
const API = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`,
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getWithdrawals = () => API.get("/withdrawals");

export const markWithdrawalPaid = (id) =>
  API.patch(`/withdrawals/${id}/pay`);
export const getUsers = () => API.get("/users");

export const blockUser = (id) =>
  API.patch(`/users/${id}/block`);

export const unblockUser = (id) =>
  API.patch(`/users/${id}/unblock`);
export const getReviews = () => API.get("/reviews");

export const toggleReview = (id) =>
  API.patch(`/reviews/${id}/toggle`);

export default API;
