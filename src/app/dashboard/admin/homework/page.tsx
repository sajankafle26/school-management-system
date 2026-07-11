'use client';

import { Suspense } from 'react';
import HomeworkManagement from './HomeworkManagement';

export default function HomeworkPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <HomeworkManagement />
    </Suspense>
  );
}
