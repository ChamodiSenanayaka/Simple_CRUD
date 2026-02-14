'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Book {
  id?: number;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  price?: number;
}

export default function DeleteDetailPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const id = params?.id;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const API = 'http://localhost:8080/api/books';

  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) {
          setError('Book not found');
          return;
        }
        const data = await res.json();
        setBook(data);
      } catch (err) {
        setError('Error fetching book');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const doDelete = async () => {
    if (!id) return;
    try {
      const res = await fetch(`${API}/delete/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/');
        return;
      }
      setError('Failed to delete');
    } catch (err) {
      setError('Error deleting');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!book) return <div className="p-6">No book found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">🗑️ Delete Book</h2>
            <button onClick={() => router.push('/')} className="bg-gray-200 text-gray-700 px-3 py-1 rounded">← Back</button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Title</div>
              <div className="font-semibold text-lg">{book.title}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Author</div>
              <div className="text-gray-700">{book.author}</div>
            </div>
            {book.isbn && (
              <div>
                <div className="text-sm text-gray-500">ISBN</div>
                <div className="text-gray-700 font-mono">{book.isbn}</div>
              </div>
            )}
            {typeof book.price !== 'undefined' && (
              <div>
                <div className="text-sm text-gray-500">Price</div>
                <div className="text-green-600 font-bold">${Number(book.price).toFixed(2)}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-500">Description</div>
              <div className="text-gray-700">{book.description || <span className="text-gray-400 italic">No description</span>}</div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => router.push('/')} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={() => setConfirming(true)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      </div>

      {confirming && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to permanently delete "{book.title}"?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirming(false)} className="flex-1 bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={doDelete} className="flex-1 bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
