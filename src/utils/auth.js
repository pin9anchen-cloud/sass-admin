// 登录态相关的本地存储读写
const TOKEN_KEY = "token";
const SHOP_NAME_KEY = "shopName";
const TENANT_ID_KEY = "tenantId";

export function setAuth({ token, shopName, tenantId }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SHOP_NAME_KEY, shopName);
  localStorage.setItem(TENANT_ID_KEY, tenantId);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getShopName() {
  return localStorage.getItem(SHOP_NAME_KEY);
}

export function getTenantId() {
  return localStorage.getItem(TENANT_ID_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SHOP_NAME_KEY);
  localStorage.removeItem(TENANT_ID_KEY);
}
