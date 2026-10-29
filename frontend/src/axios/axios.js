// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // Your backend base URL
  withCredentials: true, // Important for sending cookies
});

export default instance;
