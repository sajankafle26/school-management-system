'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { User } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navConfig: Record<string, { section: string; items: { label: string; icon: string; path: string; tab?: string }[] }[]> = {
  admin: [
    { section: 'MAIN NAVIGATION', items: [
      { label: 'Dashboard', icon: '📊', path: '/dashboard/admin', tab: 'overview' },
    ]},
    { section: 'MANAGEMENT', items: [
      { label: 'Students', icon: '🎓', path: '/dashboard/admin', tab: 'students' },
      { label: 'Teachers', icon: '👩‍🏫', path: '/dashboard/admin', tab: 'teachers' },
      { label: 'Parents', icon: '👪', path: '/dashboard/admin', tab: 'parents' },
      { label: 'Staff', icon: '💼', path: '/dashboard/admin', tab: 'staff' },
    ]},
    { section: 'ACADEMIC', items: [
      { label: 'Attendance', icon: '📋', path: '/dashboard/admin', tab: 'attendance' },
      { label: 'Results', icon: '📊', path: '/dashboard/admin', tab: 'results' },
      { label: 'Homework', icon: '📝', path: '/dashboard/admin', tab: 'homework' },
      { label: 'Routines', icon: '📅', path: '/dashboard/admin', tab: 'routines' },
      { label: 'Syllabus', icon: '📚', path: '/dashboard/admin', tab: 'syllabus' },
      { label: 'Library', icon: '📖', path: '/dashboard/admin', tab: 'library' },
    ]},
    { section: 'FINANCE', items: [
      { label: 'Accounting', icon: '💰', path: '/dashboard/admin', tab: 'accounting' },
      { label: 'Fee Collection', icon: '💳', path: '/dashboard/admin', tab: 'fees' },
    ]},
    { section: 'SERVICES', items: [
      { label: 'Transport', icon: '🚌', path: '/dashboard/admin', tab: 'transport' },
      { label: 'SMS Services', icon: '📱', path: '/dashboard/admin', tab: 'sms' },
      { label: 'Notices', icon: '📢', path: '/dashboard/admin', tab: 'notices' },
      { label: 'Events', icon: '🎉', path: '/dashboard/admin', tab: 'events' },
    ]},
    { section: 'SETTINGS', items: [
      { label: 'Academic Settings', icon: '⚙️', path: '/dashboard/admin', tab: 'settings' },
      { label: 'Website CMS', icon: '🌐', path: '/dashboard/admin', tab: 'website' },
    ]},
  ],
  teacher: [
    { section: 'MAIN NAVIGATION', items: [
      { label: 'Dashboard', icon: '📊', path: '/dashboard/teacher', tab: 'overview' },
    ]},
    { section: 'ACADEMIC', items: [
      { label: 'Attendance', icon: '📋', path: '/dashboard/teacher', tab: 'attendance' },
      { label: 'Results', icon: '📊', path: '/dashboard/teacher', tab: 'results' },
      { label: 'Homework', icon: '📝', path: '/dashboard/teacher', tab: 'homework' },
      { label: 'Routines', icon: '📅', path: '/dashboard/teacher', tab: 'routines' },
      { label: 'Syllabus', icon: '📚', path: '/dashboard/teacher', tab: 'syllabus' },
      { label: 'Library', icon: '📖', path: '/dashboard/teacher', tab: 'library' },
    ]},
    { section: 'SERVICES', items: [
      { label: 'Notices', icon: '📢', path: '/dashboard/teacher', tab: 'notices' },
      { label: 'Events', icon: '🎉', path: '/dashboard/teacher', tab: 'events' },
      { label: 'SMS Services', icon: '📱', path: '/dashboard/teacher', tab: 'sms' },
    ]},
  ],
  student: [
    { section: 'MAIN NAVIGATION', items: [
      { label: 'Dashboard', icon: '📊', path: '/dashboard/student', tab: 'overview' },
    ]},
    { section: 'ACADEMIC', items: [
      { label: 'Results', icon: '📊', path: '/dashboard/student', tab: 'results' },
      { label: 'Homework', icon: '📝', path: '/dashboard/student', tab: 'homework' },
      { label: 'Attendance', icon: '📋', path: '/dashboard/student', tab: 'attendance' },
      { label: 'Routines', icon: '📅', path: '/dashboard/student', tab: 'routines' },
      { label: 'Syllabus', icon: '📚', path: '/dashboard/student', tab: 'syllabus' },
      { label: 'Library', icon: '📖', path: '/dashboard/student', tab: 'library' },
    ]},
    { section: 'SERVICES', items: [
      { label: 'Notices', icon: '📢', path: '/dashboard/student', tab: 'notices' },
      { label: 'Events', icon: '🎉', path: '/dashboard/student', tab: 'events' },
      { label: 'Fee Status', icon: '💰', path: '/dashboard/student', tab: 'fees' },
    ]},
  ],
  parent: [
    { section: 'MAIN NAVIGATION', items: [
      { label: 'Dashboard', icon: '📊', path: '/dashboard/parent', tab: 'overview' },
    ]},
    { section: 'CHILDREN', items: [
      { label: 'Results', icon: '📊', path: '/dashboard/parent', tab: 'results' },
      { label: 'Attendance', icon: '📋', path: '/dashboard/parent', tab: 'attendance' },
      { label: 'Homework', icon: '📝', path: '/dashboard/parent', tab: 'homework' },
    ]},
    { section: 'FINANCE', items: [
      { label: 'Fee Details', icon: '💰', path: '/dashboard/parent', tab: 'fees' },
      { label: 'Payment History', icon: '🧾', path: '/dashboard/parent', tab: 'payments' },
    ]},
    { section: 'SERVICES', items: [
      { label: 'Notices', icon: '📢', path: '/dashboard/parent', tab: 'notices' },
      { label: 'Events', icon: '🎉', path: '/dashboard/parent', tab: 'events' },
      { label: 'Messages', icon: '💬', path: '/dashboard/parent', tab: 'messages' },
    ]},
  ],
};

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, collapsed, onToggle }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const navSections = navConfig[user.role] || [];

  const handleNavClick = (path: string, tab?: string) => {
    if (tab) {
      router.push(`${path}?tab=${tab}`);
    } else {
      router.push(path);
    }
  };

  const isActive = (path: string, tab?: string) => {
    if (pathname !== path) return false;
    if (!tab) return currentTab === 'overview';
    return currentTab === tab;
  };

  return (
    <aside className={`${collapsed ? 'w-[70px]' : 'w-64'} h-screen bg-[#343a40] flex flex-col transition-all duration-300 overflow-hidden flex-shrink-0`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 flex-shrink-0">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          🇳🇵
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="text-white font-bold text-sm whitespace-nowrap">Shree Adarsha</span>
            <p className="text-gray-400 text-[10px] whitespace-nowrap">School Management</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        {navSections.map((section, si) => (
          <div key={si} className="mb-2">
            {!collapsed && (
              <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {section.section}
              </div>
            )}
            {section.items.map((item, ii) => {
              const active = isActive(item.path, item.tab);
              return (
                <button
                  key={ii}
                  onClick={() => handleNavClick(item.path, item.tab)}
                  className={`flex items-center gap-3 px-4 py-2.5 transition-colors w-full text-left ${
                    active
                      ? 'bg-blue-500/20 text-blue-300 border-r-2 border-blue-500'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="text-lg flex-shrink-0 w-6 text-center">{item.icon}</span>
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  )}
                  {active && !collapsed && <span className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full" />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-3 flex-shrink-0">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden">
            {user.profilePic ? (
              <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          )}
        </div>
        <button
          onClick={onLogout}
          className={`mt-3 w-full flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-lg transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <span>🚪</span>
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;