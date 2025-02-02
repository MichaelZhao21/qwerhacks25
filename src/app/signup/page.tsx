// src/app/signup/page.tsx
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const fields = [
  { id: 'name', label: 'Full Name', type: 'text', color: '#FFB3BA', placeholder: 'Enter your name' },
  { id: 'username', label: 'Username', type: 'text', color: '#BAFFC9', placeholder: '@username' },
  { id: 'email', label: 'Email', type: 'email', color: '#BAE1FF', placeholder: 'email@example.com' },
  { id: 'location', label: 'Location', type: 'text', color: '#FFFFBA', placeholder: 'City, Country' },
  { id: 'password', label: 'Password', type: 'password', color: '#E8BAFF', placeholder: 'Create a password' },
  { id: 'confirmPassword', label: 'Confirm Password', type: 'password', color: '#FFD1BA', placeholder: 'Confirm your password' },
];

const flagColors = ['#FF0018', '#FFA52C', '#FFFF41', '#008018', '#0000F9', '#86007D'];

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({});

  const generateGradient = (colors: string[]) => {
    return `linear-gradient(135deg, ${colors.join(', ')})`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/campus-logo.svg"
            alt="CAMPUS"
            className="w-48 h-16 mx-auto"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-black text-center">Create your account</h1>

          <form className="space-y-4">
            {fields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-black mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  placeholder={field.placeholder}
                  className="w-full p-3 rounded-lg text-black"
                  style={{
                    backgroundColor: `${field.color}50`, // Adding 50 for opacity
                    border: `2px solid ${field.color}`
                  }}
                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                />
              </div>
            ))}

            {/* Identity Selection */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Pride Identity
              </label>
              <select 
                className="w-full p-3 rounded-lg border-2 text-black"
                style={{
                  backgroundColor: '#FFE4E150',
                  borderColor: '#FFE4E1'
                }}
              >
                <option value="pride">Pride</option>
                <option value="trans">Trans</option>
                <option value="bi">Bisexual</option>
                <option value="pan">Pansexual</option>
                <option value="lesbian">Lesbian</option>
                <option value="nonbinary">Non-binary</option>
              </select>
            </div>

            {/* Sign Up Button */}
            <div className="pt-4">
              <div className="p-1 rounded-lg" style={{ background: generateGradient(flagColors) }}>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3 bg-white rounded-md font-medium text-black hover:bg-gray-50 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Login Link */}
            <p className="text-center mt-4">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/')}
                className="text-blue-500 hover:underline"
              >
                Log in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}