'use client';

import { Suspense } from 'react';
import StudentsManagement from './StudentsManagement';

export default function StudentsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <StudentsManagement />
    </Suspense>
  );
}