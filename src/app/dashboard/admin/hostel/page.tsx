'use client';

import { Suspense } from 'react';
import HostelManagement from './HostelManagement';

export default function HostelPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <HostelManagement />
    </Suspense>
  );
}
