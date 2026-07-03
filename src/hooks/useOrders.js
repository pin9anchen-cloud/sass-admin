// 封装商家后台的统计、订单列表（真分页）、筛选与完成订单逻辑
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
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState(""); // ''=全部
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const loadStats = useCallback(() => {
    getOrderStatisticsAPI().then((res) => setStats(res.data || {}));
  }, []);

  // 后端返回的是 IPage 序列化结果：{ records, total, ... }
  const loadOrders = useCallback((status, page, pageSize) => {
    getOrdersAPI(status, page, pageSize).then((res) => {
      setOrders(res.data?.records || []);
      setTotal(res.data?.total || 0);
    });
  }, []);

  useEffect(() => {
    loadStats();
    loadOrders("", 1, 10);
  }, [loadStats, loadOrders]);

  const handleFilter = useCallback(
    (status) => {
      setFilterStatus(status);
      setPagination((prev) => ({ ...prev, current: 1 })); // 切换筛选后回到第一页，避免停在一个筛选后不存在的页码上
      loadOrders(status, 1, pagination.pageSize);
    },
    [loadOrders, pagination.pageSize],
  );

  const handlePageChange = useCallback(
    (current, pageSize) => {
      setPagination({ current, pageSize });
      loadOrders(filterStatus, current, pageSize);
    },
    [loadOrders, filterStatus],
  );

  const handleComplete = useCallback(
    (orderNo) => {
      completeOrderAPI(orderNo)
        .then(() => {
          message.success("订单已完成");
          loadStats();
          loadOrders(filterStatus, pagination.current, pagination.pageSize);
        })
        .catch((e) => {
          message.error(e.response?.data?.message || "操作失败");
        });
    },
    [loadStats, loadOrders, filterStatus, pagination],
  );

  return {
    stats,
    orders,
    total,
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
