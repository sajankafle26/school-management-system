'use client';

import { useState, useEffect } from 'react';
import PublicWebsite from '../views/PublicWebsite';
import type { WebsiteContent } from '../types';

export default function HomePage() {
  const [content, setContent] = useState<WebsiteContent | null>(null);

  useEffect(() => {
    fetch('/api/website-content')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error('Failed to load website content', err));
  }, []);

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return <PublicWebsite content={content} />;
}
