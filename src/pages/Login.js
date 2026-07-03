import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, message } from "antd";
import axios from "axios";

const API = "http://localhost:8080";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/auth/login?username=${values.username}&password=${values.password}`,
      );
      if (res.data.code === 200) {
        // 登录成功：把 token 和店铺名存起来
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("shopName", res.data.data.shopName);
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("shopName", res.data.data.shopName);
        localStorage.setItem("tenantId", res.data.data.tenantId); // 加这行
        message.success("登录成功");
        navigate("/admin"); // 跳到后台
      } else {
        message.error(res.data.message || "登录失败");
      }
    } catch (e) {
      message.error(e.response?.data?.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f6fa",
      }}
    >
      <Card title="商家登录" style={{ width: 360 }}>
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input placeholder="账号（shop1）" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password placeholder="密码（123456）" size="large" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            登录
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
