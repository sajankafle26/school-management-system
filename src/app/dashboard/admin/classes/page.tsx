'use client';
import { Suspense } from 'react';
import ClassesManagement from './ClassesManagement';
export default function ClassesPage() {
  return (
    <Suspense fallback={<div className="d-flex align-items-center justify-content-center p-5" style={{minHeight:'300px'}}>Loading...</div>}>
      <ClassesManagement />
    </Suspense>
  );
}
