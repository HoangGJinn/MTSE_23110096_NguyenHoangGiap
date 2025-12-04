import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { message, Checkbox, Button as AntButton, Space, Row, Col, Card, Statistic, Divider, Typography, Empty, Tag, App } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { CartWidget } from 'giap-cart-lib';
import { AuthContext } from '../components/context/auth.context';
import { GET_CART, ADD_TO_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART, TOGGLE_SELECT_CART_ITEM, CHECKOUT } from '../graphql/cartQueries';
import './cart.css';

const { Title, Text } = Typography;

const CartPage = () => {
  const { message } = App.useApp();
  const { auth } = useContext(AuthContext);

  const { data, loading, error, refetch } = useQuery(GET_CART, {
    skip: !auth.isAuthenticated,
    fetchPolicy: 'cache-first', // Ưu tiên cache, chỉ fetch khi cache không có
    nextFetchPolicy: 'cache-first', // Sau lần fetch đầu tiên, luôn dùng cache trước
    notifyOnNetworkStatusChange: false, // Không hiển thị loading khi refetch
    onError: (err) => !err.message.includes('đăng nhập') && message.error('Lỗi tải giỏ hàng')
  });

  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM, { 
    onCompleted: () => {
      refetch({ fetchPolicy: 'network-only' }); // Chỉ refetch khi cần cập nhật
    }
  });
  
  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART, { 
    onCompleted: () => { 
      refetch({ fetchPolicy: 'network-only' });
      message.success('Đã xóa sản phẩm'); 
    } 
  });
  
  const [toggleSelectMutation] = useMutation(TOGGLE_SELECT_CART_ITEM, { 
    onCompleted: () => {
      refetch({ fetchPolicy: 'network-only' });
    }
  });
  
  const [checkoutMutation] = useMutation(CHECKOUT, {
    onCompleted: (data) => {
      if (data.checkout.success) {
        message.success(data.checkout.message);
        refetch({ fetchPolicy: 'network-only' });
      } else {
        message.error(data.checkout.message);
      }
    }
  });

  // --- Data Formatting ---
  const formatCartItems = (cart) => {
    if (!cart || !cart.items) return [];
    return cart.items.map(item => ({
      id: item.id,
      name: item.product.name,
      price: parseFloat(item.product.price),
      quantity: item.quantity,
      image: item.product.image || 'https://placehold.co/100', // Fallback image đẹp hơn
      selected: item.selected,
      cartItemId: item.id
    }));
  };

  const cartItems = useMemo(() => data?.getCart ? formatCartItems(data.getCart) : [], [data]);

  // --- Calculations ---
  const selectedItems = cartItems.filter(item => item.selected);
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
  const someSelected = cartItems.some(item => item.selected);

  // Format giá tiền VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  // Chọn tất cả / Bỏ chọn tất cả
  const handleSelectAll = (checked) => {
    cartItems.forEach(item => {
      if (item.selected !== checked) {
        handleToggleSelect(item.id, checked);
      }
    });
  };

  // --- Handlers ---
  const handleUpdateCart = (itemId, quantity) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) updateCartItemMutation({ variables: { cartItemId: parseInt(item.cartItemId), quantity: parseInt(quantity) } });
  };

  const handleDeleteItem = (itemId) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) removeFromCartMutation({ variables: { cartItemId: parseInt(item.cartItemId) } });
  };

  const handleToggleSelect = (itemId, selected) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) toggleSelectMutation({ variables: { cartItemId: parseInt(item.cartItemId), selected } });
  };

  const handleCheckout = () => {
    const selectedIds = selectedItems.map(item => parseInt(item.cartItemId));
    if (selectedIds.length === 0) return message.warning('Vui lòng chọn sản phẩm để thanh toán');
    checkoutMutation({ variables: { cartItemIds: selectedIds } });
  };

  // --- Render States ---
  if (!auth.isAuthenticated) return <div className="cart-page-center"><Empty description="Vui lòng đăng nhập để xem giỏ hàng" /></div>;
  if (loading) return <div className="cart-page-center"><div className="loader"></div></div>;
  if (error) return <div className="cart-page-center"><Text type="danger">Lỗi: {error.message}</Text></div>;

  return (
    <div className="cart-page">
      <div className="cart-container">
        <Title level={2} className="cart-title">
          <ShoppingCartOutlined /> Giỏ hàng của bạn
        </Title>
        
        {cartItems.length === 0 ? (
          <Empty description="Giỏ hàng trống" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Row gutter={24}>
            {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM (Sử dụng Library) */}
            <Col xs={24} lg={16}>
              <Card className="cart-list-card" bordered={false}>
                <div className="cart-widget-wrapper">
                  <CartWidget
                    items={cartItems}
                    onUpdateCart={handleUpdateCart}
                    onDeleteItem={handleDeleteItem}
                  />
                </div>
              </Card>
            </Col>

            {/* CỘT PHẢI: THANH TOÁN & SELECT (Sticky) */}
            <Col xs={24} lg={8}>
              <div className="cart-summary-wrapper">
                <Card className="cart-summary-card" title="Thanh toán" bordered={false}>
                  
                  {/* Chọn tất cả */}
                  <div style={{ marginBottom: 12 }}>
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected && !allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    >
                      <Text strong>Chọn tất cả ({cartItems.length} sản phẩm)</Text>
                    </Checkbox>
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  {/* Danh sách chọn (Mini List) */}
                  <div className="select-list">
                    <Text strong style={{ fontSize: '14px' }}>Sản phẩm đã chọn:</Text>
                    <div className="select-items-scroll">
                      {cartItems.map(item => (
                        <div key={item.id} className="select-item-row">
                          <Checkbox 
                            checked={item.selected} 
                            onChange={(e) => handleToggleSelect(item.id, e.target.checked)}
                          >
                            <span className="select-item-name" title={item.name}>{item.name}</span>
                          </Checkbox>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              x{item.quantity}
                            </Text>
                            <Text strong style={{ fontSize: '12px', color: '#1890ff' }}>
                              {formatPrice(item.price * item.quantity)}
                            </Text>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Divider style={{ margin: '15px 0' }} />

                  {/* Tổng tiền */}
                  <div className="summary-total">
                    <Statistic 
                      title={
                        <Text strong>
                          {selectedItems.length > 0 
                            ? `Tổng cộng (${selectedItems.length} sản phẩm):` 
                            : 'Chưa chọn sản phẩm nào'}
                        </Text>
                      }
                      value={totalAmount} 
                      precision={0} 
                      formatter={(value) => formatPrice(value)}
                      valueStyle={{ color: '#3f8600', fontWeight: 'bold', fontSize: '24px' }} 
                    />
                  </div>

                  {/* Nút thanh toán */}
                  <AntButton 
                    type="primary" 
                    size="large" 
                    block 
                    icon={<CheckCircleOutlined />}
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className="checkout-btn"
                  >
                    Mua Hàng
                  </AntButton>

                  {/* Thông tin thêm */}
                  <div style={{ marginTop: 15 }}>
                    <Tag color="blue">Freeship</Tag>
                    <Tag color="green">Voucher giảm giá</Tag>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default CartPage;