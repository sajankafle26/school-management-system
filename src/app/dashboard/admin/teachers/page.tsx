'use client';

import { Suspense } from 'react';
import TeachersManagement from './TeachersManagement';

export default function TeachersPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <TeachersManagement />
    </Suspense>
  );
}