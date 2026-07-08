'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User } from '@/types';

const children = [
  {
    name: 'Aarav Sharma',
    class: '10 A',
    rollNo: 5,
    photo: 'https://picsum.photos/seed/child1/100',
    attendance: 93,
    avgMarks: 82,
    rank: '5th',
    results: [
      { subject: 'Math', marks: 85, grade: 'A' },
      { subject: 'Science', marks: 78, grade: 'B+' },
      { subject: 'English', marks: 82, grade: 'A' },
    ],
  },
  {
    name: 'Anita Sharma',
    class: '7 B',
    rollNo: 12,
    photo: 'https://picsum.photos/seed/child2/100',
    attendance: 88,
    avgMarks: 79,
    rank: '8th',
    results: [
      { subject: 'Math', marks: 75, grade: 'B' },
      { subject: 'Science', marks: 80, grade: 'A-' },
      { subject: 'English', marks: 77, grade: 'B+' },
    ],
  },
];

const feeSummary = { paid: 45000, pending: 15000, dueDate: '2026-07-15', nextInstallment: 8000 };

const notices = [
  { title: 'Parent-Teacher Meeting Scheduled', date: '2026-07-12', type: 'Event', priority: 'High' },
  { title: 'Holiday Notice - July 15', date: '2026-07-10', type: 'General', priority: 'Low' },
  { title: 'Exam Schedule Released', date: '2026-07-08', type: 'Academic', priority: 'Medium' },
  { title: 'School Bus Route Change', date: '2026-07-06', type: 'Transport', priority: 'Medium' },
];

const messages = [
  { from: 'Hari Prasad Adhikari', subject: 'Aarav - Math Performance Update', time: '2 hours ago', read: false },
  { from: 'School Admin', subject: 'Fee Reminder - Installment Due', time: '1 day ago', read: true },
  { from: 'Shanti Devi Shrestha', subject: 'Science Project Feedback', time: '3 days ago', read: true },
];

export default function ParentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChild, setSelectedChild] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const child = children[selectedChild];

  return (
    <DashboardLayout allowedRoles={['parent']}>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Parent Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, {user?.name || 'Parent'}</p>
          </div>
          <div className="flex items-center gap-3">
            {children.map((c, i) => (
              <button
                key={i}
                onClick={() => setSelectedChild(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedChild === i ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
                  {c.name.charAt(0)}
                </div>
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Child Stats */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="relative flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
              {child.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{child.name}</h2>
              <p className="text-orange-100">{child.class} • Roll No: {child.rollNo}</p>
              <div className="flex gap-6 mt-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="text-xs text-orange-200">Attendance</div>
                  <div className="text-xl font-bold">{child.attendance}%</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="text-xs text-orange-200">Average</div>
                  <div className="text-xl font-bold">{child.avgMarks}%</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="text-xs text-orange-200">Rank</div>
                  <div className="text-xl font-bold">{child.rank}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Attendance', value: `${child.attendance}%`, icon: '📋', color: 'from-green-500 to-green-600' },
            { label: 'Avg Marks', value: `${child.avgMarks}%`, icon: '📊', color: 'from-blue-500 to-blue-600' },
            { label: 'Fee Pending', value: `NPR ${feeSummary.pending.toLocaleString()}`, icon: '💰', color: 'from-orange-500 to-red-500' },
            { label: 'Unread Messages', value: '1', icon: '💬', color: 'from-purple-500 to-purple-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-100">
            <div className="flex gap-1 p-1">
              {['overview', 'results', 'fees', 'notices', 'messages'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Results */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Results</h3>
                  <div className="space-y-3">
                    {child.results.map((result, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-semibold text-gray-800">{result.subject}</div>
                          <div className="text-sm text-gray-500">Mid Terminal</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-800">{result.marks}</div>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            result.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                            result.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>{result.grade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Notices */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Notices</h3>
                  <div className="space-y-3">
                    {notices.map((notice, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-xl border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-800 text-sm">{notice.title}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            notice.priority === 'High' ? 'bg-red-100 text-red-700' :
                            notice.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>{notice.priority}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{notice.date} • {notice.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {activeTab === 'results' && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Academic Results - {child.name}</h3>
                <div className="overflow-hidden rounded-xl border border-gray-100">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Marks</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {child.results.map((result, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800">{result.subject}</td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-800">{result.marks}/100</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              result.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                              result.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>{result.grade}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${result.marks}%` }}></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Fees */}
            {activeTab === 'fees' && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Fee Summary</h3>
                  <div className="space-y-4">
                    <div className="p-5 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Total Paid</span>
                        <span className="text-xl font-bold text-green-600">NPR {feeSummary.paid.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="p-5 bg-red-50 rounded-xl border border-red-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Pending Amount</span>
                        <span className="text-xl font-bold text-red-600">NPR {feeSummary.pending.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="p-5 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Next Due Date</span>
                        <span className="font-bold text-orange-600">{feeSummary.dueDate}</span>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
                      Pay Fee Now - NPR {feeSummary.nextInstallment.toLocaleString()}
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Payment History</h3>
                  <div className="space-y-3">
                    {[
                      { date: '2026-06-15', amount: 15000, method: 'Online', status: 'Paid' },
                      { date: '2026-04-10', amount: 15000, method: 'Cash', status: 'Paid' },
                      { date: '2026-01-20', amount: 15000, method: 'Online', status: 'Paid' },
                    ].map((payment, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <div className="text-sm font-semibold text-gray-800">NPR {payment.amount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{payment.date} • {payment.method}</div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">{payment.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notices */}
            {activeTab === 'notices' && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">School Notices</h3>
                <div className="space-y-3">
                  {notices.map((notice, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl border-l-4 border-blue-500">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800">{notice.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            notice.type === 'Academic' ? 'bg-blue-100 text-blue-700' :
                            notice.type === 'Event' ? 'bg-green-100 text-green-700' :
                            notice.type === 'Transport' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>{notice.type}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            notice.priority === 'High' ? 'bg-red-100 text-red-700' :
                            notice.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>{notice.priority}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notice.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {activeTab === 'messages' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Messages from Teachers</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">+ New Message</button>
                </div>
                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${!msg.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm">
                            {msg.from.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-sm">{msg.from}</div>
                            <div className="text-xs text-gray-500">{msg.time}</div>
                          </div>
                        </div>
                        {!msg.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <p className="text-sm text-gray-700 mt-2 ml-13">{msg.subject}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
