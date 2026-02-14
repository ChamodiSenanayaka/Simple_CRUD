import React from 'react';
import '../globals.css';

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">➕ Create Book</h1>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
