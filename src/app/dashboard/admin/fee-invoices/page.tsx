'use client';

import { Suspense } from 'react';
import FeeInvoicesManagement from './FeeInvoicesManagement';

export default function FeeInvoicesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <FeeInvoicesManagement />
    </Suspense>
  );
}