// src/app/dashboard/page.tsx
'use client'

import { useRouter } from 'next/navigation';
import RoyceHall from '@/app/assets/royce-hall.png';
import { LandmarkName, startPainting } from '../components/landmarks';
import { useIdentity, Identity } from '@/context/IdentityContext';

export default function DashboardPage() {
  const router = useRouter();

  const { 
    selectedIdentity, 
    setSelectedIdentity, 
    generateGradient, 
    getIdentityColors 
  } = useIdentity();

  const finish = async () => {
    startPainting(LandmarkName.Royce, router);
  }

  const colors = getIdentityColors();

  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-6">Welcome to Campus</h1> */}
      
      {/* Continue Painting Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Pick up where you last left off...</h2>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden text-gray-800">
          {/* Location Text */}
          <div className="p-4 border-b">

          <h3 className="text-lg font-medium">Royce Hall</h3>
            <h4 className="text-md font-medium text-gray-600">LA, CA</h4>          </div>
          
          {/* Placeholder Image */}
          <div className="aspect-video bg-gray-100 flex items-center justify-center max-h-[60vh] w-full object-contain">
            <img 
              src="/royce_hall_gay.jpg" 
              alt="Royce Hall WIP"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Action Button */}
          <div className="p-4 bg-white">
            <div className="p-1 rounded-lg" style={{ background: generateGradient(colors) }}>
              <button 
                onClick={finish}
                className="w-full py-3 px-6 rounded-md font-medium bg-white hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span className="text-gray-800">Finish Painting!</span>
                <span className="text-xl">🎨</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-24 px-4">
            <div className="p-1 rounded-lg" style={{ background: generateGradient(colors) }}>
              <button 
                onClick={() => router.push('/dashboard/upload')}
                className="w-full py-3 px-6 rounded-md font-medium bg-white hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span className="text-gray-800">Create your Own</span>
              </button>
            </div>
          </div>

      {/* Other Dashboard Content */}
      {/* <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Latest Updates</h2>
          <p className="text-gray-600">Welcome to your dashboard!</p>
        </div>
      </div> */}
    </div>
  );
}