// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Button, Form, Input, notification, Steps } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { forgotPasswordAPI, resetPasswordAPI } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';

// import schemas
import { forgotEmailSchema, resetPasswordSchema } from '../validation';

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // two forms (step1 + step2)
  const [formStep1] = Form.useForm();
  const [formStep2] = Form.useForm();

  const onCheckEmail = async (values) => {
    setLoading(true);
    try {
      // validate with Yup
      try {
        await forgotEmailSchema.validate(values, { abortEarly: false });
      } catch (err) {
        const fields = (err.inner || []).map(e => ({ name: e.path, errors: [e.message] }));
        formStep1.setFields(fields);
        setLoading(false);
        return;
      }

      const res = await forgotPasswordAPI(values.email);
      if (res && res.EC === 0) {
        notification.success({ message: 'Thành công', description: 'Email hợp lệ. Vui lòng nhập mật khẩu mới.' });
        setEmail(values.email);
        setCurrentStep(1);
      } else {
        notification.error({ message: 'Lỗi', description: res?.EM || 'Email không tồn tại trong hệ thống' });
      }
    } catch (error) {
      notification.error({ message: 'Lỗi', description: 'Không thể kết nối đến server' });
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (values) => {
    setLoading(true);
    try {
      // validate with Yup
      try {
        await resetPasswordSchema.validate(values, { abortEarly: false });
      } catch (err) {
        const fields = (err.inner || []).map(e => ({ name: e.path, errors: [e.message] }));
        formStep2.setFields(fields);
        setLoading(false);
        return;
      }

      const res = await resetPasswordAPI(email, values.newPassword, values.confirmPassword);
      if (res && res.EC === 0) {
        notification.success({ message: 'Thành công', description: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.' });
        setTimeout(() => navigate('/login'), 1500);
      } else {
        notification.error({ message: 'Lỗi', description: res?.EM || 'Đổi mật khẩu thất bại' });
      }
    } catch (error) {
      notification.error({ message: 'Lỗi', description: 'Không thể kết nối đến server' });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Xác thực Email', description: 'Nhập email của bạn' },
    { title: 'Đặt lại mật khẩu', description: 'Nhập mật khẩu mới' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#667eea', fontSize: '28px' }}>Quên Mật Khẩu</h2>

        <Steps current={currentStep} items={steps} style={{ marginBottom: '30px' }} />

        {currentStep === 0 && (
          <Form form={formStep1} name="forgot_password_step1" onFinish={onCheckEmail} layout="vertical">
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
              <Input prefix={<MailOutlined />} placeholder="Nhập email của bạn" size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ background: '#667eea', borderColor: '#667eea' }}>
                Tiếp tục
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/login" style={{ color: '#667eea' }}>Quay lại đăng nhập</Link>
            </div>
          </Form>
        )}

        {currentStep === 1 && (
          <Form form={formStep2} name="forgot_password_step2" onFinish={onResetPassword} layout="vertical">
            <div style={{ background: '#f0f2f5', padding: '10px 15px', borderRadius: '5px', marginBottom: '20px' }}>
              <strong>Email:</strong> {email}
            </div>

            <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" size="large" />
            </Form.Item>

            <Form.Item label="Nhập lại mật khẩu mới" name="confirmPassword" dependencies={['newPassword']} rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu!' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ background: '#667eea', borderColor: '#667eea' }}>
                Đổi mật khẩu
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button type="link" onClick={() => { setCurrentStep(0); setEmail(''); formStep1.resetFields(); formStep2.resetFields(); }} style={{ color: '#667eea' }}>
                Quay lại
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
