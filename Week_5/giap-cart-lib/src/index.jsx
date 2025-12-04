import React, { useState } from 'react';
import CartItem from './components/CartItem';
import Modal from './components/Modal';
import Button from './components/Button';

// Export lẻ các components nếu người dùng muốn tự custom
export { Button, Modal, CartItem } from './components';
export { default as Input } from './components/Input';

// Component chính: CartWidget
export const CartWidget = ({ items, onUpdateCart, onDeleteItem }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleDeleteRequest = (id) => {
    setItemToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    onDeleteItem(itemToDelete);
    setModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Giỏ hàng của bạn</h2>
      {items.length === 0 ? <p>Giỏ hàng trống</p> : (
        <div>
          {items.map(item => (
            <CartItem 
              key={item.id} 
              item={item} 
              onUpdateQuantity={onUpdateCart}
              onRemove={handleDeleteRequest}
            />
          ))}
          <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
            Tổng cộng: ${total}
          </div>
          <Button style={{ marginTop: '10px', width: '100%' }}>Thanh toán</Button>
        </div>
      )}

      {/* Modal Xác nhận xóa */}
      <Modal 
        isOpen={isModalOpen} 
        title="Xác nhận xóa" 
        onClose={() => setModalOpen(false)}
      >
        <p>Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?</p>
        <Button variant="danger" onClick={confirmDelete}>Xóa ngay</Button>
      </Modal>
    </div>
  );
};