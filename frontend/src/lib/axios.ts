import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:4000/api"
      : "https://tunex.onrender.com/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  const clerk = (window as any).Clerk;

  if (clerk && clerk.session) {
    const token = await clerk.session.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});