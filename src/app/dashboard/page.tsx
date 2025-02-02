// src/app/dashboard/page.tsx
'use client'

import { useRouter } from 'next/navigation';
import { useIdentity } from '@/context/IdentityContext';

export default function DashboardPage() {
  const router = useRouter();
  const { 
    selectedIdentity, 
    generateGradient, 
    getIdentityColors 
  } = useIdentity();

  const colors = getIdentityColors();

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
      {/* Location Text */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">{location}</h3>
        <h4 className="text-md font-medium text-gray-600">{city}</h4>
      </div>
      
      {/* Placeholder Image */}
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        <img 
          src={imageSrc} 
          alt={`${location} WIP`}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Action Button */}
      <div className="p-4 bg-white flex justify-center">
        <div className="p-1 rounded-lg" style={{ background: generateGradient(colors) }}>
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

  return (
    <div className="p-4">
      {/* Gallery Section */}
      <div className="mb-8">
        <h2 className="text-xl mb-4 text-gray-800">Gallery</h2>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GalleryCard 
            location="Royce Hall" 
            city="LA, CA" 
            imageSrc="/royce_hall_gay.jpg"
            onLearnMore={() => router.push('/dashboard/paint')}
          />
          
          <GalleryCard 
            location="Powell Library" 
            city="LA, CA" 
            imageSrc="/powell_library.jpg"
            onLearnMore={() => router.push('/dashboard/paint')}
          />
          
          <GalleryCard 
            location="Dickson Court" 
            city="LA, CA" 
            imageSrc="/dickson_court.jpg"
            onLearnMore={() => router.push('/dashboard/paint')}
          />
        </div>
      </div>
    </div>
  );
}