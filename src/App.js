import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CustomerOrder from "./pages/CustomerOrder";
import MerchantAdmin from "./pages/MerchantAdmin";
import Login from "./pages/Login";

// 路由守卫：有 token 才能进，否则跳登录页
function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 顾客扫码点餐 */}
        <Route path="/order" element={<CustomerOrder />} />

        {/* 商家登录 */}
        <Route path="/login" element={<Login />} />

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

export default App;
