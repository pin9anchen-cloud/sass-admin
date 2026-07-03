import { useCallback } from "react";
import { Row, Col, Button, Table, Badge, Card, message } from "antd";
import useOrders from "../../hooks/useOrders";
import useOrderSocket from "../../hooks/useOrderSocket";
import OrderStatusTag from "./components/OrderStatusTag";
import StatCard from "./components/StatCard";
import { getShopName, clearAuth } from "../../utils/auth";
import "./index.css";

function MerchantAdmin() {
  const {
    stats,
    orders,
    filterStatus,
    loadStats,
    handleFilter,
    handleComplete,
  } = useOrders();

  const handleSocketMessage = useCallback(
    (event) => {
      message.success("🔔 " + event.data);
      loadStats();
      handleFilter("");
    },
    [loadStats, handleFilter],
  );

  const wsConnected = useOrderSocket(handleSocketMessage);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
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
    {
      title: "状态",
      dataIndex: "status",
      render: (v) => <OrderStatusTag status={v} />,
    },
    {
      title: "操作",
      render: (_, record) =>
        record.status === "PAID" ? (
          <a onClick={() => handleComplete(record.orderNo)}>标记完成</a>
        ) : null,
    },
  ];

  return (
    <div className="merchant-admin">
      <div className="merchant-admin-header">
        🏪 {getShopName() || "商家后台"}
        <Badge
          status={wsConnected ? "success" : "error"}
          text={wsConnected ? "实时监听中" : "连接断开"}
          className="merchant-admin-badge"
        />
        <Button
          size="small"
          className="merchant-admin-logout"
          onClick={handleLogout}
        >
          退出登录
        </Button>
      </div>

      <Row gutter={16} className="merchant-admin-stats">
        <Col span={6}>
          <StatCard
            title="营业额（已支付）"
            value={stats.revenue || 0}
            prefix="¥"
            color="#00b894"
            active={filterStatus === "PAID"}
            onClick={() => handleFilter("PAID")}
          />
        </Col>
        <Col span={4}>
          <StatCard
            title="总订单"
            value={stats.totalOrders || 0}
            active={filterStatus === ""}
            onClick={() => handleFilter("")}
          />
        </Col>
        <Col span={4}>
          <StatCard
            title="已支付"
            value={stats.paidOrders || 0}
            color="#00b894"
            active={filterStatus === "PAID"}
            onClick={() => handleFilter("PAID")}
          />
        </Col>
        <Col span={4}>
          <StatCard
            title="待支付"
            value={stats.unpaidOrders || 0}
            color="#e17055"
            active={filterStatus === "UNPAID"}
            onClick={() => handleFilter("UNPAID")}
          />
        </Col>
        <Col span={4}>
          <StatCard
            title="已取消"
            value={stats.cancelledOrders || 0}
            color="#999"
            active={filterStatus === "CANCELLED"}
            onClick={() => handleFilter("CANCELLED")}
          />
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
