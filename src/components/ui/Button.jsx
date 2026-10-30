import React from 'react';
import './Button.css';

const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  return (
    <button 
      className={`investigation-btn ${variant} ${className}`}
      onClick={onClick}
    >
      <span className="btn-content">{children}</span>
      <span className="btn-glitch"></span>
    </button>
  );
};

export default Button;
