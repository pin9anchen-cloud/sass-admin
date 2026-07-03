import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  Button,
  InputNumber,
  List,
  message,
  Divider,
  Result,
} from "antd";
import axios from "axios";

const API = "http://localhost:8080";

function CustomerOrder() {
  const [params] = useSearchParams();
  const tenantId = params.get("tenantId");
  const table = params.get("table");

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({}); // { productId: quantity }
  const [ordered, setOrdered] = useState(null); // 下单成功后的订单

  // 带租户头的请求实例
  const http = axios.create({
    baseURL: API,
    headers: { "X-Tenant-Id": tenantId },
  });

  // 加载菜单
  useEffect(() => {
    if (!tenantId) return;
    http
      .get("/products")
      .then((res) => setProducts(res.data.data || []))
      .catch(() => message.error("加载菜单失败"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  // 改数量
  const changeQty = (productId, qty) => {
    setCart((prev) => ({ ...prev, [productId]: qty }));
  };

  // 计算合计
  const total = products.reduce((sum, p) => {
    const qty = cart[p.id] || 0;
    return sum + Number(p.price) * qty;
  }, 0);

  // 下单（简化：把购物车里每个商品分别下单；真实可做成一单多商品，这里先一商品一单）
  const submit = async () => {
    const items = Object.entries(cart).filter(([, qty]) => qty > 0);
    if (items.length === 0) {
      message.warning("请先选择商品");
      return;
    }
    try {
      let lastOrder = null;
      for (const [productId, qty] of items) {
        const res = await http.post(
          `/orders?productId=${productId}&quantity=${qty}`,
        );
        lastOrder = res.data.data;
      }
      // 演示：直接模拟支付成功
      if (lastOrder) {
        await http.post(`/orders/pay/callback?orderNo=${lastOrder.orderNo}`);
      }
      setOrdered(lastOrder);
      message.success("下单并支付成功！");
    } catch (e) {
      message.error(e.response?.data?.message || "下单失败");
    }
  };

  // 没有 tenantId：提示扫码
  if (!tenantId) {
    return <Result status="warning" title="请扫描店内二维码进入点餐" />;
  }

  // 下单成功页
  if (ordered) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
        <Result
          status="success"
          title="下单成功！"
          subTitle={`订单号：${ordered.orderNo.substring(0, 8)}... 金额：¥${ordered.amount}`}
          extra={
            <Button
              onClick={() => {
                setOrdered(null);
                setCart({});
              }}
            >
              继续点餐
            </Button>
          }
        />
      </div>
    );
  }

  // 点餐页
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: 16,
        background: "#f5f6fa",
        minHeight: "100vh",
      }}
    >
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>🍽️ 扫码点餐</div>
        <div style={{ color: "#999", fontSize: 13 }}>桌号：{table || "-"}</div>
      </Card>

      <Card title="菜单">
        <List
          dataSource={products}
          renderItem={(p) => {
            const soldOut = p.stock <= 0; // 库存为0 = 售罄
            return (
              <List.Item
                style={{ opacity: soldOut ? 0.4 : 1 }} // 售罄的整行浅色显示
                actions={[
                  soldOut ? (
                    <span style={{ color: "#999" }}>已售罄</span>
                  ) : (
                    <InputNumber
                      min={0}
                      max={p.stock}
                      value={cart[p.id] || 0}
                      onChange={(v) => changeQty(p.id, v || 0)}
                    />
                  ),
                ]}
              >
                <List.Item.Meta title={p.name} description={`¥${p.price}`} />
              </List.Item>
            );
          }}
        />
      </Card>

      <div style={{ position: "sticky", bottom: 0, marginTop: 12 }}>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 18 }}>
              合计：<b style={{ color: "#f5222d" }}>¥{total.toFixed(2)}</b>
            </span>
            <Button type="primary" size="large" onClick={submit}>
              下单并支付
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CustomerOrder;
