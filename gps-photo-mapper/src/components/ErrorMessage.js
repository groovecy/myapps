import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3>오류가 발생했습니다</h3>
        <pre>{message}</pre>
      </div>
    </div>
  );
};

export default ErrorMessage;