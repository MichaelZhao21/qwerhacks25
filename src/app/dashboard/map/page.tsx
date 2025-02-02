// src/app/dashboard/map/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LandmarkName, startPainting } from '@/app/components/landmarks';

type Identity = 'pride' | 'trans' | 'bi' | 'pan' | 'lesbian' | 'nonbinary';

const flagColors: Record<Identity, string[]> = {
  pride: ['#FF0018', '#FFA52C', '#FFFF41', '#008018', '#0000F9', '#86007D'],
  trans: ['#55CDFC', '#F7A8B8', '#FFFFFF', '#F7A8B8', '#55CDFC'],
  bi: ['#D60270', '#9B4F96', '#0038A8'],
  pan: ['#FF218C', '#FFD800', '#21B1FF'],
  lesbian: ['#D52D00', '#EF7627', '#FF9A56', '#FFFFFF', '#D162A4', '#B55690', '#A30262'],
  nonbinary: ['#FCF434', '#FFFFFF', '#9C59D1', '#2C2C2C']
};

interface Landmark {
  id: number;
  name: string;
  location: { lat: number; lng: number };
  description: string;
  imageUrl: string;
  completed: boolean;
}

const landmarks: Landmark[] = [
  {
    id: LandmarkName.Jewel,
    name: "Jewel Thais-Williams",
    location: { lat: 34.0669, lng: -118.4422 },
    description: "Jewel Thais-Williams is a UCLA alumni who founded the Catch One. She was the first black woman in the  US to own a nightclub. It was a safe space for LGBTQ+ and Black communities in Los Angeles.",
    imageUrl: "/jewel_thais_williams.jpg",
    completed: true
  },
  {
    id: LandmarkName.Royce,
    name: "Royce Hall",
    location: { lat: 34.0722, lng: -118.4441 },
    description: "Royce Hall, UCLA’s most iconic building, is illuminated with rainbow lights during Pride Month to honor and celebrate the LGBTQ+ community. In the past, students organizations like Bimbos Theatre Co. have hosted drag showcases for charity on the big stage.",
    imageUrl: "/royce_hall_gay.jpg",
    completed: false
  },
  {
    id: LandmarkName.Powell,
    name: "Powell Library",
    location: { lat: 34.0715, lng: -118.4419 },
    description: "Main undergraduate library in Romanesque Revival style",
    imageUrl: "/powell.jpg",
    completed: false
  },
  {
    id: LandmarkName.BruinBear,
    name: "Bruin Bear",
    location: { lat: 34.0708, lng: -118.4425 },
    description: "Bronze Bruin statue, a popular meeting spot",
    imageUrl: "/bruin_bear.jpeg",
    completed: false
  }
];

export default function MapPage() {
  const router = useRouter();
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    const loadMap = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAVY6bUTltEDnZ-hHjuw7F5obBAnW_tDLU`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      const mapInstance = new google.maps.Map(document.getElementById('map')!, {
        center: { lat: 34.0669, lng: -118.4422 },
        zoom: 17,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      const newMarkers = landmarks.map(landmark => {
        const marker = new google.maps.Marker({
          position: landmark.location,
          map: mapInstance,
          title: landmark.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: landmark.completed ? '#4CAF50' : '#2196F3',
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: 'white',
            scale: landmark.id === 1 ? 8 : 6,
            anchor: new google.maps.Point(0, 0)
          }
        });

        // Add hover animation
        marker.addListener('mouseover', () => {
          marker.setIcon({
            ...marker.getIcon() as google.maps.Symbol,
            scale: landmark.id === 1 ? 10 : 8,
            fillOpacity: 1
          });
        });

        marker.addListener('mouseout', () => {
          marker.setIcon({
            ...marker.getIcon() as google.maps.Symbol,
            scale: landmark.id === 1 ? 8 : 6,
            fillOpacity: 0.9
          });
        });

        marker.addListener('click', () => {
          setSelectedLandmark(landmark);
        });

        return marker;
      });

      setMarkers(newMarkers);
      setMap(mapInstance);
    };

    loadMap();

    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, []);

  const handleStartPainting = (landmark: Landmark) => {
    startPainting(landmark.id, router);
  };

  return (
    <div className="h-screen relative">
      {/* Map Container */}
      <div id="map" className="w-full h-full" />

      {/* Selected Landmark Info */}
      {selectedLandmark && (
        <div className="absolute bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg p-4 mx-auto max-w-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-black">{selectedLandmark.name}</h3>
              <p className="text-sm text-black mt-1">{selectedLandmark.description}</p>
            </div>
            <button 
              onClick={() => setSelectedLandmark(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          {selectedLandmark.imageUrl && (
            <div className="mt-3">
              <img 
                src={selectedLandmark.imageUrl} 
                alt={selectedLandmark.name}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => handleStartPainting(selectedLandmark)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Paint This!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}