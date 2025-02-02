// src/context/IdentityContext.tsx
'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Identity = 'pride' | 'trans' | 'bi' | 'pan' | 'lesbian' | 'nonbinary';

export const flagColors: Record<Identity, string[]> = {
  pride: ['#FF0018', '#FFA52C', '#FFFF41', '#008018', '#0000F9', '#86007D'],
  trans: ['#55CDFC', '#F7A8B8', '#FFFFFF', '#F7A8B8', '#55CDFC'],
  bi: ['#D60270', '#9B4F96', '#0038A8'],
  pan: ['#FF218C', '#FFD800', '#21B1FF'],
  lesbian: ['#D52D00', '#EF7627', '#FF9A56', '#FFFFFF', '#D162A4', '#B55690', '#A30262'],
  nonbinary: ['#FCF434', '#FFFFFF', '#9C59D1', '#2C2C2C']
};

interface IdentityContextType {
  selectedIdentity: Identity;
  setSelectedIdentity: (identity: Identity) => void;
  generateGradient: (colors: string[]) => string;
  getIdentityColors: () => string[];
}

const IdentityContext = createContext<IdentityContextType | undefined>(undefined);

export function IdentityProvider({ 
  children, 
  initialIdentity = 'pride' 
}: { 
  children: ReactNode, 
  initialIdentity?: Identity 
}) {
  const [selectedIdentity, setSelectedIdentity] = useState<Identity>(initialIdentity);

  const generateGradient = (colors: string[]) => {
    return `linear-gradient(135deg, ${colors.join(', ')})`;
  };

  const getIdentityColors = () => {
    return flagColors[selectedIdentity];
  };

  const contextValue = {
    selectedIdentity,
    setSelectedIdentity,
    generateGradient,
    getIdentityColors
  };

  return (
    <IdentityContext.Provider value={contextValue}>
      {children}
    </IdentityContext.Provider>
  );
}

export function useIdentity() {
  const context = useContext(IdentityContext);
  if (context === undefined) {
    throw new Error('useIdentity must be used within an IdentityProvider');
  }
  return context;
}