// src/app/dashboard/layout.tsx
'use client'

import { Home, Image, Map, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Gallery', icon: Image, path: '/dashboard/gallery' },
    { name: 'Map', icon: Map, path: '/dashboard/map' },
    { name: 'Profile', icon: User, path: '/dashboard/profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main content */}
      <main className="flex-1 pb-16">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            const IconComponent = tab.icon;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex flex-col items-center py-2 px-4 ${
                  isActive ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <IconComponent size={24} />
                <span className="text-xs mt-1">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}