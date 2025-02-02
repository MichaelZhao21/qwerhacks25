// src/app/dashboard/page.tsx
'use client'

import { useRouter } from 'next/navigation';
import RoyceHall from '@/app/assets/royce-hall.png';

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

  async function fetchBase64Image(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result as string);
    });
  }

  const finish = async () => {
    const img = await fetchBase64Image(RoyceHall.src);
    localStorage.setItem('paintImage', img);
    localStorage.setItem('paintLocation', "Royce Hall");
    router.push('/dashboard/paint');
  }

  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-6">Welcome to Campus</h1> */}
      
      {/* Continue Painting Section */}
      <div className="mb-8">
        <h2 className="text-xl mb-2 text-gray-800">Pick up where you last left off...</h2>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden text-gray-800">
          {/* Location Text */}
          <div className="p-4 border-b">

          <h3 className="text-lg font-medium">Royce Hall</h3>
            <h4 className="text-md font-medium text-gray-600">LA, CA</h4>          </div>
          
          {/* Placeholder Image */}
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <img 
              src="/royce_hall_gay.jpg" 
              alt="Royce Hall WIP"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Action Button */}
          <div className="p-4 bg-white">
            <div className="p-1 rounded-lg" style={{ background: generateGradient(flagColors[selectedIdentity]) }}>
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

      <div className="p-4 bg-white">
            <div className="p-1 rounded-lg" style={{ background: generateGradient(flagColors[selectedIdentity]) }}>
              <button 
                onClick={() => router.push('/dashboard/upload')}
                className="w-full py-3 px-6 rounded-md font-medium bg-white hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span className="text-gray-800">New</span>
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