import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Image, Tag, Button, App, Descriptions, Empty } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client/react';
import { getProductDetailWithStatsAPI, addToViewedAPI, getProductByIdAPI } from '../util/api';
import { ADD_TO_CART, GET_CART } from '../graphql/cartQueries';
import { AuthContext } from '../components/context/auth.context';
import FavoriteButton from '../components/favorite/FavoriteButton';
import ProductStats from '../components/product/ProductStats';
import SimilarProducts from '../components/product/SimilarProducts';
import Comments from '../components/comment/Comments';
import './product-detail.css';

const ProductDetailPage = () => {
    const { message } = App.useApp(); // Sử dụng hook để lấy message API
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

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
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            // Nếu đã đăng nhập, dùng API có stats và similar products
            if (auth.isAuthenticated) {
                try {
                    const response = await getProductDetailWithStatsAPI(id);
                    
                    if (response && response.data && response.data.EC === 0 && response.data.data) {
                        setProduct(response.data.data.product);
                        
                        // Track viewed product
                        try {
                            await addToViewedAPI(id);
                        } catch (error) {
                            console.error('Error tracking viewed product:', error);
                        }
                    } else {
                        const errorMsg = response?.data?.EM || response?.data?.message || 'Không tìm thấy sản phẩm';
                        console.error('API Error:', response?.data);
                        message.error(errorMsg);
                        navigate('/');
                    }
                } catch (apiError) {
                    // Nếu API yêu cầu auth bị lỗi (401, 403), fallback về API public
                    if (apiError.response?.status === 401 || apiError.response?.status === 403) {
                        console.log('Auth error, falling back to public API');
                        const response = await getProductByIdAPI(id);
                        
                        if (response && response.data && response.data.EC === 0 && response.data.data) {
                            setProduct(response.data.data);
                        } else {
                            message.error(response?.data?.EM || 'Không tìm thấy sản phẩm');
                            navigate('/');
                        }
                    } else {
                        throw apiError;
                    }
                }
            } else {
                // Nếu chưa đăng nhập, dùng API cũ
                const response = await getProductByIdAPI(id);
                
                if (response && response.data && response.data.EC === 0 && response.data.data) {
                    setProduct(response.data.data);
                } else {
                    message.error(response?.data?.EM || 'Không tìm thấy sản phẩm');
                    navigate('/');
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            console.error('Error details:', error.response?.data || error.message);
            
            if (error.response?.status === 404) {
                message.error('Sản phẩm không tồn tại');
            } else if (error.response?.status === 401 || error.response?.status === 403) {
                message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            } else {
                message.error('Lỗi khi tải thông tin sản phẩm: ' + (error.message || 'Unknown error'));
            }
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };

    const handleAddToCart = async () => {
        if (!auth.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            return;
        }

        if (!product || product.stock === 0) {
            message.warning('Sản phẩm đã hết hàng');
            return;
        }

        if (quantity > product.stock) {
            message.warning(`Chỉ còn ${product.stock} sản phẩm trong kho`);
            return;
        }

        try {
            console.log('Adding product to cart:', product.id, 'quantity:', quantity);
            await addToCartMutation({
                variables: {
                    productId: parseInt(product.id),
                    quantity: quantity
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

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return (
            <div className="product-detail-page">
                <div className="product-detail-loading">
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-page">
                <div className="product-detail-container">
                    <Empty description="Không tìm thấy sản phẩm" />
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <div className="product-detail-container">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: 20 }}
                >
                    Quay lại
                </Button>

                <div className="product-detail-content">
                    {/* Product Image */}
                    <div className="product-detail-image">
                        <Image
                            src={product.image || 'https://via.placeholder.com/600x400?text=No+Image'}
                            alt={product.name}
                            fallback="https://via.placeholder.com/600x400?text=No+Image"
                            preview={true}
                            style={{ width: '100%', borderRadius: '8px' }}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="product-detail-info">
                        <h1 className="product-detail-title">{product.name}</h1>

                        <div className="product-detail-category">
                            <Tag color="blue" style={{ fontSize: '1rem', padding: '4px 12px' }}>
                                {product.category?.name || 'Chưa phân loại'}
                            </Tag>
                        </div>

                        <div className="product-detail-price">
                            <span className="price-label">Giá:</span>
                            <span className="price-value">{formatPrice(product.price)}</span>
                        </div>

                        <div className="product-detail-stock">
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Tình trạng">
                                    {product.stock > 0 ? (
                                        <Tag color="green">Còn hàng ({product.stock} sản phẩm)</Tag>
                                    ) : (
                                        <Tag color="red">Hết hàng</Tag>
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="Mô tả">
                                    {product.description || 'Không có mô tả'}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>

                        {product.stock > 0 && (
                            <div style={{ marginBottom: 20 }}>
                                <span style={{ marginRight: 10 }}>Số lượng:</span>
                                <Button
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </Button>
                                <span style={{ margin: '0 15px', fontSize: '16px', fontWeight: 600 }}>
                                    {quantity}
                                </span>
                                <Button
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.stock}
                                >
                                    +
                                </Button>
                            </div>
                        )}

                        <div className="product-detail-actions">
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ShoppingCartOutlined />}
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    style={{ flex: 1, height: '50px', fontSize: '16px' }}
                                >
                                    {product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                                </Button>
                                <FavoriteButton productId={product.id} size="large" />
                            </div>
                        </div>
                        
                        {/* Product Stats */}
                        <ProductStats productId={product.id} />
                    </div>
                </div>

                {/* Similar Products */}
                <SimilarProducts productId={product.id} />

                {/* Comments Section */}
                <Comments productId={product.id} />
            </div>
        </div>
    );
};

export default ProductDetailPage;

