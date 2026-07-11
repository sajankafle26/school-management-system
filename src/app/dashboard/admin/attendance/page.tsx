'use client';

import { Suspense } from 'react';
import AttendanceManagement from './AttendanceManagement';

export default function AttendancePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <AttendanceManagement />
    </Suspense>
  );
}
