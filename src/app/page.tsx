'use client';

import { useState, useEffect } from 'react';
import PublicWebsite from '../views/PublicWebsite';
import type { WebsiteContent } from '../types';

export default function HomePage() {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/website-content')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => setContent(data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-6">Unable to load website content. Please try again.</p>
        <button onClick={() => { setError(false); window.location.reload(); }} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all">
          Retry
        </button>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <p className="text-xl text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  return <PublicWebsite content={content} />;
}
