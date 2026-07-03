// 商家账号相关的请求
import request from "../utils/request";

// 用 JSON 请求体传账号密码，避免密码出现在 URL 里；后端 /auth/login 现在是 @RequestBody
export function loginAPI(username, password) {
  return request.post("/auth/login", { username, password });
}
