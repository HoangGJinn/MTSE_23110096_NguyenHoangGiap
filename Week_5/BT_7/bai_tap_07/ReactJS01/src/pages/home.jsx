import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Pagination, Spin, Empty, Image, Tag, Button, App } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { getProductsAPI } from '../util/api';
import { ADD_TO_CART, GET_CART } from '../graphql/cartQueries';
import { AuthContext } from '../components/context/auth.context';
import Banner from '../components/banner/Banner';
import './home.css';
import '../styles/global.css';

const { Meta } = Card;

const HomePage = () => {
    const { message } = App.useApp(); // Sử dụng hook để lấy message API
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0
    });

    const categoryId = searchParams.get('category');
    const search = searchParams.get('search');

    // GraphQL mutation để thêm vào giỏ hàng
    const [addToCartMutation] = useMutation(ADD_TO_CART, {
        refetchQueries: [{ query: GET_CART }], // Tự động refetch cart sau khi thêm
        onCompleted: (data) => {
            console.log('onCompleted called:', data);
            if (data?.addToCart?.success) {
                message.success(data.addToCart.message || 'Đã thêm sản phẩm vào giỏ hàng');
            } else {
                message.error(data?.addToCart?.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng');
            }
        },
        onError: (error) => {
            console.error('onError called:', error);
            message.error(error.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng');
        }
    });

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId, pagination.current, search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const parsedCategoryId = categoryId ? parseInt(categoryId) : null;
            const searchQuery = search && search.trim() !== '' ? search.trim() : null;
            
            const response = await getProductsAPI(
                pagination.current,
                pagination.pageSize,
                parsedCategoryId,
                searchQuery
            );
            
            if (response && response.EC === 0 && response.data) {
                // Backend đã xử lý fuzzy search, chỉ cần lấy kết quả
                setProducts(response.data.products || []);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.totalProducts || 0
                }));
            } else {
                setProducts([]);
                setPagination(prev => ({
                    ...prev,
                    total: 0
                }));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setPagination(prev => ({
                ...prev,
                total: 0
            }));
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, current: page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };

    const handleAddToCart = async (product) => {
        if (!auth.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            return;
        }

        if (product.stock === 0) {
            message.warning('Sản phẩm đã hết hàng');
            return;
        }

        try {
            console.log('Adding product to cart:', product.id);
            await addToCartMutation({
                variables: {
                    productId: parseInt(product.id),
                    quantity: 1
                }
            });
            // Không cần hiển thị message ở đây vì onCompleted đã xử lý
        } catch (error) {
            console.error('Error adding to cart:', error);
            // onError đã xử lý message, nhưng nếu onError không được gọi thì hiển thị ở đây
            if (!error.graphQLErrors) {
                message.error(error.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng');
            }
        }
    };

    const handleViewProduct = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="home-page">
            {/* Promotional Banner */}
            {!search && !categoryId && <Banner />}
            
            {/* Page Info - Small line at top */}
            <div className="page-info-bar">
                {search ? (
                    <span>Kết quả tìm kiếm: <strong>"{search}"</strong></span>
                ) : (
                    <span>Tìm thấy <strong>{pagination.total}</strong> sản phẩm</span>
                )}
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
                <>
                    <Row gutter={[16, 16]} className="products-grid">
                        {products.map((product) => (
                            <Col xs={24} sm={12} md={8} lg={8} xl={6} key={product.id}>
                                <Card
                                    hoverable
                                    className="product-card"
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
                        description={
                            <span>
                                {search 
                                    ? `Không tìm thấy sản phẩm nào với từ khóa "${search}"`
                                    : 'Không có sản phẩm nào'}
                            </span>
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default HomePage;
