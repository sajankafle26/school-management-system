'use client';

import { Suspense } from 'react';
import ExamsManagement from './ExamsManagement';

export default function ExamsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <ExamsManagement />
    </Suspense>
  );
}
