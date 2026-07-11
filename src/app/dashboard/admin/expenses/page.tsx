'use client';

import { Suspense } from 'react';
import ExpensesManagement from './ExpensesManagement';

export default function ExpensesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <ExpensesManagement />
    </Suspense>
  );
}