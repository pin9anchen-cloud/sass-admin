// 路由守卫：有 token 才能进，否则跳登录页
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";

function RequireAuth({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

export default RequireAuth;
