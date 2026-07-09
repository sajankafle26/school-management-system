'use client';

import { Suspense } from 'react';
import AdminDashboardContent from './AdminDashboardContent';

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}