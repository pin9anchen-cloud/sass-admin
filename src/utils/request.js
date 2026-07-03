// axios 统一封装：请求拦截器带 token，响应拦截器处理续期和登录过期
import axios from "axios";
import { getToken, setToken, clearAuth } from "./auth";

// 支持通过 REACT_APP_API_BASE_URL 环境变量在不同环境下指向不同后端，本地开发默认走 localhost
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

// WebSocket 地址默认由 API_BASE_URL 派生（http -> ws，https -> wss），
// 也可以用 REACT_APP_WS_BASE_URL 单独覆盖（比如接口和 WS 网关不在同一个域名时）
export const WS_BASE_URL =
  process.env.REACT_APP_WS_BASE_URL || API_BASE_URL.replace(/^http/, "ws");

const request = axios.create({
  baseURL: API_BASE_URL,
});

request.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (res) => {
    // 滑动续期：响应头带了新 token 就替换掉本地的
    const newToken = res.headers["new-token"];
    if (newToken) {
      setToken(newToken);
    }
    return res.data;
  },
  (err) => {
    if (err.response?.status === 401) {
      clearAuth();
      window.location.href = "/login"; // 3天没操作，token过期，跳登录
    }
    return Promise.reject(err);
  },
);

export default request;
