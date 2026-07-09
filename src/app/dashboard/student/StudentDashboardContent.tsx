'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import type { User } from '@/types';

const studentTabContent: Record<string, React.ReactNode> = {
  overview: (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="font-bold text-gray-800 mb-4">Attendance History</h3>
          <div className="space-y-2">
            {[
              { month: 'Shrawan', present: 20, absent: 2, total: 22 },
              { month: 'Ashadh', present: 18, absent: 3, total: 21 },
              { month: 'Jestha', present: 19, absent: 1, total: 20 },
              { month: 'Baisakh', present: 21, absent: 1, total: 22 },
            ].map((month, i) => (
              <div key={i} className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                <div className="w-16 font-semibold text-gray-800 text-sm">{month.month}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-green-600 font-medium">{month.present} present</span>
                    <span className="text-xs text-red-500">{month.absent} absent</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(month.present / month.total) * 100}%` }}></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-700">{Math.round((month.present / month.total) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="font-bold text-gray-800 mb-4">Recent Notices</h3>
          <div className="space-y-2">
            {[
              { title: 'Mid-Term Exam Schedule Released', date: '2026-07-08', type: 'Academic' },
              { title: 'Holiday - July 15', date: '2026-07-10', type: 'General' },
              { title: 'PTM Scheduled - July 12', date: '2026-07-12', type: 'Event' },
            ].map((notice, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800 text-sm">{notice.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    notice.type === 'Academic' ? 'bg-blue-100 text-blue-700' :
                    notice.type === 'Event' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{notice.type}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{notice.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  results: (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <h3 className="font-bold text-gray-800 mb-4">Mid Terminal Results - Class 10 A</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Marks</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Full</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Percentage</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { subject: 'Nepali', marks: 85, full: 100, grade: 'A' },
              { subject: 'English', marks: 92, full: 100, grade: 'A+' },
              { subject: 'C. Maths', marks: 95, full: 100, grade: 'A+' },
              { subject: 'Science', marks: 88, full: 100, grade: 'A+' },
              { subject: 'Social Studies', marks: 90, full: 100, grade: 'A+' },
              { subject: 'EPH', marks: 89, full: 100, grade: 'A+' },
            ].map((result, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-800">{result.subject}</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-800">{result.marks}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{result.full}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${result.marks}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500">{result.marks}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    result.grade.startsWith('A+') ? 'bg-green-100 text-green-700' :
                    result.grade.startsWith('A') ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{result.grade}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-4 py-3 text-sm font-bold text-gray-800">Total</td>
              <td className="px-4 py-3 text-sm font-bold text-gray-800">539</td>
              <td className="px-4 py-3 text-sm text-gray-600">600</td>
              <td className="px-4 py-3 text-sm font-bold text-green-600">89.83%</td>
              <td className="px-4 py-3"><span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">A+</span></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  ),
  homework: (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <h3 className="font-bold text-gray-800 mb-4">Homework & Assignments</h3>
      <div className="grid md:grid-cols-2 gap-3">
        {[
          { subject: 'Mathematics', topic: 'Quadratic Equations - Ex 3.2', due: '2026-07-10', status: 'Pending', priority: 'High' },
          { subject: 'Science', topic: 'Physics Lab Report Ch.3', due: '2026-07-12', status: 'Pending', priority: 'Medium' },
          { subject: 'English', topic: 'Essay Writing - My School', due: '2026-07-08', status: 'Due Today', priority: 'High' },
          { subject: 'Nepali', topic: 'Grammar Worksheet', due: '2026-07-15', status: 'Upcoming', priority: 'Low' },
        ].map((hw, i) => (
          <div key={i} className={`p-4 rounded-lg border-l-4 ${
            hw.status === 'Due Today' ? 'border-red-400 bg-red-50' :
            hw.status === 'Pending' ? 'border-orange-400 bg-orange-50' :
            'border-gray-300 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-800">{hw.subject}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                hw.status === 'Due Today' ? 'bg-red-200 text-red-800' :
                hw.status === 'Pending' ? 'bg-orange-200 text-orange-800' :
                'bg-gray-200 text-gray-600'
              }`}>{hw.status}</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{hw.topic}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Due: {hw.due}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                hw.priority === 'High' ? 'bg-red-100 text-red-700' :
                hw.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-600'
              }`}>{hw.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  attendance: (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <h3 className="font-bold text-gray-800 mb-4">Attendance Summary</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 bg-gray-50 rounded-lg text-center">
          <div className="text-5xl font-bold text-green-600 mb-2">92%</div>
          <p className="text-gray-600 font-medium">Overall Attendance</p>
          <div className="flex justify-center gap-8 mt-4">
            <div><div className="text-2xl font-bold text-green-600">78</div><div className="text-xs text-gray-500">Present</div></div>
            <div><div className="text-2xl font-bold text-red-500">7</div><div className="text-xs text-gray-500">Absent</div></div>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { month: 'Shrawan', present: 20, absent: 2, total: 22 },
            { month: 'Ashadh', present: 18, absent: 3, total: 21 },
            { month: 'Jestha', present: 19, absent: 1, total: 20 },
            { month: 'Baisakh', present: 21, absent: 1, total: 22 },
          ].map((month, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-800">{month.month}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-green-600">{month.present}P</span>
                <span className="text-sm text-red-500">{month.absent}A</span>
                <span className="text-sm font-bold text-gray-700">{Math.round((month.present / month.total) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export default function StudentDashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [user, setUser] = useState<User | null>(null);
  const [attendance] = useState({ present: 78, absent: 7, total: 85 });

  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'overview');
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, [searchParams]);

  const totalMarks = 539;
  const totalFull = 600;
  const avgMarks = (totalMarks / totalFull * 100).toFixed(1);

  if (!user) return <div className="flex items-center justify-center h-[500px]">Loading...</div>;

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-lg p-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
          <div className="relative">
            <h1 className="text-2xl font-bold">Welcome, {user?.name || 'Student'}!</h1>
            <p className="text-purple-100 text-sm">Class 10 A • Roll No: 1 • Academic Year 2080/2081</p>
            <div className="flex gap-4 mt-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="text-xs text-purple-200">Attendance</div>
                <div className="text-xl font-bold">{Math.round((attendance.present / attendance.total) * 100)}%</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="text-xs text-purple-200">Average</div>
                <div className="text-xl font-bold">{avgMarks}%</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="text-xs text-purple-200">Rank</div>
                <div className="text-xl font-bold">5th</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Attendance', value: `${Math.round((attendance.present / attendance.total) * 100)}%`, icon: '📋', bg: 'bg-green' },
            { label: 'Average Marks', value: `${avgMarks}%`, icon: '📊', bg: 'bg-blue' },
            { label: 'Pending HW', value: '2', icon: '📝', bg: 'bg-yellow' },
            { label: 'Class Rank', value: '5th', icon: '🏆', bg: 'bg-purple' },
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
              </div>
              <div className={`h-1 ${stat.bg}-500`}></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {studentTabContent[activeTab] || studentTabContent.overview}
        </div>
      </div>
    </DashboardLayout>
  );
}