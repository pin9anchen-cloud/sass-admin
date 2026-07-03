import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, message } from "antd";
import { loginAPI } from "../../apis/auth";
import { setAuth } from "../../utils/auth";
import "./index.css";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await loginAPI(values.username, values.password);
      if (res.code === 200) {
        setAuth(res.data);
        message.success("登录成功");
        navigate("/admin"); // 跳到后台
      } else {
        message.error(res.message || "登录失败");
      }
    } catch (e) {
      message.error(e.response?.data?.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <Card title="商家登录" className="login-card">
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
        <div className="login-footer">
          还没有账号？<Link to="/register">去注册</Link>
        </div>
      </Card>
    </div>
  );
}

export default Login;
