// src/app/dashboard/map/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// UCLA landmarks data
const landmarks = [
  {
    id: 1,
    name: "Jewel Thais-Williams",
    location: { lat: 34.0669, lng: -118.4422 }, // Alumni Center coordinates
    description: "UCLA Alumni Center, named after the revolutionary LGBTQ+ and civil rights activist",
    image: "/images/jewel-thais-williams.png",
    completed: true
  },
  {
    id: 2,
    name: "Royce Hall",
    location: { lat: 34.0722, lng: -118.4441 },
    description: "Iconic UCLA building with Roman-collegiate architecture",
    image: "/images/royce-hall.png",
    completed: false
  },
  {
    id: 3,
    name: "Powell Library",
    location: { lat: 34.0715, lng: -118.4419 },
    description: "Main undergraduate library in Romanesque Revival style",
    image: "/images/powell.png",
    completed: false
  },
  {
    id: 4,
    name: "Janss Steps",
    location: { lat: 34.0718, lng: -118.4429 },
    description: "Historic stairs connecting upper and lower campus",
    image: "/images/janss-steps.png",
    completed: false
  },
  {
    id: 5,
    name: "Bruin Bear",
    location: { lat: 34.0708, lng: -118.4425 },
    description: "Bronze Bruin statue, a popular meeting spot",
    image: "/images/bruin-bear.png",
    completed: false
  }
];

export default function MapPage() {
  const router = useRouter();
  const [selectedLandmark, setSelectedLandmark] = useState<any>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    // Load Google Maps script
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
        center: { lat: 34.0669, lng: -118.4422 }, // Centered on Alumni Center
        zoom: 17, // Slightly closer zoom
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      // Create markers for each landmark
      const newMarkers = landmarks.map(landmark => {
        const marker = new google.maps.Marker({
          position: landmark.location,
          map: mapInstance,
          title: landmark.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: landmark.completed ? '#4CAF50' : '#2196F3',
            fillOpacity: 0.7,
            strokeWeight: 2,
            strokeColor: 'white',
          }
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
  }, []);

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
          {selectedLandmark.image && (
            <div className="mt-3">
              <img 
                src={selectedLandmark.image} 
                alt={selectedLandmark.name}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => router.push('/dashboard/paint')}
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