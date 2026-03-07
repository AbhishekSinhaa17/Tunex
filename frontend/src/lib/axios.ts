// src/lib/axios.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:4000/api" : "https://tunex.onrender.com/api", // ✅ This must match your backend
});
