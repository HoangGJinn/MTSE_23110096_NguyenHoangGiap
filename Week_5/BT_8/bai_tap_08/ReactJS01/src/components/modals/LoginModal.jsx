import React, { useContext } from 'react';
import { Modal, Input, Button, Checkbox, notification } from 'antd';
import { loginApi } from "../../util/api";
import { AuthContext } from "../context/auth.context";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../validation';

const LoginModal = ({ open, onClose, onSwitchToRegister }) => {
  const { setAuth } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Reset form khi modal đóng
  React.useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (values) => {
    const { email, password, rememberMe } = values;

    try {
      const res = await loginApi(email, password, rememberMe);

      if (res && res.EC === 0) {
        localStorage.setItem('access_token', res.access_token);
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }

        notification.success({
          message: 'Đăng nhập thành công',
          description: 'Chào mừng bạn quay trở lại!'
        });

        setAuth({
          isAuthenticated: true,
          user: {
            email: res?.user?.email ?? '',
            name: res?.user?.name ?? '',
            role: res?.user?.role ?? 'User'
          }
        });

        onClose(); // Đóng modal
      } else {
        setError('password', {
          type: 'server',
          message: res?.EM || 'Email hoặc mật khẩu không đúng!'
        });
      }
    } catch (err) {
      setError('password', {
        type: 'server',
        message: 'Không thể kết nối đến máy chủ!'
      });
    }
  };

  return (
    <Modal
      title="Đăng Nhập"
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Nhập email"
                size="large"
              />
            )}
          />
          {errors.email && (
            <div style={{ color: 'red', marginTop: 6, fontSize: '12px' }}>{errors.email.message}</div>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Mật khẩu</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                placeholder="Nhập mật khẩu"
                size="large"
              />
            )}
          />
          {errors.password && (
            <div style={{ color: 'red', marginTop: 6, fontSize: '12px' }}>{errors.password.message}</div>
          )}
        </div>

        {/* Remember Me */}
        <div style={{ marginBottom: 16 }}>
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              >
                Ghi nhớ đăng nhập
              </Checkbox>
            )}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isSubmitting}
            block
            size="large"
          >
            Đăng nhập
          </Button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ color: '#666' }}>Chưa có tài khoản? </span>
          <Button 
            type="link" 
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
            style={{ padding: 0 }}
          >
            Đăng ký ngay
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;

