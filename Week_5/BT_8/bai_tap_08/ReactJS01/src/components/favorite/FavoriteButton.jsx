import React, { useState, useEffect, useContext } from 'react';
import { Button, App } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { toggleFavoriteAPI, checkFavoriteAPI } from '../../util/api';
import { AuthContext } from '../context/auth.context';
import './FavoriteButton.css';

const FavoriteButton = ({ productId, size = 'default' }) => {
    const { message } = App.useApp();
    const { auth } = useContext(AuthContext);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth.isAuthenticated && productId) {
            checkFavorite();
        }
    }, [auth.isAuthenticated, productId]);

    const checkFavorite = async () => {
        try {
            const response = await checkFavoriteAPI(productId);
            // Axios interceptor đã unwrap response.data
            if (response && response.EC === 0 && response.data) {
                setIsFavorite(response.data.isFavorite);
            }
        } catch (error) {
            console.error('Error checking favorite:', error);
        }
    };

    const handleToggleFavorite = async () => {
        if (!auth.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để sử dụng tính năng yêu thích');
            return;
        }

        setLoading(true);
        try {
            const response = await toggleFavoriteAPI(productId);
            // Axios interceptor đã unwrap response.data
            if (response && response.EC === 0 && response.data) {
                setIsFavorite(response.data.isFavorite);
                message.success(response.EM || 'Thành công');
            } else {
                message.error(response?.EM || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            message.error('Có lỗi xảy ra khi cập nhật yêu thích');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            type={isFavorite ? 'primary' : 'default'}
            icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
            onClick={handleToggleFavorite}
            loading={loading}
            size={size}
            className="favorite-button"
        >
            {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
        </Button>
    );
};

export default FavoriteButton;

