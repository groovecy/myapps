import React, { useState, useRef } from 'react';
import EXIF from 'exif-js';
import PhotoUploader from './components/PhotoUploader';
import MapDisplay from './components/MapDisplay';
import PhotoInfo from './components/PhotoInfo';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import PhotoModal from './components/PhotoModal';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef();

  const convertDMSToDD = (dms, ref) => {
    let dd = dms[0] + dms[1] / 60 + dms[2] / 3600;
    if (ref === 'S' || ref === 'W') {
      dd = dd * -1;
    }
    return dd;
  };

  const processImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        EXIF.getData(file, function() {
          const lat = EXIF.getTag(this, 'GPSLatitude');
          const lon = EXIF.getTag(this, 'GPSLongitude');
          const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
          const lonRef = EXIF.getTag(this, 'GPSLongitudeRef');
          const dateTime = EXIF.getTag(this, 'DateTime');
          const camera = EXIF.getTag(this, 'Make');
          const model = EXIF.getTag(this, 'Model');

          if (lat && lon) {
            const latitude = convertDMSToDD(lat, latRef);
            const longitude = convertDMSToDD(lon, lonRef);
            
            resolve({
              id: Date.now() + Math.random(),
              name: file.name,
              latitude,
              longitude,
              imageSrc: e.target.result,
              dateTime: dateTime || '알 수 없음',
              camera: camera || '알 수 없음',
              model: model || '알 수 없음',
              size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
            });
          } else {
            reject(new Error(`${file.name}: GPS 정보가 없습니다.`));
          }
        });
      };
      
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files) => {
    setLoading(true);
    setError(null);
    setPhotos([]);
    
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('이미지 파일을 선택해주세요.');
      setLoading(false);
      return;
    }

    const processedPhotos = [];
    const errors = [];

    for (const file of imageFiles) {
      try {
        const photoData = await processImage(file);
        processedPhotos.push(photoData);
      } catch (error) {
        errors.push(error.message);
      }
    }

    setLoading(false);

    if (processedPhotos.length > 0) {
      setPhotos(processedPhotos);
      setShowMap(true);
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    if (processedPhotos.length === 0 && errors.length > 0) {
      setShowMap(false);
    }
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const resetApp = () => {
    setPhotos([]);
    setError(null);
    setShowMap(false);
    setSelectedPhoto(null);
    setIsModalOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>📍 GPS 사진 위치 지도</h1>
          <p>사진의 GPS 정보를 추출하여 지도에 표시합니다</p>
        </div>

        {loading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} />}

        {!showMap && !loading && (
          <PhotoUploader 
            onFilesSelected={handleFiles} 
            fileInputRef={fileInputRef}
          />
        )}

        {showMap && photos.length > 0 && (
          <div className="map-section">
            <PhotoInfo photos={photos} onPhotoClick={handlePhotoClick} />
            <MapDisplay photos={photos} />
            <button className="reset-btn" onClick={resetApp}>
              다른 사진 선택
            </button>
          </div>
        )}

        <PhotoModal 
          photo={selectedPhoto}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      </div>
    </div>
  );
}

export default App;