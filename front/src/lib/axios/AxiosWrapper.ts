import axios, { AxiosError, AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (err: AxiosError) => {
    const originalReq = err.config as AxiosRequestConfig & { _retry?: boolean };

    if (err.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      try {
        const res = await api.post("/auth/refresh");

        // If your backend returns the new access token in JSON:
        if (res.data?.accessToken) {
          originalReq.headers = {
            ...originalReq.headers,
            Authorization: `Bearer ${res.data.accessToken}`,
          };
        }

        return api(originalReq);
      } catch (refreshErr) {
        console.error("Refresh failed:", refreshErr);
        // Optionally clear cookies or redirect
        window.location.href = "/";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  },
);

export default api;
