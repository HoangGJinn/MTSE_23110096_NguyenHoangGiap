import React from 'react';
import Button from './Button';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
      <img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover' }} />
      <div style={{ flex: 1 }}>
        <h4>{item.name}</h4>
        <p>${item.price}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={handleDecrease}
          disabled={item.quantity <= 1}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            border: '1px solid #d9d9d9',
            backgroundColor: item.quantity <= 1 ? '#f5f5f5' : '#fff',
            color: item.quantity <= 1 ? '#bfbfbf' : '#333',
            cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (item.quantity > 1) {
              e.target.style.backgroundColor = '#f0f0f0';
            }
          }}
          onMouseLeave={(e) => {
            if (item.quantity > 1) {
              e.target.style.backgroundColor = '#fff';
            }
          }}
        >
          −
        </button>
        <span
          style={{
            minWidth: '40px',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: '500',
            padding: '0 8px'
          }}
        >
          {item.quantity}
        </span>
        <button
          onClick={handleIncrease}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            border: '1px solid #d9d9d9',
            backgroundColor: '#fff',
            color: '#333',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#fff';
          }}
        >
          +
        </button>
      </div>
      <Button variant="danger" onClick={() => onRemove(item.id)}>Xóa</Button>
    </div>
  );
};
export default CartItem;