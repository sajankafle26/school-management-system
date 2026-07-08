import React from 'react';
import type { User } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

const allNavItems = [
  { section: 'MAIN NAVIGATION', items: [
    { label: 'Dashboard', icon: '📊', roles: ['admin', 'teacher', 'student', 'parent', 'staff', 'driver'] },
  ]},
  { section: 'MANAGEMENT', items: [
    { label: 'Students', icon: '🎓', roles: ['admin', 'teacher'] },
    { label: 'Teachers', icon: '👩‍🏫', roles: ['admin'] },
    { label: 'Parents', icon: '👪', roles: ['admin', 'teacher'] },
    { label: 'Staff', icon: '💼', roles: ['admin'] },
  ]},
  { section: 'ACADEMIC', items: [
    { label: 'Attendance', icon: '📋', roles: ['admin', 'teacher'] },
    { label: 'Results', icon: '📊', roles: ['admin', 'teacher'] },
    { label: 'Homework', icon: '📝', roles: ['admin', 'teacher'] },
    { label: 'Routines', icon: '📅', roles: ['admin', 'teacher'] },
    { label: 'Syllabus', icon: '📚', roles: ['admin', 'teacher'] },
    { label: 'Library', icon: '📖', roles: ['admin', 'teacher'] },
  ]},
  { section: 'FINANCE', items: [
    { label: 'Accounting', icon: '💰', roles: ['admin'] },
    { label: 'Fee Collection', icon: '💳', roles: ['admin'] },
  ]},
  { section: 'SERVICES', items: [
    { label: 'Transport', icon: '🚌', roles: ['admin'] },
    { label: 'SMS Services', icon: '📱', roles: ['admin', 'teacher'] },
    { label: 'Notices', icon: '📢', roles: ['admin', 'teacher', 'student', 'parent', 'staff', 'driver'] },
    { label: 'Events', icon: '🎉', roles: ['admin', 'teacher', 'student', 'parent', 'staff', 'driver'] },
  ]},
  { section: 'SETTINGS', items: [
    { label: 'Academic Settings', icon: '⚙️', roles: ['admin'] },
    { label: 'Website CMS', icon: '🌐', roles: ['admin'] },
  ]},
];

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, collapsed, onToggle }) => {
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
        {allNavItems.map((section, si) => {
          const visibleItems = section.items.filter(item => item.roles.includes(user.role));
          if (visibleItems.length === 0) return null;
          return (
            <div key={si} className="mb-2">
              {!collapsed && (
                <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {section.section}
                </div>
              )}
              {visibleItems.map((item, ii) => (
                <a
                  key={ii}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors group"
                  title={collapsed ? item.label : undefined}
                >
                  <span className="text-lg flex-shrink-0 w-6 text-center">{item.icon}</span>
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  )}
                </a>
              ))}
            </div>
          );
        })}
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
