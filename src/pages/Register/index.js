import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, message } from "antd";
import { registerAPI } from "../../apis/auth";
import { setAuth } from "../../utils/auth";
import "./index.css";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await registerAPI(
        values.username,
        values.password,
        values.shopName,
      );
      if (res.code === 200) {
        // 注册成功后端直接签发 token，等同登录，不用再跳一次登录页
        setAuth(res.data);
        message.success("注册成功");
        navigate("/admin");
      } else {
        message.error(res.message || "注册失败");
      }
    } catch (e) {
      message.error(e.response?.data?.message || "注册失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <Card title="商家注册" className="register-card">
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input placeholder="账号" size="large" />
          </Form.Item>
          <Form.Item
            name="shopName"
            rules={[{ required: true, message: "请输入店铺名" }]}
          >
            <Input placeholder="店铺名" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码长度不能少于6位" },
            ]}
          >
            <Input.Password placeholder="密码（至少6位）" size="large" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "请再次输入密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="确认密码" size="large" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            注册
          </Button>
        </Form>
        <div className="register-footer">
          已有账号？<Link to="/login">去登录</Link>
        </div>
      </Card>
    </div>
  );
}

export default Register;
