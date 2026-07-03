// 商品/菜单相关的请求（顾客点餐端，按租户区分）
import request from "../utils/request";

export function getProductsAPI(tenantId) {
  return request.get("/products", { headers: { "X-Tenant-Id": tenantId } });
}
