// src/app/dashboard/upload/page.tsx
'use client'

import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

type Identity = 'pride' | 'trans' | 'bi' | 'pan' | 'lesbian' | 'nonbinary';

const flagColors: Record<Identity, string[]> = {
  pride: ['#FF0018', '#FFA52C', '#FFFF41', '#008018', '#0000F9', '#86007D'],
  trans: ['#55CDFC', '#F7A8B8', '#FFFFFF', '#F7A8B8', '#55CDFC'],
  bi: ['#D60270', '#9B4F96', '#0038A8'],
  pan: ['#FF218C', '#FFD800', '#21B1FF'],
  lesbian: ['#D52D00', '#EF7627', '#FF9A56', '#FFFFFF', '#D162A4', '#B55690', '#A30262'],
  nonbinary: ['#FCF434', '#FFFFFF', '#9C59D1', '#2C2C2C']
};

export default function UploadPage() {
  const [selectedIdentity] = useState<Identity>('pride');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');

  const generateGradient = (colors: string[]) => {
    return `linear-gradient(135deg, ${colors.join(', ')})`;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Upload a New Image</h1>

      {/* Location Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter location (e.g., Royce Hall, LA, CA)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded-lg text-gray-800"
        />
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {selectedImage ? (
          <div className="space-y-4">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-h-64 mx-auto"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="text-black hover:underline"
            >
              Remove image
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <ImageIcon className="h-16 w-16 text-gray-400" />
            </div>
            <div className="text-black">
              <p>Drag and drop your image here, or</p>
              <label className="inline-block cursor-pointer">
                <span className="text-blue-500 hover:underline">browse</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-center">
        <div className="p-1 rounded-lg inline-block" style={{ background: generateGradient(flagColors[selectedIdentity]) }}>
          <button 
            className="px-6 py-2 rounded-md font-medium bg-white hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-black">Start Painting</span>
          </button>
        </div>
      </div>
    </div>
  );
}