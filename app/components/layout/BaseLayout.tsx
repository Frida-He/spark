import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface BaseLayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar className="w-64 min-h-[calc(100vh-12rem)] bg-white shadow-sm" />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 