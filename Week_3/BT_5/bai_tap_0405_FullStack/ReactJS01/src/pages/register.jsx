// src/pages/RegisterPage.jsx
import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { createUserApi } from "../util/api";
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

// import register schema
import { registerSchema } from '../validation';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    // validate with Yup before calling API
    try {
      await registerSchema.validate(values, { abortEarly: false });
    } catch (err) {
      const fields = (err.inner || []).map(e => ({ name: e.path, errors: [e.message] }));
      form.setFields(fields);
      return;
    }

    try {
      const { name, email, password } = values;
      const res = await createUserApi(name, email, password);
      if (res && res.EC === 0) {
        notification.success({ message: "CREATE USER", description: "Success" });
        navigate("/login");
      } else {
        notification.error({ message: "CREATE USER", description: res?.EM || "error" });
      }
    } catch (err) {
      notification.error({ message: "CREATE USER", description: err?.message || "Đã xảy ra lỗi" });
    }
  };

  return (
    <Row justify={"center"} style={{ marginTop: "30px" }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset style={{ padding: "15px", margin: "5px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <legend>Đăng Ký Tài Khoản</legend>
          <Form form={form} name="register_form" onFinish={onFinish} autoComplete="off" layout='vertical'>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
              <Input.Password />
            </Form.Item>

            <Form.Item label="Confirm Password" name="confirmPassword" rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}>
              <Input.Password />
            </Form.Item>

            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>

          <Link to={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
          <Divider />
          <div style={{ textAlign: "center" }}>Đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link></div>
        </fieldset>
      </Col>
    </Row>
  )
}

export default RegisterPage;
