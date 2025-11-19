// src/pages/login.jsx
import React, { useContext } from 'react';
import { Button, Col, Divider, Input, notification, Row } from 'antd';
import { loginApi } from "../util/api";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../components/context/auth.context";
import { ArrowLeftOutlined } from '@ant-design/icons';

// React Hook Form + Yup
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// IMPORT SCHEMA TỪ FILE RIÊNG
// import { loginSchema } from '../validation/schemas/login.schema';
import { loginSchema } from '../validation';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  // Khởi tạo React Hook Form với yupResolver (dùng schema import)
  const {
    control,
    handleSubmit,
    setError,      // để map lỗi server về field
    setFocus,      // để focus vào field lỗi đầu tiên
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',        // validate khi blur (tùy chỉnh được)
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Hàm submit: RHF đã đảm bảo dữ liệu hợp lệ theo schema trước khi gọi
  const onSubmit = async (values) => {
    const { email, password } = values;

    try {
      const res = await loginApi(email, password);

      if (res && res.EC === 0) {
        // Lưu token, thông báo, set auth và điều hướng
        localStorage.setItem('access_token', res.access_token);
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

        navigate('/');
      } else {
        // Hiển thị lỗi dưới form thay vì notification
        setError('password', {
          type: 'server',
          message: res?.EM || 'Email hoặc mật khẩu không đúng!'
        });
      }
    } catch (err) {
      // Lỗi network
      setError('password', {
        type: 'server',
        message: 'Không thể kết nối đến máy chủ!'
      });
    }
  };

  // Nếu muốn focus vào field đầu tiên có lỗi client-side khi submit, có thể
  // lắng nghe errors và gọi setFocus tương ứng (option).
  React.useEffect(() => {
    // nếu có errors, focus vào field đầu tiên
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) setFocus(firstErrorKey);
  }, [errors, setFocus]);

  return (
    <Row justify={"center"} style={{ marginTop: 30 }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset style={{
          padding: 15,
          margin: 5,
          border: "1px solid #ccc",
          borderRadius: 5,
        }}>
          <legend>Đăng Nhập</legend>

          {/* Dùng form HTML (RHF) + AntD Input (qua Controller) */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập email"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                )}
              />
              {errors.email && (
                <div style={{ color: 'red', marginTop: 6 }}>{errors.email.message}</div>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Password</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="Nhập mật khẩu"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                )}
              />
              {errors.password && (
                <div style={{ color: 'red', marginTop: 6 }}>{errors.password.message}</div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  Login
                </Button>
                <Link to="/forgot-password" style={{ color: '#1890ff' }}>
                  Quên mật khẩu?
                </Link>
              </div>
            </div>
          </form>

          <Link to={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
          <Divider />
          <div style={{ textAlign: "center" }}>
            Chưa có tài khoản? <Link to={"/register"}>Đăng ký tại đây</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

export default LoginPage;
