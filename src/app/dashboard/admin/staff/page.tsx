'use client';

import { Suspense } from 'react';
import StaffManagement from './StaffManagement';

export default function StaffPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <StaffManagement />
    </Suspense>
  );
}