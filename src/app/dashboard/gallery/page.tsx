// src/app/dashboard/page.tsx
'use client'

import { useRouter } from 'next/navigation';

type Identity = 'pride' | 'trans' | 'bi' | 'pan' | 'lesbian' | 'nonbinary';

const flagColors: Record<Identity, string[]> = {
  pride: ['#FF0018', '#FFA52C', '#FFFF41', '#008018', '#0000F9', '#86007D'],
  trans: ['#55CDFC', '#F7A8B8', '#FFFFFF', '#F7A8B8', '#55CDFC'],
  bi: ['#D60270', '#9B4F96', '#0038A8'],
  pan: ['#FF218C', '#FFD800', '#21B1FF'],
  lesbian: ['#D52D00', '#EF7627', '#FF9A56', '#FFFFFF', '#D162A4', '#B55690', '#A30262'],
  nonbinary: ['#FCF434', '#FFFFFF', '#9C59D1', '#2C2C2C']
};

export default function DashboardPage() {
  const router = useRouter();

  const selectedIdentity: Identity = 'pride';

  const generateGradient = (colors: string[]) => {
    return `linear-gradient(135deg, ${colors.join(', ')})`;
  };

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
        <div className="p-1 rounded-lg" style={{ background: generateGradient(flagColors[selectedIdentity]) }}>
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
      <div className="mb-8">
        <h2 className="text-xl mb-4 text-gray-800">Gallery</h2>

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
            location="Tongva Steps" 
            city="LA, CA" 
            imageSrc="/tongva_steps.jpg"
            onLearnMore={() => router.push('/dashboard/paint')}
          />

        <GalleryCard 
            location="Bruin Bear" 
            city="LA, CA" 
            imageSrc="/bruin_bear.jpeg"
            onLearnMore={() => router.push('/dashboard/paint')}
          />
        </div>
      </div>
    </div>
  );
}