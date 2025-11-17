import { CrownOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';

const HomePage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    return (
        <div style={{ padding: 20 }}>
            <Result
                icon={<CrownOutlined />}
                title="JSON Web Token (React/Node.JS) - hoanggiap.vn"
                extra={
                    !auth.isAuthenticated && [
                        <Button type="primary" key="login" onClick={() => navigate('/login')}>
                            Đăng nhập
                        </Button>,
                        <Button key="register" onClick={() => navigate('/register')}>
                            Đăng ký
                        </Button>,
                    ]
                }
            />
        </div>
    )
}

export default HomePage;
