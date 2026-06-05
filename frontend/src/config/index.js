import axios from "axios";

export const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function ApiCall(url, method = "GET", data = null, params = null, options = {}) {
  const token = localStorage.getItem("access_token") || localStorage.getItem("adminToken");
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return axios({
    url: `${baseUrl}${url}`,
    method,
    data,
    params,
    headers,
    responseType: options.responseType,
    onUploadProgress: options.onUploadProgress,
    timeout: options.timeout || 30000,
  })
    .then((res) => ({
      error: false,
      data: res.data,
      status: res.status,
      headers: res.headers,
      raw: res,
    }))
    .catch((err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("adminToken");
        if (window.location.pathname.startsWith("/admin")) {
          window.location.href = "/admin/login";
        }
      }

      return {
        error: true,
        data: err.response?.data,
        status: err.response?.status,
        message: err.message,
        raw: err,
      };
    });
}
