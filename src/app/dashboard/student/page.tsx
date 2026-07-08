'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User } from '@/types';

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [recentResults] = useState([
    { subject: 'Math', marks: 85, grade: 'A', term: 'Term 1' },
    { subject: 'Science', marks: 78, grade: 'B+', term: 'Term 1' },
    { subject: 'English', marks: 82, grade: 'A', term: 'Term 1' },
    { subject: 'Nepali', marks: 75, grade: 'B', term: 'Term 1' },
    { subject: 'Social Studies', marks: 80, grade: 'A-', term: 'Term 1' },
  ]);
  const [homework] = useState([
    { subject: 'Math', topic: 'Quadratic Equations', due: '2026-07-10', status: 'Pending' },
    { subject: 'Science', topic: 'Lab Report Ch.3', due: '2026-07-12', status: 'Pending' },
    { subject: 'English', topic: 'Essay Draft', due: '2026-07-08', status: 'Due Today' },
  ]);
  const [attendance] = useState({ present: 42, absent: 3, total: 45 });

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="bg-gradient-to-l from-purple-600 to-violet-700 rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-purple-100">Welcome back, {user?.name || 'Student'}</p>
          <p className="text-purple-200 text-sm mt-1">View your academic progress and assignments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Attendance', value: `${Math.round((attendance.present / attendance.total) * 100)}%`, icon: '📋', color: 'bg-green-500' },
            { label: 'Average Marks', value: '80', icon: '📊', color: 'bg-blue-500' },
            { label: 'Pending HW', value: '3', icon: '📝', color: 'bg-orange-500' },
            { label: 'Class Rank', value: '5th', icon: '🏆', color: 'bg-purple-500' },
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
          {/* Attendance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Attendance Summary</h2>
            <div className="flex items-center gap-8 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{attendance.present}</div>
                <div className="text-sm text-gray-500">Present</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">{attendance.absent}</div>
                <div className="text-sm text-gray-500">Absent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{attendance.total}</div>
                <div className="text-sm text-gray-500">Total Days</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: `${(attendance.present / attendance.total) * 100}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">{Math.round((attendance.present / attendance.total) * 100)}% attendance rate</p>
          </div>

          {/* Recent Results */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Results</h2>
            <div className="space-y-3">
              {recentResults.map((result, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-semibold text-gray-900">{result.subject}</div>
                    <div className="text-sm text-gray-500">{result.term}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">{result.marks}</div>
                    <div className={`text-sm font-medium ${
                      result.grade.startsWith('A') ? 'text-green-600' : 'text-blue-600'
                    }`}>{result.grade}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Homework */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Homework & Assignments</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {homework.map((hw, i) => (
              <div key={i} className={`p-4 rounded-2xl border-2 ${
                hw.status === 'Due Today' ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{hw.subject}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                    hw.status === 'Due Today' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-600'
                  }`}>{hw.status}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{hw.topic}</p>
                <p className="text-xs text-gray-400">Due: {hw.due}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'View Results', icon: '📊' },
              { label: 'Homework', icon: '📝' },
              { label: 'Notices', icon: '📢' },
              { label: 'Fee Details', icon: '💰' },
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
