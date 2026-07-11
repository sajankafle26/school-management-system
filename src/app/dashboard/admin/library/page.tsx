'use client';

import { Suspense } from 'react';
import LibraryManagement from './LibraryManagement';

export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <LibraryManagement />
    </Suspense>
  );
}
