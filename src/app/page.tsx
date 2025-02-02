// src/app/page.tsx
'use client'

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIdentity, Identity } from '@/context/IdentityContext';

export default function Home() {
  const router = useRouter();
  const { 
    selectedIdentity, 
    setSelectedIdentity, 
    generateGradient, 
    getIdentityColors 
  } = useIdentity();

  const handleLogin = () => {
    router.push('/dashboard');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const colors = getIdentityColors();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div 
        className="p-2 rounded-2xl w-96"
        style={{ background: generateGradient(colors) }}
      >
        <div className="bg-white rounded-xl p-8 space-y-6">
          {/* Logo */}
          <div className="w-64 h-32 mx-auto">
            <img 
              src="/logo.png" 
              alt="CAMPUS"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Identity Selection */}
          <div className="relative">
            <select
              value={selectedIdentity}
              onChange={(e) => setSelectedIdentity(e.target.value as Identity)}
              className="w-full p-3 border rounded-lg appearance-none cursor-pointer text-gray-800"
            >
              <option value="pride">Pride</option>
              <option value="trans">Trans</option>
              <option value="bi">Bisexual</option>
              <option value="pan">Pansexual</option>
              <option value="lesbian">Lesbian</option>
              <option value="nonbinary">Non-binary</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg text-gray-800"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg text-gray-800"
            />
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors"
              style={{ background: colors[0] }}
            >
              Log In
            </button>
            <button
              onClick={handleSignUp}
              className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors"
              style={{ background: colors[colors.length - 1] }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}