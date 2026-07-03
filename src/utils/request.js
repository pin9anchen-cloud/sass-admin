// axios 统一封装：请求拦截器带 token，响应拦截器处理续期和登录过期
import axios from "axios";
import { getToken, setToken, clearAuth } from "./auth";

export const API_BASE_URL = "http://localhost:8080";

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
