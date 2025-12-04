import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '80vh',
            padding: '2rem'
        }}>
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
                extra={[
                    <Button 
                        type="primary" 
                        icon={<HomeOutlined />}
                        onClick={() => navigate('/')}
                        size="large"
                    >
                        Về trang chủ
                    </Button>,
                ]}
            />
        </div>
    );
};

export default NotFound;

