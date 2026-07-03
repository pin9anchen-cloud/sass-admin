// 封装点餐购物车状态、合计计算与下单提交（简化：每个商品分别下单，真实场景应做成一单多商品）
import { useCallback, useState } from "react";
import { message } from "antd";
import { createOrderAPI, payCallbackAPI } from "../apis/order";

function useCart(tenantId, products) {
  const [cart, setCart] = useState({}); // { productId: quantity }
  const [ordered, setOrdered] = useState(null); // 下单成功后的订单列表

  const changeQty = useCallback((productId, qty) => {
    setCart((prev) => ({ ...prev, [productId]: qty }));
  }, []);

  const total = products.reduce((sum, p) => {
    const qty = cart[p.id] || 0;
    return sum + Number(p.price) * qty;
  }, 0);

  const submit = useCallback(async () => {
    const items = Object.entries(cart).filter(([, qty]) => qty > 0);
    if (items.length === 0) {
      message.warning("请先选择商品");
      return;
    }
    try {
      const createdOrders = [];
      for (const [productId, qty] of items) {
        const res = await createOrderAPI(tenantId, productId, qty);
        createdOrders.push(res.data);
      }
      // 演示：逐笔模拟支付成功，购物车里每个商品各自的订单都要付
      for (const order of createdOrders) {
        await payCallbackAPI(tenantId, order.orderNo);
      }
      setOrdered(createdOrders);
      message.success("下单并支付成功！");
    } catch (e) {
      message.error(e.response?.data?.message || "下单失败");
    }
  }, [cart, tenantId]);

  const reset = useCallback(() => {
    setOrdered(null);
    setCart({});
  }, []);

  return { cart, total, ordered, changeQty, submit, reset };
}

export default useCart;
