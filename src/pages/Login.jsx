import { Card, Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { loginDoctor } from "../services/authService";

const { Title } = Typography;

export default function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const result = await loginDoctor(values.email, values.password);

    if (result.success) {
      message.success("Login Successful");
      navigate("/dashboard");
    } else {
      message.error("Invalid Email or Password");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
      }}
    >
      <Card style={{ width: 400 }}>
        <Title level={3}>Doctor Login</Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            block
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}