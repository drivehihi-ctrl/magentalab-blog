'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PetPlacePOI } from '@/lib/map/types';
import { MapPin, Navigation, List, Map as MapIcon, Coffee, Utensils, Trees, Hospital, Hotel, ExternalLink } from 'lucide-react';

interface PetMapViewerProps {
  places: PetPlacePOI[];
  selectedPlace: PetPlacePOI | null;
  onSelectPlace: (place: PetPlacePOI) => void;
}

declare global {
  interface Window {
    kakao: any;
    L: any;
  }
}

export default function PetMapViewer({
  places,
  selectedPlace,
  onSelectPlace,
}: PetMapViewerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletMarkersRef = useRef<any[]>([]);
  const kakaoMarkersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);

  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [mapEngine, setMapEngine] = useState<'kakao' | 'leaflet'>('leaflet');
  const [isMapReady, setIsMapReady] = useState(false);

  // 1. Dynamic Script Loader (Loads Leaflet & Kakao)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Leaflet (Guaranteed Universal Map Engine - No Domain Restrictions)
    const loadLeaflet = () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (window.L) {
        setIsMapReady(true);
      } else {
        const existingScript = document.getElementById('leaflet-js');
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'leaflet-js';
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.async = true;
          script.onload = () => {
            setIsMapReady(true);
          };
          document.head.appendChild(script);
        } else {
          existingScript.addEventListener('load', () => setIsMapReady(true));
        }
      }
    };

    // Load Kakao Map SDK
    const kakaoApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || '186380c4d2f6974b4c29d1be55963a4a';
    if (!document.getElementById('kakao-map-sdk')) {
      const script = document.createElement('script');
      script.id = 'kakao-map-sdk';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false&libraries=services`;
      script.async = true;
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            setMapEngine('kakao');
          });
        }
      };
      document.head.appendChild(script);
    }

    loadLeaflet();
  }, []);

  // 2. Initialize Leaflet Map (Universal Fallback)
  useEffect(() => {
    if (!isMapReady || !mapContainerRef.current || viewMode !== 'map') return;

    const initialLat = places.length > 0 ? places[0].lat : 37.5665;
    const initialLng = places.length > 0 ? places[0].lng : 126.9780;

    // Use Leaflet if Kakao is not ready/authenticated
    if (mapEngine === 'leaflet' && window.L) {
      const L = window.L;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap | MagentaLab Map',
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;
      map.invalidateSize();

      // Clear existing markers
      leafletMarkersRef.current.forEach((m) => m.remove());
      leafletMarkersRef.current = [];

      const group = L.featureGroup();

      places.forEach((place) => {
        const marker = L.marker([place.lat, place.lng]).addTo(map);
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="font-size: 13px; color: #4c1d95;">${place.name}</strong><br/>
            <span style="font-size: 11px; color: #6b7280;">${place.categoryName} • ${place.operatingHours}</span><br/>
            <span style="font-size: 11px; color: #374151;">${place.address}</span>
          </div>
        `);

        marker.on('click', () => {
          onSelectPlace(place);
          map.setView([place.lat, place.lng], 15);
        });

        group.addLayer(marker);
        leafletMarkersRef.current.push(marker);
      });

      if (places.length > 0) {
        map.fitBounds(group.getBounds().pad(0.2));
      }
    }
    // Use Kakao Maps if ready
    else if (mapEngine === 'kakao' && window.kakao && window.kakao.maps) {
      try {
        if (!mapInstanceRef.current || !mapInstanceRef.current.setCenter) {
          mapContainerRef.current.innerHTML = '';
          const options = {
            center: new window.kakao.maps.LatLng(initialLat, initialLng),
            level: 6,
          };
          const map = new window.kakao.maps.Map(mapContainerRef.current, options);
          mapInstanceRef.current = map;

          const zoomControl = new window.kakao.maps.ZoomControl();
          map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
        }

        const map = mapInstanceRef.current;
        map.relayout();

        kakaoMarkersRef.current.forEach((m) => m.setMap(null));
        kakaoMarkersRef.current = [];

        const bounds = new window.kakao.maps.LatLngBounds();

        places.forEach((place) => {
          const position = new window.kakao.maps.LatLng(place.lat, place.lng);
          bounds.extend(position);

          const marker = new window.kakao.maps.Marker({
            position,
            title: place.name,
          });

          marker.setMap(map);

          window.kakao.maps.event.addListener(marker, 'click', () => {
            onSelectPlace(place);
            map.panTo(position);
          });

          kakaoMarkersRef.current.push(marker);
        });

        if (places.length > 1) {
          map.setBounds(bounds);
        } else if (places.length === 1) {
          map.setCenter(new window.kakao.maps.LatLng(places[0].lat, places[0].lng));
        }
      } catch (err) {
        console.warn('Kakao map fallback to Leaflet:', err);
        setMapEngine('leaflet');
      }
    }
  }, [isMapReady, mapEngine, places, viewMode, onSelectPlace]);

  // 3. Pan to selected place
  useEffect(() => {
    if (!selectedPlace || !mapInstanceRef.current) return;

    if (mapEngine === 'leaflet' && window.L) {
      mapInstanceRef.current.setView([selectedPlace.lat, selectedPlace.lng], 15);
    } else if (mapEngine === 'kakao' && window.kakao && window.kakao.maps) {
      const position = new window.kakao.maps.LatLng(selectedPlace.lat, selectedPlace.lng);
      mapInstanceRef.current.panTo(position);
    }
  }, [selectedPlace, mapEngine]);

  // 4. Request user geolocation & Pan Map
  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          if (mapInstanceRef.current) {
            if (mapEngine === 'leaflet' && window.L) {
              const L = window.L;
              mapInstanceRef.current.setView([lat, lng], 15);

              if (userMarkerRef.current) userMarkerRef.current.remove();
              userMarkerRef.current = L.marker([lat, lng])
                .addTo(mapInstanceRef.current)
                .bindPopup('<strong>내 현재 위치</strong>')
                .openPopup();
            } else if (mapEngine === 'kakao' && window.kakao && window.kakao.maps) {
              const map = mapInstanceRef.current;
              const moveLatLon = new window.kakao.maps.LatLng(lat, lng);
              map.relayout();
              map.setCenter(moveLatLon);
              map.setLevel(4);

              if (userMarkerRef.current) userMarkerRef.current.setMap(null);
              userMarkerRef.current = new window.kakao.maps.Marker({
                position: moveLatLon,
                title: '내 위치',
              });
              userMarkerRef.current.setMap(map);
            }
          }
        },
        () => {
          alert('위치 권한을 허용해 주시면 현재 위치 근처 애견동반 장소를 찾을 수 있습니다.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cafe': return <Coffee className="w-4 h-4 text-purple-600" />;
      case 'restaurant': return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'park': return <Trees className="w-4 h-4 text-emerald-600" />;
      case 'hospital': return <Hospital className="w-4 h-4 text-rose-600" />;
      case 'hotel': return <Hotel className="w-4 h-4 text-blue-600" />;
      default: return <MapPin className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] sm:h-[650px] bg-slate-100 rounded-3xl overflow-hidden shadow-inner border border-purple-100">
      {/* Floating Controls Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={handleMyLocation}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/90 backdrop-blur hover:bg-white text-gray-800 text-xs font-bold rounded-full shadow-lg border border-purple-100 transition active:scale-95"
          title="내 위치 찾기"
        >
          <Navigation className="w-3.5 h-3.5 text-purple-600" />
          <span>내 위치</span>
        </button>

        <button
          onClick={() => {
            setViewMode(viewMode === 'map' ? 'list' : 'map');
            if (viewMode === 'list' && mapInstanceRef.current) {
              setTimeout(() => {
                if (mapEngine === 'leaflet') mapInstanceRef.current.invalidateSize();
                else if (mapEngine === 'kakao') mapInstanceRef.current.relayout();
              }, 100);
            }
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-full shadow-lg transition active:scale-95"
        >
          {viewMode === 'map' ? (
            <>
              <List className="w-3.5 h-3.5" />
              <span>목록으로 보기</span>
            </>
          ) : (
            <>
              <MapIcon className="w-3.5 h-3.5" />
              <span>지도 보기</span>
            </>
          )}
        </button>
      </div>

      {/* VIEW MODE: MAP */}
      {viewMode === 'map' ? (
        <div className="w-full h-full relative">
          {/* Map Container */}
          <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />

          {/* Floating POI Summary Count Badge */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border border-purple-100 inline-block text-xs font-medium text-purple-900 pointer-events-auto">
              📍 지도에 <strong>{places.length}개</strong>의 애견동반 스팟이 표시중입니다.
            </div>
          </div>

          {/* Interactive Bottom Carousel Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-10 overflow-x-auto pb-2 flex gap-3 snap-x scrollbar-none">
            {places.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 text-center w-full max-w-md mx-auto">
                <p className="text-sm font-semibold text-gray-700">검색 조건에 일치하는 애견 스팟이 없습니다.</p>
                <p className="text-xs text-gray-500 mt-1">다른 카테고리나 검색어로 다시 시도해 보세요.</p>
              </div>
            ) : (
              places.map((place) => {
                const isSelected = selectedPlace?.id === place.id;
                return (
                  <div
                    key={place.id}
                    onClick={() => onSelectPlace(place)}
                    className={`snap-center shrink-0 w-72 bg-white/95 backdrop-blur p-3.5 rounded-2xl shadow-lg border cursor-pointer transition-all transform hover:-translate-y-1 ${
                      isSelected
                        ? 'border-purple-600 ring-2 ring-purple-500/20 bg-purple-50/50'
                        : 'border-purple-100 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                        {place.imageUrl ? (
                          /* eslint-disable-next-html-element-suppression */
                          <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-purple-50">
                            {getCategoryIcon(place.category)}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            {place.categoryName}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 truncate">{place.name}</h4>
                        <p className="text-[11px] text-gray-500 truncate">{place.roadAddress || place.address}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* VIEW MODE: LIST */
        <div className="w-full h-full overflow-y-auto p-4 space-y-3 bg-slate-50">
          <h3 className="text-sm font-bold text-purple-900 mb-2">애견 동반 스팟 목록 ({places.length}개)</h3>
          {places.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-purple-100 hover:border-purple-300 transition cursor-pointer flex justify-between items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                    {place.categoryName}
                  </span>
                  {place.rating && (
                    <span className="text-xs font-bold text-amber-500">★ {place.rating}</span>
                  )}
                </div>
                <h4 className="text-base font-bold text-gray-900">{place.name}</h4>
                <p className="text-xs text-gray-500">{place.address}</p>
                <p className="text-xs text-purple-600 font-medium">{place.operatingHours}</p>
              </div>

              <div className="shrink-0 text-right">
                <span className="inline-flex items-center gap-1 text-xs text-purple-600 font-bold bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100">
                  상세보기
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
