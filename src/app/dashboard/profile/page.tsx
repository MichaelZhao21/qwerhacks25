// src/app/dashboard/profile/page.tsx
'use client'

import { Settings, Camera, Heart, Edit2, MapPin, Palette } from 'lucide-react';
import { useIdentity, Identity } from '@/context/IdentityContext';

export default function ProfilePage() {
  const { 
    selectedIdentity, 
    setSelectedIdentity, 
    generateGradient, 
    getIdentityColors 
  } = useIdentity();

  const colors = getIdentityColors();

  const stats = [
    { icon: Palette, label: 'Paintings', value: '12' },
    { icon: MapPin, label: 'Locations', value: '8' },
    { icon: Heart, label: 'Likes', value: '124' },
  ];

  return (
    
    <div className="p-4 max-w-2xl mx-auto">
        
        
      {/* Profile Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow">
              <Camera className="w-4 h-4 text-black" />
            </button>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-black">Alex Chen</h1>
              <button>
                <Edit2 className="w-4 h-4 text-black" />
              </button>
            </div>
            <p className="text-black">@artventures</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-4 rounded-lg shadow text-center">
              <Icon className="w-6 h-6 mx-auto mb-2 text-black" />
              <div className="text-xl font-bold text-black">{stat.value}</div>
              <div className="text-sm text-black">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-black">Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-black font-medium">Pride Identity</label>
              <select 
                className="p-2 border rounded-lg text-black"
                value={selectedIdentity}
                onChange={(e) => setSelectedIdentity(e.target.value as Identity)}
              >
                <option value="pride">Pride</option>
                <option value="trans">Trans</option>
                <option value="bi">Bisexual</option>
                <option value="pan">Pansexual</option>
                <option value="lesbian">Lesbian</option>
                <option value="nonbinary">Non-binary</option>
              </select>
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-center pt-4">
              <div className="p-1 rounded-lg inline-block" style={{ background: generateGradient(colors) }}>
                <button className="px-6 py-2 rounded-md font-medium bg-white hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span className="text-black">Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}