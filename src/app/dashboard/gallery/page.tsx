// src/app/dashboard/page.tsx
'use client'
import { useRouter } from 'next/navigation';
export default function DashboardPage() {
  const router = useRouter();
  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-6">Welcome to Campus</h1> */}
      
      {/* Continue Painting Section */}
      <div className="mb-8">
        <h2 className="text-xl mb-2 text-gray-800">Gallery</h2>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden text-gray-800">
          {/* Location Text */}
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Royce Hall, LA, CA</h3>
          </div>
          
          {/* Placeholder Image */}
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <img 
              src="/royce_hall_gay.png" 
              alt="Royce Hall WIP"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Action Button */}
          <div className="p-4 bg-white">
            <button 
              onClick={() => router.push('/dashboard/paint')}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
              <span>Finish Painting!</span>
              <span className="text-xl">🎨</span>
            </button>
          </div>
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