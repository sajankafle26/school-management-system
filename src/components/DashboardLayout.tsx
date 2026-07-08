'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import type { User, AcademicYear, WebsiteContent } from '../types';

interface DashboardLayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(null as unknown as WebsiteContent);
  const [loading, setLoading] = useState(true);
  const [isViewingWebsite, setIsViewingWebsite] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (!stored) { router.push('/login'); return; }
    const parsed = JSON.parse(stored);
    if (allowedRoles && !allowedRoles.includes(parsed.role)) {
      router.push('/login');
      return;
    }
    setUser(parsed);

    Promise.all([
      fetch('/api/academic-years').then(r => r.json()),
      fetch('/api/website-content').then(r => r.json()),
    ]).then(([years, content]) => {
      setAcademicYears(years);
      const current = years.find((y: AcademicYear) => y.isCurrent);
      setSelectedAcademicYear(current?.year || years[0]?.year || '');
      setWebsiteContent(content);
    }).catch(console.error).finally(() => setLoading(false));
  }, [router, allowedRoles]);

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    router.push('/login');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f6f9]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Loading Dashboard...</p>
      </div>
    </div>
  );

  if (!user) return null;

  if (isViewingWebsite && user.role === 'admin') {
    return (
      <div>
        <div className="bg-yellow-400 text-center py-2 text-sm font-semibold text-yellow-900">
          Preview Mode
          <button onClick={() => setIsViewingWebsite(false)} className="underline font-bold ml-2">Return to Dashboard</button>
        </div>
        <div className="text-center p-20 text-gray-600">
          <h2 className="text-2xl font-bold mb-2">Website Preview</h2>
          <p>Preview of the public website</p>
          <button onClick={() => setIsViewingWebsite(false)} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f4f6f9] overflow-hidden">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          onLogout={handleLogout}
          academicYears={academicYears}
          selectedAcademicYear={selectedAcademicYear}
          setSelectedAcademicYear={setSelectedAcademicYear}
          isViewingWebsite={isViewingWebsite}
          setIsViewingWebsite={setIsViewingWebsite}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f4f6f9] p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
