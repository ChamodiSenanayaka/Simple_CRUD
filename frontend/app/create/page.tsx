'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Book {
  title: string;
  author: string;
  isbn: string;
  description?: string;
  price: number;
}

export default function CreatePage() {
  const [form, setForm] = useState<Book>({ title: '', author: '', isbn: '', description: '', price: 0 });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/books/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast('Book created successfully', 'success');
        setForm({ title: '', author: '', isbn: '', description: '', price: 0 });
        router.push('/');
      } else {
        showToast('Failed to create book', 'error');
      }
    } catch (err) {
      showToast('Error creating book', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-purple-100">
          <h2 className="text-2xl font-bold mb-4">➕ Add New Book</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📖 Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">✍️ Author *</label>
              <input required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🔢 ISBN *</label>
              <input required value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Price *</label>
              <input type="number" step="0.01" required value={form.price || ''} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">📝 Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl resize-none" />
            </div>

            <div className="md:col-span-2 flex gap-4 mt-2">
              <button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold">Create Book</button>
              <button type="button" onClick={() => setForm({ title: '', author: '', isbn: '', description: '', price: 0 })} className="flex-1 bg-gray-300 px-6 py-3 rounded-xl">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
