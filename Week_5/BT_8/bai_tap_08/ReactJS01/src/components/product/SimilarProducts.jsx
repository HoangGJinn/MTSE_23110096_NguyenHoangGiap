import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Empty, Image, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getSimilarProductsAPI } from '../../util/api';
import './SimilarProducts.css';

const { Title, Text } = Typography;

const SimilarProducts = ({ productId, limit = 4 }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSimilarProducts();
    }, [productId]);

    const fetchSimilarProducts = async () => {
        try {
            const response = await getSimilarProductsAPI(productId, limit);
            if (response && response.data && response.data.EC === 0) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching similar products:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };

    if (loading) {
        return (
            <div className="similar-products-container">
                <Spin size="large" />
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="similar-products-container">
            <Title level={3} className="similar-products-title">
                Sản phẩm tương tự
            </Title>
            <Row gutter={[16, 16]}>
                {products.map((product) => (
                    <Col xs={12} sm={8} md={6} key={product.id}>
                        <Card
                            hoverable
                            className="similar-product-card"
                            cover={
                                <Image
                                    src={product.image || 'https://via.placeholder.com/200x200?text=No+Image'}
                                    alt={product.name}
                                    fallback="https://via.placeholder.com/200x200?text=No+Image"
                                    preview={false}
                                    style={{ height: 200, objectFit: 'cover' }}
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
                                    <div>
                                        <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                                            {formatPrice(product.price)}
                                        </Text>
                                        {product.stock === 0 && (
                                            <div>
                                                <Text type="danger">Hết hàng</Text>
                                            </div>
                                        )}
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default SimilarProducts;

