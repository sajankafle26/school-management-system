'use client';

import { Suspense } from 'react';
import DriversManagement from './DriversManagement';

export default function DriversPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <DriversManagement />
    </Suspense>
  );
}