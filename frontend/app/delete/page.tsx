'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Book {
  id?: number;
  title: string;
  author: string;
}

export default function DeletePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [confirm, setConfirm] = useState<{ show: boolean; id?: number; title?: string }>({ show: false });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);
  const API = 'http://localhost:8080/api/books';

  useEffect(() => {
    fetchBooks();
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setBooks(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const askDelete = (id?: number, title?: string) => setConfirm({ show: true, id, title });

  const doDelete = async () => {
    if (!confirm.id) return;
    try {
      const res = await fetch(`${API}/delete/${confirm.id}`, { method: 'DELETE' });
      if (res.ok) {
        setToast({ message: 'Deleted', type: 'success' });
        fetchBooks();
      } else {
        setToast({ message: 'Failed to delete', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Error deleting', type: 'error' });
    }
    setConfirm({ show: false });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      {confirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">Delete Book?</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete "{confirm.title}"?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm({ show: false })} className="flex-1 bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={doDelete} className="flex-1 bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-purple-100">
          <h2 className="text-2xl font-bold mb-4">🗑️ Delete Book</h2>
          <ul className="space-y-3">
            {books.map((b) => (
              <li key={b.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{b.title}</div>
                  <div className="text-sm text-gray-600">{b.author}</div>
                </div>
                <button onClick={() => askDelete(b.id, b.title)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
