'use client';

import { Suspense } from 'react';
import QuestionBankManagement from './QuestionBankManagement';

export default function QuestionBankPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <QuestionBankManagement />
    </Suspense>
  );
}
