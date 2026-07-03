import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Table,
  Tag,
  Badge,
  message,
} from "antd";
import axios from "axios";

const API = "http://localhost:8080";

const http = axios.create({
  baseURL: API,
});
// 每个请求自动带上 Token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
http.interceptors.response.use(
  (res) => {
    // 如果响应头带了新token，替换掉本地的（滑动续期）
    const newToken = res.headers["new-token"];
    if (newToken) {
      localStorage.setItem("token", newToken);
    }
    return res;
  },
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.clear();
      window.location.href = "/login"; // 3天没操作，token过期，跳登录
    }
    return Promise.reject(err);
  },
);

const statusTag = (status) => {
  const map = {
    PAID: { color: "green", text: "已支付" },
    UNPAID: { color: "orange", text: "待支付" },
    COMPLETED: { color: "blue", text: "已完成" },
    CANCELLED: { color: "default", text: "已取消" },
  };
  const s = map[status] || { color: "default", text: status };
  return <Tag color={s.color}>{s.text}</Tag>;
};

function MerchantAdmin() {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [filterStatus, setFilterStatus] = useState(""); // ''=全部

  const loadStats = useCallback(() => {
    http.get("/orders/statistics").then((res) => setStats(res.data.data || {}));
  }, []);

  const loadOrders = useCallback((status) => {
    const url = status ? `/orders?status=${status}` : "/orders";
    http.get(url).then((res) => setOrders(res.data.data || []));
  }, []);

  const refresh = useCallback(() => {
    loadStats();
    loadOrders(filterStatus);
  }, [loadStats, loadOrders, filterStatus]);

  // 点击卡片筛选
  const handleFilter = (status) => {
    setFilterStatus(status);
    loadOrders(status);
  };

  useEffect(() => {
    loadStats();
    loadOrders("");

    const tenantId = localStorage.getItem("tenantId");
    const ws = new WebSocket(`ws://localhost:8080/ws/order/${tenantId}`);
    ws.onopen = () => setWsConnected(true);
    ws.onmessage = (event) => {
      message.success("🔔 " + event.data);
      loadStats();
      loadOrders("");
      setFilterStatus("");
    };
    ws.onclose = () => setWsConnected(false);
    // 组件卸载时关闭连接，避免残留 socket
    return () => ws.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //完成订单
  const handleComplete = (orderNo) => {
    http
      .post(`/orders/complete?orderNo=${orderNo}`)
      .then(() => {
        message.success("订单已完成");
        loadStats();
        refresh(filterStatus); // 用当前筛选状态重新查
      })
      .catch((e) => {
        message.error(e.response?.data?.message || "操作失败");
      });
  };

  const columns = [
    {
      title: "订单号",
      dataIndex: "orderNo",
      render: (v) => v.substring(0, 8) + "...",
    },
    { title: "商品", dataIndex: "productName" },
    { title: "数量", dataIndex: "quantity" },
    { title: "金额", dataIndex: "amount", render: (v) => "¥" + v },
    { title: "状态", dataIndex: "status", render: (v) => statusTag(v) },
    {
      title: "操作",
      render: (_, record) =>
        record.status === "PAID" ? (
          <a onClick={() => handleComplete(record.orderNo)}>标记完成</a>
        ) : null,
    },
  ];

  const cardStyle = (status) => ({
    cursor: "pointer",
    border: filterStatus === status ? "2px solid #6c5ce7" : undefined,
  });

  return (
    <div style={{ padding: 24, background: "#f5f6fa", minHeight: "100vh" }}>
      <div style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>
        🏪 {localStorage.getItem("shopName") || "商家后台"}
        <Badge
          status={wsConnected ? "success" : "error"}
          text={wsConnected ? "实时监听中" : "连接断开"}
          style={{ marginLeft: 16, fontSize: 14, fontWeight: 400 }}
        />
        <Button
          size="small"
          style={{ float: "right" }}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          退出登录
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card
            hoverable
            onClick={() => handleFilter("PAID")}
            style={cardStyle("PAID")}
          >
            <Statistic
              title="营业额（已支付）"
              value={stats.revenue || 0}
              prefix="¥"
              valueStyle={{ color: "#00b894" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card
            hoverable
            onClick={() => handleFilter("")}
            style={cardStyle("")}
          >
            <Statistic title="总订单" value={stats.totalOrders || 0} />
          </Card>
        </Col>
        <Col span={4}>
          <Card
            hoverable
            onClick={() => handleFilter("PAID")}
            style={cardStyle("PAID")}
          >
            <Statistic
              title="已支付"
              value={stats.paidOrders || 0}
              valueStyle={{ color: "#00b894" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card
            hoverable
            onClick={() => handleFilter("UNPAID")}
            style={cardStyle("UNPAID")}
          >
            <Statistic
              title="待支付"
              value={stats.unpaidOrders || 0}
              valueStyle={{ color: "#e17055" }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card
            hoverable
            onClick={() => handleFilter("CANCELLED")}
            style={cardStyle("CANCELLED")}
          >
            <Statistic
              title="已取消"
              value={stats.cancelledOrders || 0}
              valueStyle={{ color: "#999" }}
            />
          </Card>
        </Col>
      </Row>

      <Card title={`订单列表（${filterStatus || "全部"}）`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={orders}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}

export default MerchantAdmin;
