import axios from "axios";

// Always use the env variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL, // Example: https://ecommerce-website-wvpa.onrender.com
});

export default api;