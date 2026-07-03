// 封装顾客点餐端的菜单加载逻辑
import { useEffect, useState } from "react";
import { message } from "antd";
import { getProductsAPI } from "../apis/product";

function useProducts(tenantId) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!tenantId) return;
    getProductsAPI(tenantId)
      .then((res) => setProducts(res.data || []))
      .catch(() => message.error("加载菜单失败"));
  }, [tenantId]);

  return products;
}

export default useProducts;
