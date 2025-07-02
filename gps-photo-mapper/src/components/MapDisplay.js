import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import './MapDisplay.css';

// Leaflet 기본 아이콘 설정
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapDisplay = ({ photos }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!photos || photos.length === 0) return;

    // 기존 지도 제거
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // 새 지도 생성
    const map = L.map(mapRef.current);
    mapInstanceRef.current = map;

    // 타일 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // 마커 추가
    const markers = [];
    photos.forEach((photo, index) => {
      const marker = L.marker([photo.latitude, photo.longitude])
        .addTo(map)
        .bindPopup(`
          <div class="popup-content">
            <img src="${photo.imageSrc}" alt="${photo.name}" style="max-width: 200px; max-height: 150px; border-radius: 5px; margin-bottom: 10px;" />
            <h3>${photo.name}</h3>
            <p><strong>위치:</strong> ${photo.latitude.toFixed(6)}, ${photo.longitude.toFixed(6)}</p>
            <p><strong>촬영일:</strong> ${photo.dateTime}</p>
            <p><strong>카메라:</strong> ${photo.camera} ${photo.model}</p>
          </div>
        `);
      
      markers.push(marker);
    });

    // 지도 범위 설정
    if (photos.length === 1) {
      map.setView([photos[0].latitude, photos[0].longitude], 15);
    } else {
      const group = new L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    // 정리 함수
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [photos]);

  return (
    <div className="map-container">
      <div ref={mapRef} className="map"></div>
    </div>
  );
};

export default MapDisplay;