'use client';
import { Suspense } from 'react';
import RoutineManagement from './RoutineManagement';
export default function RoutinesPage() {
  return (
    <Suspense fallback={<div className="d-flex align-items-center justify-content-center p-5" style={{minHeight:'300px'}}>Loading...</div>}>
      <RoutineManagement />
    </Suspense>
  );
}
