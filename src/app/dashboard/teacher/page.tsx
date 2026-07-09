'use client';

import { Suspense } from 'react';
import TeacherDashboardContent from './TeacherDashboardContent';

export default function TeacherDashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <TeacherDashboardContent />
    </Suspense>
  );
}