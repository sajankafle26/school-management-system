'use client';

import { useState, useEffect } from 'react';
import type { User, AcademicYear, WebsiteContent, FeeInvoice } from '../../types';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Dashboard from '../../views/Dashboard';
import Students from '../../views/Students';
import Parents from '../../views/Parents';
import Teachers from '../../views/Teachers';
import Staff from '../../views/Staff';
import Notices from '../../views/Notices';
import Events from '../../views/Events';
import Attendance from '../../views/Attendance';
import Results from '../../views/Results';
import Academics from '../../views/Academics';
import Accounting from '../../views/Accounting';
import Library from '../../views/Library';
import Transport from '../../views/Transport';
import SmsServices from '../../views/SmsServices';
import Routines from '../../views/Routines';
import Homework from '../../views/Homework';
import AcademicSettings from '../../views/AcademicSettings';
import WebsiteCMS from '../../views/WebsiteCMS';
import PublicWebsite from '../../views/PublicWebsite';

type Page = 'Dashboard' | 'Students' | 'Parents' | 'Teachers' | 'Staff' | 'Attendance' | 'Notices' | 'Academic Calendar' | 'Results' | 'Academics' | 'Accounting' | 'Library' | 'SMS Services' | 'Routines' | 'Homework' | 'Academic Settings' | 'Website CMS' | 'Transport';

export default function DashboardPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(null as unknown as WebsiteContent);
  const [invoices, setInvoices] = useState<FeeInvoice[]>([]);
  const [isViewingWebsite, setIsViewingWebsite] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (!stored) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(stored));

    fetch('/api/academic-years')
      .then(res => res.json())
      .then((data: AcademicYear[]) => {
        setAcademicYears(data);
        const current = data.find(y => y.isCurrent);
        setSelectedAcademicYear(current?.year || (data[0]?.year || ''));
      })
      .catch(console.error);

    fetch('/api/website-content')
      .then(res => res.json())
      .then(setWebsiteContent)
      .catch(console.error);

    fetch('/api/fee-invoices')
      .then(res => res.json())
      .then(setInvoices)
      .catch(console.error);
  }, [router]);

  if (!user || !websiteContent) {
    return <div className="flex items-center justify-center h-full text-gray-600">Loading...</div>;
  }

  if (isViewingWebsite && user.role === 'admin') {
    return (
      <PublicWebsite
        content={websiteContent}
        isPreview
        setIsViewingWebsite={setIsViewingWebsite}
      />
    );
  }

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    router.push('/');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard user={user} selectedAcademicYear={selectedAcademicYear} invoices={invoices} setInvoices={setInvoices} />;
      case 'Students':
        return <Students selectedAcademicYear={selectedAcademicYear} invoices={invoices} />;
      case 'Parents':
        return <Parents />;
      case 'Teachers':
        return <Teachers selectedAcademicYear={selectedAcademicYear} />;
      case 'Staff':
        return <Staff />;
      case 'Attendance':
        return <Attendance selectedAcademicYear={selectedAcademicYear} />;
      case 'Results':
        return <Results selectedAcademicYear={selectedAcademicYear} />;
      case 'Academics':
        return <Academics />;
      case 'Routines':
        return <Routines user={user} selectedAcademicYear={selectedAcademicYear} />;
      case 'Homework':
        return <Homework selectedAcademicYear={selectedAcademicYear} />;
      case 'Library':
        return <Library selectedAcademicYear={selectedAcademicYear} />;
      case 'Accounting':
        return <Accounting selectedAcademicYear={selectedAcademicYear} invoices={invoices} setInvoices={setInvoices} />;
      case 'Transport':
        return <Transport selectedAcademicYear={selectedAcademicYear} />;
      case 'SMS Services':
        return <SmsServices selectedAcademicYear={selectedAcademicYear} />;
      case 'Notices':
        return <Notices selectedAcademicYear={selectedAcademicYear} />;
      case 'Academic Calendar':
        return <Events selectedAcademicYear={selectedAcademicYear} />;
      case 'Academic Settings':
        return <AcademicSettings academicYears={academicYears} setAcademicYears={setAcademicYears} />;
      case 'Website CMS':
        return <WebsiteCMS content={websiteContent} setContent={setWebsiteContent} />;
      default:
        return <Dashboard user={user} selectedAcademicYear={selectedAcademicYear} invoices={invoices} setInvoices={setInvoices} />;
    }
  };

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
          currentPage="Dashboard"
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f4f6f9] p-4">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
