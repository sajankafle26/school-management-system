'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User } from '@/types';

const recentActivities = [
  { id: 1, action: 'New student enrolled', user: 'Admin', time: '2 min ago', icon: '➕', color: 'bg-blue-500' },
  { id: 2, action: 'Fee payment received - NPR 16,700', user: 'Accountant', time: '15 min ago', icon: '💰', color: 'bg-green-500' },
  { id: 3, action: 'Notice published - Annual Sports Day', user: 'Admin', time: '1 hour ago', icon: '📢', color: 'bg-purple-500' },
  { id: 4, action: 'Results uploaded for Class 10', user: 'Teacher', time: '2 hours ago', icon: '📊', color: 'bg-orange-500' },
  { id: 5, action: 'Parent message received', user: 'Parent', time: '3 hours ago', icon: '💬', color: 'bg-pink-500' },
  { id: 6, action: 'Attendance marked - Class 10 A', user: 'Teacher', time: '4 hours ago', icon: '✅', color: 'bg-teal-500' },
];

const topStudents = [
  { name: 'Ram Thapa', class: '10 A', marks: 89.83, grade: 'A+' },
  { name: 'Sita Sharma', class: '10 A', marks: 80.17, grade: 'A' },
  { name: 'Gita Rai', class: '9 B', marks: 78.50, grade: 'B+' },
  { name: 'Nabin Gurung', class: '8 C', marks: 75.20, grade: 'B' },
  { name: 'Anjali Lama', class: '10 A', marks: 72.80, grade: 'B' },
];

const feeData = [
  { month: 'Baisakh', collected: 450000, pending: 120000 },
  { month: 'Jestha', collected: 380000, pending: 95000 },
  { month: 'Ashadh', collected: 420000, pending: 110000 },
  { month: 'Shrawan', collected: 350000, pending: 85000 },
];

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ students: 0, teachers: 0, parents: 0, staff: 0 });
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));

    Promise.all([
      fetch('/api/students').then(r => r.json()),
      fetch('/api/teachers').then(r => r.json()),
      fetch('/api/parents').then(r => r.json()),
      fetch('/api/staff').then(r => r.json()),
      fetch('/api/notices').then(r => r.json()),
    ]).then(([students, teachers, parents, staff, noticesData]) => {
      setStats({
        students: Array.isArray(students) ? students.length : 0,
        teachers: Array.isArray(teachers) ? teachers.length : 0,
        parents: Array.isArray(parents) ? parents.length : 0,
        staff: Array.isArray(staff) ? staff.length : 0,
      });
      setNotices(Array.isArray(noticesData) ? noticesData : []);
    }).catch(() => {});
  }, []);

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-4">
        {/* Content Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Admin'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              + Add New
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Export
            </button>
          </div>
        </div>

        {/* Small Box Stats - AdminLTE Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: stats.students, icon: '🎓', bg: 'bg-blue', change: '+12%', changeText: 'from last month' },
            { label: 'Total Teachers', value: stats.teachers, icon: '👩‍🏫', bg: 'bg-green', change: '+3%', changeText: 'from last month' },
            { label: 'Total Parents', value: stats.parents, icon: '👪', bg: 'bg-yellow', change: '+8%', changeText: 'from last month' },
            { label: 'Total Staff', value: stats.staff, icon: '💼', bg: 'bg-red', change: '+1%', changeText: 'from last month' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bg}-500 rounded-lg flex items-center justify-center text-white text-xl`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm">
                  <span className="text-green-500 font-semibold">{stat.change}</span>
                  <span className="text-gray-400 ml-1">{stat.changeText}</span>
                </div>
              </div>
              <div className={`h-1 ${stat.bg}-500`}></div>
            </div>
          ))}
        </div>

        {/* Main Content Row */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Recent Activity - 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Recent Activity</h3>
              <button className="text-sm text-blue-600 hover:underline">View All</button>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{activity.action}</p>
                      <p className="text-xs text-gray-400">by {activity.user}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Students - 1 col */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Top Students</h3>
              <button className="text-sm text-blue-600 hover:underline">View All</button>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {topStudents.map((student, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                      i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-500' : 'bg-gray-300'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{student.name}</p>
                      <p className="text-xs text-gray-400">{student.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">{student.marks}%</p>
                      <span className={`text-xs font-bold ${
                        student.grade.startsWith('A') ? 'text-green-600' : 'text-blue-600'
                      }`}>{student.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Fee Collection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Fee Collection Overview</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {feeData.map((fee, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{fee.month}</span>
                      <span className="text-sm text-gray-500">NPR {fee.collected.toLocaleString()} / {(fee.collected + fee.pending).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(fee.collected / (fee.collected + fee.pending)) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Notices */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Recent Notices</h3>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">+ Add</button>
            </div>
            <div className="p-4">
              {notices.length > 0 ? (
                <div className="space-y-3">
                  {notices.slice(0, 5).map((notice: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{notice.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notice.date} • {notice.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No notices found</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Access Modules */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Quick Access</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
              {[
                { name: 'Students', icon: '🎓', color: 'bg-blue-500' },
                { name: 'Teachers', icon: '👩‍🏫', color: 'bg-green-500' },
                { name: 'Parents', icon: '👪', color: 'bg-purple-500' },
                { name: 'Staff', icon: '💼', color: 'bg-indigo-500' },
                { name: 'Attendance', icon: '📋', color: 'bg-orange-500' },
                { name: 'Results', icon: '📊', color: 'bg-teal-500' },
                { name: 'Notices', icon: '📢', color: 'bg-pink-500' },
                { name: 'Events', icon: '🎉', color: 'bg-amber-500' },
                { name: 'Accounting', icon: '💰', color: 'bg-emerald-500' },
                { name: 'Library', icon: '📖', color: 'bg-violet-500' },
                { name: 'Transport', icon: '🚌', color: 'bg-yellow-500' },
                { name: 'SMS', icon: '📱', color: 'bg-rose-500' },
                { name: 'Website', icon: '🌐', color: 'bg-cyan-500' },
                { name: 'Settings', icon: '⚙️', color: 'bg-gray-500' },
              ].map((mod, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-11 h-11 ${mod.color} rounded-lg flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform shadow-sm`}>
                    {mod.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-600 text-center">{mod.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
