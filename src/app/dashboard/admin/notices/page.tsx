'use client';

import { Suspense } from 'react';
import NoticesManagement from './NoticesManagement';

export default function NoticesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <NoticesManagement />
    </Suspense>
  );
}