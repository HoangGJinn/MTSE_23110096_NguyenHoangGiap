import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Spin, Empty, Image, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getViewedProductsAPI } from '../../util/api';
import { AuthContext } from '../context/auth.context';
import './RecentlyViewed.css';

const { Title, Text } = Typography;

const RecentlyViewed = ({ limit = 6 }) => {
    const { auth } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchViewedProducts();
        } else {
            setLoading(false);
            setProducts([]);
        }
    }, [auth.isAuthenticated]);

    const fetchViewedProducts = async () => {
        try {
            const response = await getViewedProductsAPI(limit);
            // Axios interceptor đã unwrap response.data
            if (response && response.EC === 0 && response.data) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching viewed products:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };

    if (!auth.isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <div className="recently-viewed-container">
                <Spin size="large" />
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="recently-viewed-container">
            <Title level={3} className="recently-viewed-title">
                Sản phẩm đã xem
            </Title>
            <Row gutter={[16, 16]}>
                {products.map((product) => (
                    <Col xs={12} sm={8} md={6} lg={4} key={product.id}>
                        <Card
                            hoverable
                            className="recently-viewed-card"
                            cover={
                                <Image
                                    src={product.image || 'https://via.placeholder.com/200x200?text=No+Image'}
                                    alt={product.name}
                                    fallback="https://via.placeholder.com/200x200?text=No+Image"
                                    preview={false}
                                    style={{ height: 180, objectFit: 'cover' }}
                                />
                            }
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            <Card.Meta
                                title={
                                    <Text ellipsis={{ tooltip: product.name }}>
                                        {product.name}
                                    </Text>
                                }
                                description={
                                    <Text strong style={{ color: '#1890ff', fontSize: '14px' }}>
                                        {formatPrice(product.price)}
                                    </Text>
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default RecentlyViewed;

