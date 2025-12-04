import React, { useState, useEffect, useContext } from 'react';
import { 
    Card, 
    Form, 
    Input, 
    Button, 
    message, 
    Avatar, 
    Space, 
    Tag,
    Row,
    Col,
    DatePicker,
    Select
} from 'antd';
import { 
    UserOutlined, 
    MailOutlined, 
    PhoneOutlined, 
    EnvironmentOutlined, 
    EditOutlined,
    SaveOutlined,
    CameraOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { getAccountAPI } from '../util/api';
import './profile.css';

const { Option } = Select;
const { TextArea } = Input;

const ProfilePage = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [profileData, setProfileData] = useState(null);

    // Redirect to home if not authenticated (user can open login modal from there)
    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [auth.isAuthenticated, navigate]);

    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchProfile();
        }
    }, [auth.isAuthenticated]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await getAccountAPI();
            if (response && !response.message) {
                setProfileData(response);
                form.setFieldsValue({
                    name: response.name,
                    email: response.email,
                    phone: response.profile?.phone || '',
                    address: response.profile?.address || '',
                    dateOfBirth: response.profile?.dateOfBirth ? dayjs(response.profile.dateOfBirth) : null,
                    gender: response.profile?.gender || undefined,
                });
            }
        } catch (error) {
            message.error('Không thể tải thông tin tài khoản');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (values) => {
        setLoading(true);
        try {
            // TODO: Implement update profile API
            message.success('Cập nhật thông tin thành công');
            setEditing(false);
            fetchProfile();
        } catch (error) {
            message.error('Cập nhật thông tin thất bại');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa cập nhật';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>
                    <UserOutlined />
                    Thông tin tài khoản
                </h1>
                <p>Quản lý thông tin cá nhân của bạn</p>
            </div>

            <Row gutter={[24, 24]}>
                {/* Avatar và Basic Info */}
                <Col xs={24} md={8}>
                    <Card className="profile-card">
                        <div className="avatar-section">
                            <Avatar 
                                size={120} 
                                icon={<UserOutlined />}
                                src={profileData?.profile?.avatar}
                                className="profile-avatar"
                            />
                            <div className="avatar-upload">
                                <Button 
                                    icon={<CameraOutlined />}
                                    size="small"
                                    disabled={!editing}
                                >
                                    Đổi ảnh
                                </Button>
                            </div>
                            <h2 className="profile-name">{profileData?.name || 'Chưa có tên'}</h2>
                            <Tag color={profileData?.role === 'Admin' ? 'red' : 'blue'}>
                                {profileData?.role || 'User'}
                            </Tag>
                        </div>
                    </Card>
                </Col>

                {/* Profile Form */}
                <Col xs={24} md={16}>
                    <Card 
                        className="profile-card"
                        title={
                            <div className="card-title">
                                <span>Thông tin cá nhân</span>
                                {!editing && (
                                    <Button 
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={() => setEditing(true)}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                )}
                            </div>
                        }
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSave}
                            disabled={!editing}
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Họ và tên"
                                        name="name"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                    >
                                        <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                    >
                                        <Input 
                                            prefix={<MailOutlined />} 
                                            disabled 
                                            placeholder="Email"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Số điện thoại"
                                        name="phone"
                                    >
                                        <Input 
                                            prefix={<PhoneOutlined />} 
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Giới tính"
                                        name="gender"
                                    >
                                        <Select placeholder="Chọn giới tính">
                                            <Option value="Male">Nam</Option>
                                            <Option value="Female">Nữ</Option>
                                            <Option value="Other">Khác</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Ngày sinh"
                                name="dateOfBirth"
                            >
                                <DatePicker 
                                    style={{ width: '100%' }}
                                    placeholder="Chọn ngày sinh"
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                            >
                                <TextArea 
                                    rows={3}
                                    prefix={<EnvironmentOutlined />}
                                    placeholder="Nhập địa chỉ"
                                />
                            </Form.Item>

                            {editing && (
                                <Form.Item>
                                    <Space>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit"
                                            icon={<SaveOutlined />}
                                            loading={loading}
                                        >
                                            Lưu thay đổi
                                        </Button>
                                        <Button onClick={() => {
                                            setEditing(false);
                                            fetchProfile();
                                        }}>
                                            Hủy
                                        </Button>
                                    </Space>
                                </Form.Item>
                            )}
                        </Form>
                    </Card>

                    {/* Account Info */}
                    <Card className="profile-card" title="Thông tin tài khoản">
                        <div className="info-list">
                            <div className="info-item">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{profileData?.email || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Vai trò:</span>
                                <Tag color={profileData?.role === 'Admin' ? 'red' : 'blue'}>
                                    {profileData?.role || 'User'}
                                </Tag>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Ngày tạo:</span>
                                <span className="info-value">
                                    {profileData?.createdAt ? formatDate(profileData.createdAt) : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage;

