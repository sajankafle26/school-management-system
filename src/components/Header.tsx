import React from 'react';
import type { User, AcademicYear } from '../types';
import { GlobeIcon } from './icons';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    academicYears: AcademicYear[];
    selectedAcademicYear: string;
    setSelectedAcademicYear: (year: string) => void;
    isViewingWebsite: boolean;
    setIsViewingWebsite: (viewing: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, academicYears, selectedAcademicYear, setSelectedAcademicYear, setIsViewingWebsite }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200">
      <div className="flex items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Shree Adarsha Secondary School</h2>
      </div>

      <div className="flex items-center">
         {user.role === 'admin' && (
             <button 
                onClick={() => setIsViewingWebsite(true)}
                className="ml-6 flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
             >
                <GlobeIcon className="w-5 h-5 ml-2" />
                View Website
             </button>
        )}
         <div className="ml-6">
            <label htmlFor="academic-year-select" className="sr-only">Academic Year</label>
            <select
                id="academic-year-select"
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
                {academicYears.map(year => (
                    <option key={year.year} value={year.year}>
                        {year.year} {year.isCurrent && '(Current)'}
                    </option>
                ))}
            </select>
        </div>
        <button className="flex mx-4 text-gray-600 focus:outline-none">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center">
            <div className="text-left ml-4">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <div className="relative">
                <button className="relative z-10 block w-10 h-10 overflow-hidden rounded-full shadow focus:outline-none">
                    <img className="object-cover w-full h-full" src={user.profilePic} alt="Your avatar" />
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;