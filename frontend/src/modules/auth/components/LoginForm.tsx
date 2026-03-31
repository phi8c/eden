import { Form, Input, Button } from "antd"
import type { LoginDto } from "../dto/loginDto"

interface Props {
  onSubmit: (data: LoginDto) => Promise<void>
  loading?: boolean
}

export default function LoginForm({ onSubmit, loading }: Props) {
  const [form] = Form.useForm()

  const handleFinish = (values: LoginDto) => {
    onSubmit(values)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Email is required" }]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Password is required" }]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Login
        </Button>
      </Form.Item>
    </Form>
  )
}