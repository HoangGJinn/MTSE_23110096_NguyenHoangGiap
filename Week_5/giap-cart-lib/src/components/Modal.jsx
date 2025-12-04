import React from 'react';

const Modal = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;
  
  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
  };
  const modalStyle = {
    backgroundColor: '#fff', padding: '20px', borderRadius: '8px', minWidth: '300px'
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>{title}</h3>
        <div>{children}</div>
        <div style={{marginTop: '20px', textAlign: 'right'}}>
            <button onClick={onClose}>Close</button>    
        </div>
      </div>
    </div>
  );
};
export default Modal;