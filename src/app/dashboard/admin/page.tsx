'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User } from '@/types';
import Link from 'next/link';

const modules = [
  { name: 'Students', icon: '👨‍🎓', href: '/dashboard/admin?tab=students', color: 'from-blue-500 to-blue-700' },
  { name: 'Teachers', icon: '👩‍🏫', href: '/dashboard/admin?tab=teachers', color: 'from-green-500 to-green-700' },
  { name: 'Parents', icon: '👪', href: '/dashboard/admin?tab=parents', color: 'from-purple-500 to-purple-700' },
  { name: 'Staff', icon: '👨‍💼', href: '/dashboard/admin?tab=staff', color: 'from-indigo-500 to-indigo-700' },
  { name: 'Attendance', icon: '📋', href: '/dashboard/admin?tab=attendance', color: 'from-orange-500 to-red-600' },
  { name: 'Results', icon: '📊', href: '/dashboard/admin?tab=results', color: 'from-teal-500 to-cyan-700' },
  { name: 'Notices', icon: '📢', href: '/dashboard/admin?tab=notices', color: 'from-pink-500 to-rose-600' },
  { name: 'Events', icon: '📅', href: '/dashboard/admin?tab=events', color: 'from-amber-500 to-orange-600' },
  { name: 'Accounting', icon: '💰', href: '/dashboard/admin?tab=accounting', color: 'from-emerald-500 to-green-700' },
  { name: 'Library', icon: '📚', href: '/dashboard/admin?tab=library', color: 'from-violet-500 to-purple-700' },
  { name: 'Transport', icon: '🚌', href: '/dashboard/admin?tab=transport', color: 'from-yellow-500 to-amber-600' },
  { name: 'Website CMS', icon: '🌐', href: '/dashboard/admin?tab=website', color: 'from-cyan-500 to-blue-600' },
  { name: 'SMS Services', icon: '📱', href: '/dashboard/admin?tab=sms', color: 'from-rose-500 to-pink-600' },
  { name: 'Academic Settings', icon: '⚙️', href: '/dashboard/admin?tab=settings', color: 'from-gray-500 to-gray-700' },
];

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ students: 0, teachers: 0, parents: 0, staff: 0 });

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));

    Promise.all([
      fetch('/api/students').then(r => r.json()),
      fetch('/api/teachers').then(r => r.json()),
      fetch('/api/parents').then(r => r.json()),
      fetch('/api/staff').then(r => r.json()),
    ]).then(([students, teachers, parents, staff]) => {
      setStats({
        students: Array.isArray(students) ? students.length : 0,
        teachers: Array.isArray(teachers) ? teachers.length : 0,
        parents: Array.isArray(parents) ? parents.length : 0,
        staff: Array.isArray(staff) ? staff.length : 0,
      });
    }).catch(() => {});
  }, []);

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-l from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Welcome back, {user?.name || 'Administrator'}</p>
          <p className="text-blue-200 text-sm mt-1">Full system access and control panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: stats.students, icon: '👨‍🎓', color: 'bg-blue-500' },
            { label: 'Total Teachers', value: stats.teachers, icon: '👩‍🏫', color: 'bg-green-500' },
            { label: 'Total Parents', value: stats.parents, icon: '👪', color: 'bg-purple-500' },
            { label: 'Total Staff', value: stats.staff, icon: '👨‍💼', color: 'bg-amber-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white text-lg`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Module Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Management Modules</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {modules.map((mod, i) => (
              <Link
                key={i}
                href={mod.href}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${mod.color} rounded-xl flex items-center justify-center text-white text-xl mb-3 group-hover:scale-110 transition-transform`}>
                  {mod.icon}
                </div>
                <div className="font-semibold text-gray-900 text-sm">{mod.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {['Add Student', 'Add Teacher', 'Add Notice', 'Add Event', 'View Reports', 'Manage Fees'].map((action, i) => (
              <button key={i} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors">
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
