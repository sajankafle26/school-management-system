'use client';

import { Suspense } from 'react';
import ResultsManagement from './ResultsManagement';

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <ResultsManagement />
    </Suspense>
  );
}