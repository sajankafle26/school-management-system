'use client';

import { Suspense } from 'react';
import EventsManagement from './EventsManagement';

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <EventsManagement />
    </Suspense>
  );
}