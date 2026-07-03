import { Card, Statistic } from "antd";

function StatCard({ title, value, prefix, color, active, onClick }) {
  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        cursor: "pointer",
        border: active ? "2px solid #6c5ce7" : undefined,
      }}
    >
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        valueStyle={color ? { color } : undefined}
      />
    </Card>
  );
}

export default StatCard;
