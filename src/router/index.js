// 路由配置
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";
import CustomerOrder from "../pages/CustomerOrder";
import MerchantAdmin from "../pages/MerchantAdmin";
import Login from "../pages/Login";
import Register from "../pages/Register";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 顾客扫码点餐 */}
        <Route path="/order" element={<CustomerOrder />} />

        {/* 商家登录 */}
        <Route path="/login" element={<Login />} />

        {/* 商家注册 */}
        <Route path="/register" element={<Register />} />

        {/* 商家后台：需要登录 */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <MerchantAdmin />
            </RequireAuth>
          }
        />

        {/* 根路径跳后台（没登录会被守卫弹到登录页） */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
