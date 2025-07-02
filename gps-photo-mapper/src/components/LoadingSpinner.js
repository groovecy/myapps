import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <span>GPS 정보를 분석중입니다...</span>
    </div>
  );
};

export default LoadingSpinner;