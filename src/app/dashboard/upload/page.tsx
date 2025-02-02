// src/app/dashboard/upload/page.tsx
'use client'

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Image as ImageIcon, Loader } from 'lucide-react';

import { Identity, useIdentity } from '@/context/IdentityContext';


export default function UploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [colorCount, setColorCount] = useState('20');
  const [minArea, setMinArea] = useState('50');
  const [error, setError] = useState<string | null>(null);

  const { selectedIdentity, getIdentityColors, generateGradient } = useIdentity();

  const colors = getIdentityColors();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const processImageWithAPI = async (file: File) => {
    setIsProcessing(true);
    setError(null);  // Clear any previous errors
    const formData = new FormData();
    formData.append('image', file);
    formData.append('k', colorCount);
    formData.append('m', minArea);

    try {
      console.log('Sending request with:', {
        fileSize: file.size,
        fileType: file.type,
        k: colorCount,
        m: minArea
      });

      const response = await fetch('https://paintbycampus-api.mikz.dev/generate', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'image/*',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Server Error (${response.status}): ${errorText}`);
      }

      const blob = await response.blob();
      console.log('Response blob type:', blob.type);
      console.log('Response blob size:', blob.size);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProcessedImage(reader.result as string);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        setError('Failed to read processed image');
        setIsProcessing(false);
      };
      reader.readAsDataURL(blob);

    } catch (error) {
      console.error('Full error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process image');
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      processImageWithAPI(file);
    }
  }, [colorCount, minArea]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      processImageWithAPI(file);
    }
  };

  const handleStartPainting = () => {
    if (processedImage) {
      localStorage.setItem('paintImage', processedImage);
      localStorage.setItem('paintLocation', location);
      router.push('/dashboard/paint');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Upload a New Image</h1>

      {/* Parameters */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Number of Colors (k)
          </label>
          <input
            type="number"
            value={colorCount}
            onChange={(e) => setColorCount(e.target.value)}
            className="w-full p-2 border rounded-lg text-gray-600"
            min="1"
            max="50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Minimum Area Size (m)
          </label>
          <input
            type="number"
            value={minArea}
            onChange={(e) => setMinArea(e.target.value)}
            className="w-full p-2 border rounded-lg text-gray-600"
            min="1"
            max="200"
          />
        </div>
      </div>

      {/* Location Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter location (e.g., Royce Hall, LA, CA)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded-lg text-gray-600"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-sm text-red-500 hover:underline mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

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
        {isProcessing ? (
          <div className="space-y-4">
            <Loader className="h-16 w-16 text-blue-500 mx-auto animate-spin" />
            <p className="text-black">Processing image...</p>
          </div>
        ) : processedImage ? (
          <div className="space-y-4">
            <img
              src={processedImage}
              alt="Processed"
              className="max-h-64 mx-auto"
            />
            <button
              onClick={() => {
                setSelectedImage(null);
                setProcessedImage(null);
              }}
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
        <div className="p-1 rounded-lg inline-block" style={{ background: generateGradient(colors) }}>
          <button 
            onClick={handleStartPainting}
            disabled={!processedImage || !location || isProcessing}
            className="px-6 py-2 rounded-md font-medium bg-white hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
          >
            <Upload className="w-5 h-5" />
            <span className="text-black">Start Painting</span>
          </button>
        </div>
      </div>
    </div>
  );
}