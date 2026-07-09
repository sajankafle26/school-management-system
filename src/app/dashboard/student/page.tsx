'use client';

import { Suspense } from 'react';
import StudentDashboardContent from './StudentDashboardContent';

export default function StudentDashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <StudentDashboardContent />
    </Suspense>
  );
}