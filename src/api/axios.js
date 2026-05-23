import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.dispatchEvent(new Event("unauthorized"));
    }

    err.message =
      err.response?.data?.message || err.message || "Something went wrong";

    return Promise.reject(err);
  },
);

export default api;
