import React from 'react';
import './PhotoInfo.css';

const PhotoInfo = ({ photos, onPhotoClick }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="photo-info">
      <h2>📸 사진 정보 ({photos.length}개)</h2>
      
      {photos.length === 1 ? (
        <div className="single-photo-info">
          <div className="photo-preview">
            <img 
              src={photos[0].imageSrc} 
              alt={photos[0].name}
              onClick={() => onPhotoClick(photos[0])}
            />
          </div>
          <div className="info-grid">
            <div className="info-item">
              <h3>📁 파일명</h3>
              <p>{photos[0].name}</p>
            </div>
            <div className="info-item">
              <h3>📍 위치</h3>
              <p>{photos[0].latitude.toFixed(6)}, {photos[0].longitude.toFixed(6)}</p>
            </div>
            <div className="info-item">
              <h3>📅 촬영일</h3>
              <p>{photos[0].dateTime}</p>
            </div>
            <div className="info-item">
              <h3>📷 카메라</h3>
              <p>{photos[0].camera} {photos[0].model}</p>
            </div>
            <div className="info-item">
              <h3>💾 파일 크기</h3>
              <p>{photos[0].size}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="multiple-photos-info">
          <div className="photos-grid">
            {photos.map((photo, index) => (
              <div key={photo.id} className="photo-card">
                <div className="photo-thumbnail">
                  <img 
                    src={photo.imageSrc} 
                    alt={photo.name}
                    onClick={() => onPhotoClick(photo)}
                  />
                </div>
                <div className="photo-details">
                  <h4>{photo.name}</h4>
                  <p><strong>위치:</strong> {photo.latitude.toFixed(4)}, {photo.longitude.toFixed(4)}</p>
                  <p><strong>크기:</strong> {photo.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoInfo;