'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import type { User, AcademicYear, WebsiteContent } from '../types';

interface DashboardLayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
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
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#f4f6f9' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-600 fw-medium" style={{ fontSize: '0.95rem' }}>Loading Dashboard...</p>
      </div>
    </div>
  );

  if (!user) return null;

  if (isViewingWebsite && user.role === 'admin') {
    return (
      <div>
        <div className="bg-yellow-400 text-center py-2 text-sm fw-semibold" style={{ color: '#856404' }}>
          Preview Mode
          <button onClick={() => setIsViewingWebsite(false)} className="text-decoration-underline fw-bold ms-2 bg-transparent border-0">Return to Dashboard</button>
        </div>
        <div className="text-center p-5" style={{ color: '#6c757d' }}>
          <h2 className="fs-3 fw-bold mb-2">Website Preview</h2>
          <p>Preview of the public website</p>
          <button onClick={() => setIsViewingWebsite(false)} className="mt-3 px-4 py-2 btn text-white border-0 rounded-1" style={{ backgroundColor: '#007bff' }}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const breadcrumbMap: Record<string, string> = {
    '/dashboard/admin': 'Dashboard',
    '/dashboard/admin/students': 'Students',
    '/dashboard/admin/teachers': 'Teachers',
    '/dashboard/admin/parents': 'Parents',
    '/dashboard/admin/staff': 'Staff',
    '/dashboard/admin/drivers': 'Drivers',
    '/dashboard/admin/class-sections': 'Class Sections',
    '/dashboard/admin/academic-years': 'Academic Years',
    '/dashboard/admin/notices': 'Notices',
    '/dashboard/admin/events': 'Events',
    '/dashboard/admin/results': 'Results',
    '/dashboard/admin/fee-invoices': 'Fee Invoices',
    '/dashboard/admin/expenses': 'Expenses',
    '/dashboard/admin/subjects': 'Subjects',
  };

  const currentPage = breadcrumbMap[pathname] || 'Dashboard';

  return (
    <div className="app-wrapper d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Header
        user={user}
        onLogout={handleLogout}
        academicYears={academicYears}
        selectedAcademicYear={selectedAcademicYear}
        setSelectedAcademicYear={setSelectedAcademicYear}
        isViewingWebsite={isViewingWebsite}
        setIsViewingWebsite={setIsViewingWebsite}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPage={currentPage}
      />
      <div className="d-flex flex-fill overflow-hidden">
        <Sidebar
          user={user}
          onLogout={handleLogout}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="app-main d-flex flex-column flex-fill overflow-auto" style={{ backgroundColor: '#f4f6f9' }}>
          <div className="app-content-header py-3">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-sm-6">
                  <h1 className="mb-0 fs-4 fw-semibold" style={{ color: '#1f2d3d' }}>{currentPage}</h1>
                </div>
                <div className="col-sm-6">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb float-sm-end mb-0" style={{ fontSize: '0.875rem' }}>
                      <li className="breadcrumb-item"><a href="/dashboard/admin" style={{ color: '#007bff' }}>Home</a></li>
                      <li className="breadcrumb-item active" aria-current="page" style={{ color: '#6c757d' }}>{currentPage}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div className="app-content pb-4">
            <div className="container-fluid">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}