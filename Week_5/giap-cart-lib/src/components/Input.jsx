import React from 'react';

const Input = ({ value, onChange, type = "text", ...props }) => {
  const style = {
    padding: '8px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box'
  };
  return <input type={type} value={value} onChange={onChange} style={style} {...props} />;
};
export default Input;