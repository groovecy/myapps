import React from 'react';
import './PhotoUploader.css';

const PhotoUploader = ({ onFilesSelected, fileInputRef }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    onFilesSelected(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileInput = (e) => {
    onFilesSelected(e.target.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-section">
      <div 
        className="upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <span className="upload-icon">📷</span>
        <div className="upload-text">사진을 선택하거나 드래그하세요</div>
        <div className="upload-subtext">GPS 정보가 포함된 JPEG 파일을 지원합니다</div>
        <div className="upload-subtext">여러 파일을 동시에 선택할 수 있습니다</div>
      </div>
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/*" 
        multiple 
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default PhotoUploader;