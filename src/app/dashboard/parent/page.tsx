'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User } from '@/types';

export default function ParentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [children] = useState([
    { name: 'Aarav Sharma', class: 'Class 10', rollNo: 5, attendance: 93, average: 82 },
    { name: 'Anita Sharma', class: 'Class 7', rollNo: 12, attendance: 88, average: 79 },
  ]);
  const [feeSummary] = useState({ paid: 45000, pending: 15000, dueDate: '2026-07-15' });
  const [recentNotices] = useState([
    { id: 1, title: 'PTM Scheduled', date: '2026-07-12', type: 'Event' },
    { id: 2, title: 'Holiday Notice - July 15', date: '2026-07-10', type: 'General' },
    { id: 3, title: 'Exam Schedule Released', date: '2026-07-08', type: 'Academic' },
  ]);

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <DashboardLayout allowedRoles={['parent']}>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="bg-gradient-to-l from-orange-500 to-red-600 rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Parent Dashboard</h1>
          <p className="text-orange-100">Welcome back, {user?.name || 'Parent'}</p>
          <p className="text-orange-200 text-sm mt-1">Monitor your children&apos;s academic progress</p>
        </div>

        {/* Children Overview */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Children</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {children.map((child, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                    {child.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{child.name}</h3>
                    <p className="text-sm text-gray-500">{child.class} • Roll No: {child.rollNo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-5">
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="text-lg font-bold text-green-600">{child.attendance}%</div>
                    <div className="text-xs text-gray-500">Attendance</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-lg font-bold text-blue-600">{child.average}</div>
                    <div className="text-xs text-gray-500">Avg Marks</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <div className="text-lg font-bold text-purple-600">5th</div>
                    <div className="text-xs text-gray-500">Class Rank</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Fee Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Fee Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-gray-700">Total Paid</span>
                <span className="font-bold text-green-600">NPR {feeSummary.paid.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                <span className="text-gray-700">Pending Amount</span>
                <span className="font-bold text-red-600">NPR {feeSummary.pending.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <span className="text-gray-700">Next Due Date</span>
                <span className="font-bold text-orange-600">{feeSummary.dueDate}</span>
              </div>
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors mt-2">
                Pay Fee Now
              </button>
            </div>
          </div>

          {/* Recent Notices */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Notices</h2>
            <div className="space-y-3">
              {recentNotices.map(notice => (
                <div key={notice.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    notice.type === 'Event' ? 'bg-green-500' : notice.type === 'Academic' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{notice.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{notice.date}</div>
                  </div>
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
              { label: 'View Results', icon: '📊' },
              { label: 'Pay Fees', icon: '💰' },
              { label: 'Notices', icon: '📢' },
              { label: 'Contact Teacher', icon: '📞' },
              { label: 'Attendance', icon: '📋' },
              { label: 'School Events', icon: '📅' },
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
