'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User } from '@/types';

export default function TeacherDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [myClasses] = useState(['Class 10', 'Class 9', 'Class 8']);
  const [recentHomework] = useState([
    { id: 1, subject: 'Math', topic: 'Algebra', date: '2026-07-05', status: 'Active' },
    { id: 2, subject: 'Science', topic: 'Physics Ch.3', date: '2026-07-03', status: 'Active' },
    { id: 3, subject: 'English', topic: 'Essay Writing', date: '2026-07-01', status: 'Completed' },
  ]);
  const [upcomingClasses] = useState([
    { time: '8:00 AM', subject: 'Math', class: 'Class 10', room: 'Room 5' },
    { time: '9:30 AM', subject: 'Science', class: 'Class 9', room: 'Room 3' },
    { time: '11:00 AM', subject: 'Math', class: 'Class 8', room: 'Room 5' },
  ]);

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <DashboardLayout allowedRoles={['teacher']}>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="bg-gradient-to-l from-green-600 to-emerald-700 rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
          <p className="text-green-100">Welcome back, {user?.name || 'Teacher'}</p>
          <p className="text-green-200 text-sm mt-1">Manage your classes and student progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'My Classes', value: myClasses.length, icon: '🏫', color: 'bg-green-500' },
            { label: 'Total Students', value: '45', icon: '👨‍🎓', color: 'bg-blue-500' },
            { label: 'Homework Given', value: '12', icon: '📝', color: 'bg-purple-500' },
            { label: 'Results Pending', value: '3', icon: '📊', color: 'bg-orange-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white text-lg`}>{stat.icon}</div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Today&apos;s Schedule</h2>
            <div className="space-y-3">
              {upcomingClasses.map((cls, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-14 text-center">
                    <div className="text-sm font-bold text-gray-900">{cls.time}</div>
                  </div>
                  <div className="w-1 h-10 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{cls.subject}</div>
                    <div className="text-sm text-gray-500">{cls.class} • {cls.room}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Homework */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Homework</h2>
              <button className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100">+ Add New</button>
            </div>
            <div className="space-y-3">
              {recentHomework.map(hw => (
                <div key={hw.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-semibold text-gray-900">{hw.subject}</div>
                    <div className="text-sm text-gray-500">{hw.topic}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    hw.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>{hw.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Mark Attendance', icon: '📋' },
              { label: 'Add Homework', icon: '📝' },
              { label: 'Enter Results', icon: '📊' },
              { label: 'View Students', icon: '👨‍🎓' },
              { label: 'Post Notice', icon: '📢' },
              { label: 'View Schedule', icon: '📅' },
            ].map((action, i) => (
              <button key={i} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors">
                <span className="text-xl">{action.icon}</span>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
