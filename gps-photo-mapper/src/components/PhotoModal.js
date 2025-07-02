import React, { useEffect } from 'react';
import './PhotoModal.css';

const PhotoModal = ({ photo, isOpen, onClose }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !photo) return null;

  return (
    <div className="photo-modal-backdrop" onClick={handleBackdropClick}>
      <div className="photo-modal">
        <button className="photo-modal-close" onClick={onClose}>
          ×
        </button>
        <div className="photo-modal-content">
          <div className="photo-modal-image">
            <img src={photo.imageSrc} alt={photo.name} />
          </div>
          <div className="photo-modal-info">
            <h3>{photo.name}</h3>
            <div className="photo-modal-details">
              <div className="detail-item">
                <span className="detail-label">위치</span>
                <span className="detail-value">{photo.latitude.toFixed(6)}, {photo.longitude.toFixed(6)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">촬영일</span>
                <span className="detail-value">{photo.dateTime}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">카메라</span>
                <span className="detail-value">{photo.camera} {photo.model}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">파일 크기</span>
                <span className="detail-value">{photo.size}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;