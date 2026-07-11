'use client';

import { Suspense } from 'react';
import OnlineAdmissionsManagement from './OnlineAdmissionsManagement';

export default function OnlineAdmissionsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <OnlineAdmissionsManagement />
    </Suspense>
  );
}
