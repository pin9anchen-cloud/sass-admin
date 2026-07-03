import { Tag } from "antd";

const STATUS_MAP = {
  PAID: { color: "green", text: "已支付" },
  UNPAID: { color: "orange", text: "待支付" },
  COMPLETED: { color: "blue", text: "已完成" },
  CANCELLED: { color: "default", text: "已取消" },
};

function OrderStatusTag({ status }) {
  const s = STATUS_MAP[status] || { color: "default", text: status };
  return <Tag color={s.color}>{s.text}</Tag>;
}

export default OrderStatusTag;
