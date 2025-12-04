import React from 'react';
import { Modal, Form, Input, Button, notification } from 'antd';
import { createUserApi } from "../../util/api";
import { registerSchema } from '../../validation';

const RegisterModal = ({ open, onClose, onSwitchToLogin }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    // Validate with Yup
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
        notification.success({ 
          message: "Đăng ký thành công", 
          description: "Bạn có thể đăng nhập ngay bây giờ!" 
        });
        onClose();
        // Chuyển sang modal đăng nhập
        setTimeout(() => {
          onSwitchToLogin();
        }, 500);
      } else {
        notification.error({ 
          message: "Đăng ký thất bại", 
          description: res?.EM || "Đã xảy ra lỗi" 
        });
      }
    } catch (err) {
      notification.error({ 
        message: "Đăng ký thất bại", 
        description: err?.message || "Đã xảy ra lỗi" 
      });
    }
  };

  // Reset form khi modal đóng
  React.useEffect(() => {
    if (!open && form) {
      // Chỉ reset khi form đã được mount
      try {
        form.resetFields();
      } catch (error) {
        // Ignore error nếu form chưa được mount
      }
    }
  }, [open, form]);

  return (
    <Modal
      title="Đăng Ký Tài Khoản"
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
    >
      <Form 
        form={form} 
        name="register_form" 
        onFinish={onFinish} 
        autoComplete="off" 
        layout="vertical"
      >
        <Form.Item 
          label="Họ và tên" 
          name="name" 
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item 
          label="Email" 
          name="email" 
          rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item 
          label="Mật khẩu" 
          name="password" 
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item 
          label="Xác nhận mật khẩu" 
          name="confirmPassword" 
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <span style={{ color: '#666' }}>Đã có tài khoản? </span>
        <Button 
          type="link" 
          onClick={() => {
            onClose();
            onSwitchToLogin();
          }}
          style={{ padding: 0 }}
        >
          Đăng nhập ngay
        </Button>
      </div>
    </Modal>
  );
};

export default RegisterModal;

