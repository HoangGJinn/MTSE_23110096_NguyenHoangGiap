import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Pagination, Spin, Empty, Image, Tag, Button, App } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { getFavoritesAPI } from '../util/api';
import { ADD_TO_CART, GET_CART } from '../graphql/cartQueries';
import { AuthContext } from '../components/context/auth.context';
import './favorites.css';

const { Meta } = Card;

const FavoritesPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0
    });

    // GraphQL mutation để thêm vào giỏ hàng
    const [addToCartMutation] = useMutation(ADD_TO_CART, {
        refetchQueries: [{ query: GET_CART }],
        onCompleted: (data) => {
            if (data?.addToCart?.success) {
                message.success(data.addToCart.message || 'Đã thêm sản phẩm vào giỏ hàng');
            } else {
                message.error(data?.addToCart?.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng');
            }
        },
        onError: (error) => {
            message.error(error.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng');
        }
    });

    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchFavorites();
        }
    }, [auth.isAuthenticated, pagination.current]);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const response = await getFavoritesAPI(pagination.current, pagination.pageSize);
            // Axios interceptor đã unwrap response.data
            if (response && response.EC === 0 && response.data) {
                setFavorites(response.data.favorites || []);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.totalFavorites || 0
                }));
            } else {
                message.error(response?.EM || 'Lỗi khi tải danh sách yêu thích');
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
            message.error('Lỗi khi tải danh sách yêu thích');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };

    const handleViewProduct = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = async (product) => {
        if (!auth.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            return;
        }

        if (!product || product.stock === 0) {
            message.warning('Sản phẩm đã hết hàng');
            return;
        }

        try {
            await addToCartMutation({
                variables: {
                    productId: parseInt(product.id),
                    quantity: 1
                }
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            if (!error.graphQLErrors) {
                message.error(error.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng');
            }
        }
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, current: page }));
    };

    if (!auth.isAuthenticated) {
        return (
            <div className="favorites-page">
                <div className="favorites-container">
                    <Empty 
                        description="Vui lòng đăng nhập để xem sản phẩm yêu thích"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="favorites-page">
                <div className="favorites-container">
                    <div className="favorites-loading">
                        <Spin size="large" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-page">
            <div className="favorites-container">
                <div className="favorites-header">
                    <h1 className="favorites-title">
                        <HeartFilled style={{ color: '#ff4d4f', marginRight: '10px' }} />
                        Sản phẩm yêu thích
                    </h1>
                    <p className="favorites-subtitle">
                        Bạn có {pagination.total} sản phẩm trong danh sách yêu thích
                    </p>
                </div>

                {favorites.length > 0 ? (
                    <>
                        <Row gutter={[16, 16]} className="favorites-grid">
                            {favorites.map((product) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                    <Card
                                        hoverable
                                        className="favorite-product-card"
                                        cover={
                                            <div 
                                                className="product-image-container"
                                                onClick={() => handleViewProduct(product.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <Image
                                                    alt={product.name}
                                                    src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                                    fallback="https://via.placeholder.com/300x200?text=No+Image"
                                                    preview={false}
                                                    className="product-image"
                                                />
                                                {product.stock === 0 && (
                                                    <div className="out-of-stock-badge">
                                                        Hết hàng
                                                    </div>
                                                )}
                                            </div>
                                        }
                                        actions={[
                                            <Button
                                                type="text"
                                                icon={<EyeOutlined />}
                                                onClick={() => handleViewProduct(product.id)}
                                            >
                                                Xem
                                            </Button>,
                                            <Button
                                                type="text"
                                                icon={<ShoppingCartOutlined />}
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.stock === 0}
                                            >
                                                Thêm
                                            </Button>
                                        ]}
                                    >
                                        <Meta
                                            title={
                                                <div className="product-title">
                                                    {product.name}
                                                </div>
                                            }
                                            description={
                                                <div className="product-info">
                                                    <div className="product-category">
                                                        <Tag color="blue" style={{ fontSize: '0.7rem', margin: 0, padding: '2px 6px' }}>
                                                            {product.category?.name || 'Chưa phân loại'}
                                                        </Tag>
                                                    </div>
                                                    <div className="product-description">
                                                        {product.description || 'Không có mô tả'}
                                                    </div>
                                                    <div className="product-price-section">
                                                        <span className="product-price">
                                                            {formatPrice(product.price)}
                                                        </span>
                                                        {product.stock > 0 && (
                                                            <span className="product-stock">
                                                                Còn {product.stock}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Pagination */}
                        {pagination.total > pagination.pageSize && (
                            <div className="pagination-container">
                                <Pagination
                                    current={pagination.current}
                                    total={pagination.total}
                                    pageSize={pagination.pageSize}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    showTotal={(total) => `Tổng ${total} sản phẩm`}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-container">
                        <Empty
                            description="Bạn chưa có sản phẩm yêu thích nào"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;

