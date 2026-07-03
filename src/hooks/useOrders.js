// 封装商家后台的统计、订单列表、筛选与完成订单逻辑
import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import {
  getOrderStatisticsAPI,
  getOrdersAPI,
  completeOrderAPI,
} from "../apis/order";

function useOrders() {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState(""); // ''=全部

  const loadStats = useCallback(() => {
    getOrderStatisticsAPI().then((res) => setStats(res.data || {}));
  }, []);

  const loadOrders = useCallback((status) => {
    getOrdersAPI(status).then((res) => setOrders(res.data || []));
  }, []);

  useEffect(() => {
    loadStats();
    loadOrders("");
  }, [loadStats, loadOrders]);

  const handleFilter = useCallback(
    (status) => {
      setFilterStatus(status);
      loadOrders(status);
    },
    [loadOrders],
  );

  const handleComplete = useCallback(
    (orderNo) => {
      completeOrderAPI(orderNo)
        .then(() => {
          message.success("订单已完成");
          loadStats();
          loadOrders(filterStatus);
        })
        .catch((e) => {
          message.error(e.response?.data?.message || "操作失败");
        });
    },
    [loadStats, loadOrders, filterStatus],
  );

  return {
    stats,
    orders,
    filterStatus,
    loadStats,
    loadOrders,
    handleFilter,
    handleComplete,
  };
}

export default useOrders;
