import React from 'react';
import type { Page, User } from '../types';
import { DashboardIcon, StudentsIcon, TeachersIcon, AttendanceIcon, NoticesIcon, EventsIcon, ResultsIcon, AcademicsIcon, FinancialsIcon, LogoutIcon, ParentIcon, LibraryIcon, SmsIcon, RoutineIcon, HomeworkIcon, BriefcaseIcon, SettingsIcon, GlobeIcon, BusIcon } from './icons';

interface SidebarProps {
  currentPage?: Page;
  setCurrentPage?: (page: Page) => void;
  user: User;
  onLogout: () => void;
}

const NavLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white' : ''}`}
    >
      {icon}
      <span className="mx-4 font-medium">{label}</span>
    </a>
  );
};

const allNavItems: { page: Page; label: string; icon: React.ReactNode; roles: User['role'][] }[] = [
    { page: 'Dashboard', label: 'Dashboard', icon: <DashboardIcon />, roles: ['admin', 'teacher', 'student', 'parent', 'staff', 'driver'] },
    { page: 'Students', label: 'Students', icon: <StudentsIcon />, roles: ['admin', 'teacher'] },
    { page: 'Parents', label: 'Parents', icon: <ParentIcon />, roles: ['admin', 'teacher'] },
    { page: 'Teachers', label: 'Teachers', icon: <TeachersIcon />, roles: ['admin'] },
    { page: 'Staff', label: 'Staff', icon: <BriefcaseIcon />, roles: ['admin'] },
    { page: 'Attendance', label: 'Attendance', icon: <AttendanceIcon />, roles: ['admin', 'teacher'] },
    { page: 'Results', label: 'Results', icon: <ResultsIcon />, roles: ['admin', 'teacher'] },
    { page: 'Academics', label: 'Syllabus', icon: <AcademicsIcon />, roles: ['admin', 'teacher'] },
    { page: 'Routines', label: 'Routines', icon: <RoutineIcon />, roles: ['admin', 'teacher'] },
    { page: 'Homework', label: 'Homework', icon: <HomeworkIcon />, roles: ['admin', 'teacher'] },
    { page: 'Library', label: 'Library', icon: <LibraryIcon />, roles: ['admin', 'teacher'] },
    { page: 'Accounting', label: 'Accounting', icon: <FinancialsIcon />, roles: ['admin'] },
    { page: 'Transport', label: 'Transport', icon: <BusIcon />, roles: ['admin'] },
    { page: 'SMS Services', label: 'SMS Services', icon: <SmsIcon />, roles: ['admin', 'teacher'] },
    { page: 'Notices', label: 'Notices', icon: <NoticesIcon />, roles: ['admin', 'teacher', 'student', 'parent', 'staff', 'driver'] },
    { page: 'Academic Calendar', label: 'Academic Calendar', icon: <EventsIcon />, roles: ['admin', 'teacher', 'student', 'parent', 'staff', 'driver'] },
    { page: 'Academic Settings', label: 'Academic Settings', icon: <SettingsIcon />, roles: ['admin'] },
    { page: 'Website CMS', label: 'Website CMS', icon: <GlobeIcon />, roles: ['admin'] },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, user, onLogout }) => {
  
  const navItems = allNavItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-8 bg-white border-l overflow-y-auto">
      <a href="#" className="flex items-center px-4">
        <img className="w-auto h-8" src="https://emojicdn.elk.sh/🇳🇵" alt="Nepal Flag" />
        <span className="mr-3 text-2xl font-bold text-gray-800 font-nepali">विद्यालय</span>
      </a>

      <div className="flex flex-col justify-between flex-1 mt-8">
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.page}
              icon={item.icon}
              label={item.label}
              isActive={currentPage === item.page}
              onClick={() => setCurrentPage?.(item.page)}
            />
          ))}
        </nav>
        
        <div>
           <NavLink
              icon={<LogoutIcon />}
              label="Logout"
              isActive={false}
              onClick={onLogout}
            />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;