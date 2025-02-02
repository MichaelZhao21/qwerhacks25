// src/app/dashboard/paint/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PaintByNumbers from '@/app/components/PaintByNumbers';

const pastelColors = [
  { id: 1, color: '#FFB3BA', name: 'Pastel Pink' },
  { id: 2, color: '#BAFFC9', name: 'Pastel Green' },
  { id: 3, color: '#BAE1FF', name: 'Pastel Blue' },
  { id: 4, color: '#FFFFBA', name: 'Pastel Yellow' },
  { id: 5, color: '#E8BAFF', name: 'Pastel Purple' },
  { id: 6, color: '#FFD1BA', name: 'Pastel Orange' },
  { id: 7, color: '#F0E6EF', name: 'Pastel Lavender' },
  { id: 8, color: '#C7CEEA', name: 'Pastel Periwinkle' },
  { id: 9, color: '#FFDFD3', name: 'Pastel Peach' },
  { id: 10, color: '#D4F0F0', name: 'Pastel Aqua' },
];

export default function PaintPage() {
  // const [selectedColor, setSelectedColor] = useState(pastelColors[0]);

  const [imageSource, setImageSource] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedImage = localStorage.getItem('paintImage');
        
        if (!storedImage) {
            router.push('/dashboard/upload');
            return;
        }

        setImageSource(storedImage);
        localStorage.removeItem('paintImage');
    }, [router]);

    if (!imageSource) {
        return <div>Loading...</div>;
    }

  return (
    <div className="h-[calc(100vh-3rem)] bg-gray-50 relative px-4 pt-4 overflow-hidden">
        <div className="min-h-screen bg-gray-50">
            <PaintByNumbers imageSource={imageSource} />
        </div>      
        {/* Canvas Area
      <div className="aspect-video bg-white shadow-lg mx-4 mt-4 mb-48 rounded-lg flex items-center justify-center">
        <img 
          src="/images/royce-hall.png"
          alt="Canvas"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg h-44">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="grid grid-cols-5 gap-6 mb-6">
            {pastelColors.slice(0, 5).map((color) => (
              <div key={color.id} className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => setSelectedColor(color)}
                  className={`w-full h-12 rounded-lg ${
                    selectedColor.id === color.id ? 'ring-4 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: color.color }}
                />
                <span className="text-black font-medium">{color.id}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-6">
            {pastelColors.slice(5).map((color) => (
              <div key={color.id} className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => setSelectedColor(color)}
                  className={`w-full h-12 rounded-lg ${
                    selectedColor.id === color.id ? 'ring-4 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: color.color }}
                />
                <span className="text-black font-medium">{color.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
}