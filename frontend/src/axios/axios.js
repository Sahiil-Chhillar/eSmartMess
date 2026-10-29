// src/api/axios.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const instance = axios.create({
  baseURL: process.env.VITE_API_URL || "http://localhost:5000/api", // Your backend base URL
  withCredentials: true, // Important for sending cookies
});

export default instance;
