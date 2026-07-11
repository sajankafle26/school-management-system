'use client';

import { Suspense } from 'react';
import AcademicYearsManagement from './AcademicYearsManagement';

export default function AcademicYearsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <AcademicYearsManagement />
    </Suspense>
  );
}