// src/app/dashboard/page.tsx
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIdentity } from '@/context/IdentityContext';
import RoyceHall from '@/app/assets/thumb/royce-hall.png';
import Bruin from '@/app/assets/bruin.png';
import Powell from '@/app/assets/thumb/powell.png';
import Tongva from '@/app/assets/thumb/tongva.png';
import { X } from 'lucide-react';

interface Landmark {
  name: string;
  city: string;
  imageSrc: string;
  description: string;
  historicalSignificance: string;
}

const landmarks: Record<string, Landmark> = {
  'Royce Hall': {
    name: 'Royce Hall',
    city: 'LA, CA',
    imageSrc: RoyceHall.src,
    description: 'One of the most iconic buildings at UCLA, Royce Hall stands as a testament to architectural beauty and academic excellence.',
    historicalSignificance: 'During Pride Month, Royce Hall is illuminated with rainbow lights to honor and celebrate the LGBTQ+ community. Student organizations like Bimbos Theatre Co. have hosted drag showcases for charity on its historic stage.'
  },
  'Powell Library': {
    name: 'Powell Library',
    city: 'LA, CA',
    imageSrc: Powell.src,
    description: 'A stunning example of Romanesque Revival architecture, Powell Library is the heart of academic research at UCLA.',
    historicalSignificance: 'Named after a prominent UCLA librarian, the library has been a center of scholarly pursuit and student life since its construction.'
  },
  'Tongva Steps': {
    name: 'Tongva Steps',
    city: 'LA, CA',
    imageSrc: Tongva.src,
    description: 'A significant outdoor space on the UCLA campus, named in recognition of the indigenous Tongva people.',
    historicalSignificance: 'The steps serve as a gathering place and tribute to the Tongva people, the original inhabitants of the Los Angeles basin, acknowledging the land\'s indigenous history.'
  },
  'Bruin Bear': {
    name: 'Bruin Bear',
    city: 'LA, CA',
    imageSrc: Bruin.src,
    description: 'The beloved bronze statue of UCLA\'s mascot, a popular meeting spot and photo opportunity.',
    historicalSignificance: 'A cherished campus landmark, the Bruin Bear has been a symbol of UCLA pride and school spirit for generations of students.'
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const { selectedIdentity, getIdentityColors, generateGradient } = useIdentity();
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);

  const GalleryCard = ({ 
    location, 
    city, 
    imageSrc, 
    onLearnMore 
  }: { 
    location: string, 
    city: string, 
    imageSrc: string, 
    onLearnMore: () => void 
  }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden text-gray-800">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">{location}</h3>
        <h4 className="text-md font-medium text-gray-600">{city}</h4>
      </div>
      
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        <img 
          src={imageSrc} 
          alt={`${location} WIP`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 bg-white flex justify-center">
        <div className="p-1 rounded-lg" style={{ background: generateGradient(getIdentityColors()) }}>
          <button 
            onClick={onLearnMore}
            className="w-full py-3 px-6 rounded-md font-medium bg-white hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <span className="text-gray-800">Learn More</span>
          </button>
        </div>
      </div>
    </div>
  );

  const LandmarkModal = ({ landmark, onClose }: { 
    landmark: Landmark, 
    onClose: () => void 
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="bg-white rounded-lg absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image */}
        <div className="w-full h-64 overflow-hidden rounded-t-lg">
          <img 
            src={landmark.imageSrc} 
            alt={landmark.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{landmark.name}</h2>
          <p className="text-gray-600 mb-4">{landmark.description}</p>
          
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Historical Significance</h3>
          <p className="text-gray-700">{landmark.historicalSignificance}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Gallery</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(landmarks).map(([key, landmark]) => (
            <GalleryCard 
              key={key}
              location={landmark.name}
              city={landmark.city}
              imageSrc={landmark.imageSrc}
              onLearnMore={() => setSelectedLandmark(landmark)}
            />
          ))}
        </div>
      </div>

      {/* Landmark Modal */}
      {selectedLandmark && (
        <LandmarkModal 
          landmark={selectedLandmark} 
          onClose={() => setSelectedLandmark(null)} 
        />
      )}
    </div>
  );
}