'use client';

import { Suspense } from 'react';
import ClassSectionsManagement from './ClassSectionsManagement';

export default function ClassSectionsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[500px]">Loading...</div>}>
      <ClassSectionsManagement />
    </Suspense>
  );
}