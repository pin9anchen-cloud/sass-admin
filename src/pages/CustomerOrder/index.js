import { useSearchParams } from "react-router-dom";
import { Card, Button, InputNumber, List, Result } from "antd";
import useProducts from "../../hooks/useProducts";
import useCart from "../../hooks/useCart";
import "./index.css";

function CustomerOrder() {
  const [params] = useSearchParams();
  const tenantId = params.get("tenantId");
  const table = params.get("table");

  const products = useProducts(tenantId);
  const { cart, total, ordered, changeQty, submit, reset } = useCart(
    tenantId,
    products,
  );

  // 没有 tenantId：提示扫码
  if (!tenantId) {
    return <Result status="warning" title="请扫描店内二维码进入点餐" />;
  }

  // 下单成功页
  if (ordered) {
    const paidAmount = ordered.reduce((sum, o) => sum + Number(o.amount), 0);
    return (
      <div className="customer-order-result">
        <Result
          status="success"
          title="下单成功！"
          subTitle={`共 ${ordered.length} 笔订单，合计支付 ¥${paidAmount.toFixed(2)}`}
          extra={<Button onClick={reset}>继续点餐</Button>}
        />
      </div>
    );
  }

  // 点餐页
  return (
    <div className="customer-order">
      <Card className="customer-order-header">
        <div className="customer-order-title">🍽️ 扫码点餐</div>
        <div className="customer-order-table">桌号：{table || "-"}</div>
      </Card>

      <Card title="菜单">
        <List
          dataSource={products}
          renderItem={(p) => {
            const soldOut = p.stock <= 0; // 库存为0 = 售罄
            return (
              <List.Item
                className={soldOut ? "customer-order-item-soldout" : undefined}
                actions={[
                  soldOut ? (
                    <span className="customer-order-soldout-text">已售罄</span>
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

      <div className="customer-order-footer">
        <Card>
          <div className="customer-order-total-row">
            <span className="customer-order-total">
              合计：
              <b className="customer-order-total-amount">¥{total.toFixed(2)}</b>
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
