import React from 'react';

const Button = ({ children, onClick, variant = 'primary', ...props }) => {
  const style = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: variant === 'danger' ? '#ff4d4f' : '#1890ff',
    color: '#fff',
    ...props.style // Cho phép override style nếu cần
  };
  return <button style={style} onClick={onClick} {...props}>{children}</button>;
};
export default Button;