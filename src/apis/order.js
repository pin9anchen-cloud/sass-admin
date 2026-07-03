// 订单相关的请求
import request from "../utils/request";

// 商家后台
export function getOrderStatisticsAPI() {
  return request.get("/orders/statistics");
}

export function getOrdersAPI(status, page = 1, pageSize = 10) {
  const params = new URLSearchParams({ page, pageSize });
  if (status) {
    params.set("status", status);
  }
  return request.get(`/orders?${params.toString()}`);
}

export function completeOrderAPI(orderNo) {
  return request.post(`/orders/complete?orderNo=${orderNo}`);
}

// 顾客点餐端（按租户区分）
export function createOrderAPI(tenantId, productId, quantity) {
  return request.post(
    `/orders?productId=${productId}&quantity=${quantity}`,
    null,
    { headers: { "X-Tenant-Id": tenantId } },
  );
}

export function payCallbackAPI(tenantId, orderNo) {
  return request.post(`/orders/pay/callback?orderNo=${orderNo}`, null, {
    headers: { "X-Tenant-Id": tenantId },
  });
}
