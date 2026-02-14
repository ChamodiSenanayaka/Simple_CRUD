'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  description?: string;
  price: number;
}

export default function UpdatePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editing, setEditing] = useState<Book | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

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

  const startEdit = (b: Book) => setEditing(b);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message: msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const submitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.id) return;
    try {
      const res = await fetch(`${API}/update/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      if (res.ok) {
        setMessage('Book updated');
        showToast('Book updated', 'success');
        fetchBooks();
        setEditing(null);
        router.push('/');
      } else {
        setMessage('Failed to update');
        showToast('Failed to update', 'error');
      }
    } catch (err) {
      setMessage('Error updating');
      showToast('Error updating', 'error');
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-purple-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">✏️ Update Book</h2>
            <div className="text-sm text-gray-500">Select a book to edit</div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-3">
                {books.map((b) => (
                  <li key={b.id} className="p-3 border rounded flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{b.title}</div>
                      <div className="text-sm text-gray-600">{b.author}</div>
                    </div>
                    <button onClick={() => startEdit(b)} className="bg-amber-400 px-3 py-1 rounded">Edit</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-3">
                <button onClick={() => router.push('/')} className="bg-gray-200 text-gray-700 px-3 py-1 rounded">← Back</button>
                <h3 className="font-semibold">Edit</h3>
              </div>
              {editing ? (
                <form onSubmit={submitUpdate} className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full p-3 border-2 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
                    <input value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} className="w-full p-3 border-2 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">ISBN</label>
                    <input value={editing.isbn} onChange={(e) => setEditing({ ...editing, isbn: e.target.value })} className="w-full p-3 border-2 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                    <input value={String(editing.price)} type="number" step="0.01" onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })} className="w-full p-3 border-2 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full p-3 border-2 rounded-xl resize-none" />
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-xl">Save</button>
                    <button type="button" onClick={() => setEditing(null)} className="bg-gray-300 px-6 py-2 rounded-xl">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="text-sm text-gray-500">No book selected</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
