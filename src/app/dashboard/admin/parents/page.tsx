'use client';

import { Suspense } from 'react';
import ParentsManagement from './ParentsManagement';

export default function ParentsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <ParentsManagement />
    </Suspense>
  );
}