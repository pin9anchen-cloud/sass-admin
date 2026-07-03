// 商家账号相关的请求
import request from "../utils/request";

// 用 form-urlencoded 请求体传账号密码，避免密码出现在 URL 里
export function loginAPI(username, password) {
  return request.post("/auth/login", new URLSearchParams({ username, password }));
}
