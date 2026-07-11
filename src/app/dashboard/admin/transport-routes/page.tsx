'use client';

import { Suspense } from 'react';
import TransportRoutesManagement from './TransportRoutesManagement';

export default function TransportRoutesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <TransportRoutesManagement />
    </Suspense>
  );
}
