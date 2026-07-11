'use client';

import { Suspense } from 'react';
import GradesManagement from './GradesManagement';

export default function GradesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <GradesManagement />
    </Suspense>
  );
}
