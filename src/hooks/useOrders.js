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
  // 受控分页：后端接口目前还是一次性返回全量订单（真分页见 BACKEND_TODO.md），
  // 这里先把分页状态收进 React，方便以后接上后端分页时只用改 loadOrders 的调用方式
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

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
      setPagination((prev) => ({ ...prev, current: 1 })); // 切换筛选后回到第一页，避免停在一个筛选后不存在的页码上
      loadOrders(status);
    },
    [loadOrders],
  );

  const handlePageChange = useCallback((current, pageSize) => {
    setPagination({ current, pageSize });
  }, []);

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
    pagination,
    loadStats,
    loadOrders,
    handleFilter,
    handlePageChange,
    handleComplete,
  };
}

export default useOrders;
