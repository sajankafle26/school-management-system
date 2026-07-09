'use client';

import { Suspense } from 'react';
import ParentDashboardContent from './ParentDashboardContent';

export default function ParentDashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <ParentDashboardContent />
    </Suspense>
  );
}