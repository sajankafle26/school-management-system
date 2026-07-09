'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import type { User } from '@/types';

const teacherTabContent: Record<string, React.ReactNode> = {
  today: (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-4">Today's Schedule</h3>
        <div className="space-y-2">
          {[
            { time: '7:00 - 7:45', subject: 'Mathematics', class: '10 A', room: 'Room 5', type: 'Lecture' },
            { time: '7:45 - 8:30', subject: 'Mathematics', class: '9 B', room: 'Room 3', type: 'Lecture' },
            { time: '8:30 - 9:15', subject: 'Mathematics', class: '8 C', room: 'Room 5', type: 'Tutorial' },
            { time: '9:15 - 9:30', subject: 'Break', class: '-', room: '-', type: 'Break' },
            { time: '9:30 - 10:15', subject: 'Mathematics', class: '10 A', room: 'Room 5', type: 'Lab' },
            { time: '10:15 - 11:00', subject: 'Mathematics', class: '9 B', room: 'Room 3', type: 'Lecture' },
          ].map((cls, i) => (
            <div key={i} className={`flex items-center gap-4 p-3 rounded-lg ${
              cls.type === 'Break' ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 hover:bg-gray-100'
            } transition-colors`}>
              <div className="w-28 text-center flex-shrink-0">
                <div className="text-xs font-bold text-gray-500">{cls.time}</div>
              </div>
              <div className={`w-1 h-10 rounded-full flex-shrink-0 ${
                cls.type === 'Lecture' ? 'bg-blue-500' :
                cls.type === 'Tutorial' ? 'bg-green-500' :
                cls.type === 'Lab' ? 'bg-purple-500' :
                'bg-yellow-500'
              }`}></div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm">{cls.subject}</div>
                <div className="text-xs text-gray-500">{cls.class} • {cls.room}</div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 ${
                cls.type === 'Lecture' ? 'bg-blue-100 text-blue-700' :
                cls.type === 'Tutorial' ? 'bg-green-100 text-green-700' :
                cls.type === 'Lab' ? 'bg-purple-100 text-purple-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>{cls.type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="font-bold text-gray-800 mb-3">Pending Tasks</h3>
          <div className="space-y-3">
            {[
              { task: 'Upload results for Class 10', deadline: 'Today', priority: 'High' },
              { task: 'Review homework submissions', deadline: 'Tomorrow', priority: 'Medium' },
              { task: 'Parent meeting preparation', deadline: 'Jul 12', priority: 'Low' },
            ].map((task, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-800">{task.task}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">Due: {task.deadline}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    task.priority === 'High' ? 'bg-red-100 text-red-700' :
                    task.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{task.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="font-bold text-gray-800 mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'My Classes', value: '3', icon: '🏫', color: 'bg-blue-500' },
              { label: 'Total Students', value: '97', icon: '👨‍🎓', color: 'bg-green-500' },
              { label: 'Homework Active', value: '2', icon: '📝', color: 'bg-purple-500' },
              { label: 'Results Pending', value: '3', icon: '📊', color: 'bg-orange-500' },
            ].map((stat, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                  {stat.icon}
                </div>
                <div className="text-lg font-bold text-gray-800 mt-1">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  homework: (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">Homework Management</h3>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">+ Assign</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Topic</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Submission</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { subject: 'Mathematics', topic: 'Quadratic Equations - Ex 3.2', class: '10 A', due: '2026-07-10', submitted: 28, total: 35, status: 'Active' },
              { subject: 'Mathematics', topic: 'Linear Algebra Problems', class: '9 B', due: '2026-07-11', submitted: 18, total: 30, status: 'Active' },
              { subject: 'Mathematics', topic: 'Basic Algebra Worksheet', class: '8 C', due: '2026-07-12', submitted: 0, total: 32, status: 'Draft' },
            ].map((hw, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-800">{hw.subject}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{hw.topic}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{hw.class}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{hw.due}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(hw.submitted / hw.total) * 100}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500">{hw.submitted}/{hw.total}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    hw.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>{hw.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
  results: (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">Recent Results</h3>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">+ Enter Results</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Marks</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { student: 'Ram Thapa', class: '10 A', subject: 'Mathematics', marks: 95, grade: 'A+' },
              { student: 'Sita Sharma', class: '10 A', subject: 'Mathematics', marks: 80, grade: 'A' },
              { student: 'Anjali Lama', class: '10 A', subject: 'Mathematics', marks: 88, grade: 'A+' },
              { student: 'Gita Rai', class: '9 B', subject: 'Mathematics', marks: 78, grade: 'B+' },
              { student: 'Nabin Gurung', class: '8 C', subject: 'Mathematics', marks: 72, grade: 'B' },
            ].map((result, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-800">{result.student}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{result.class}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{result.subject}</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-800">{result.marks}/100</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    result.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                    result.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{result.grade}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
  attendance: (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">Attendance Overview</h3>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">+ Mark Attendance</button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { class: '10 A', present: 30, absent: 5, total: 35 },
          { class: '9 B', present: 26, absent: 4, total: 30 },
          { class: '8 C', present: 29, absent: 3, total: 32 },
        ].map((cls, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-gray-800">{cls.class}</span>
              <span className="text-xs text-gray-400">{cls.total} students</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-center p-2 bg-green-100 rounded">
                <div className="text-lg font-bold text-green-600">{cls.present}</div>
                <div className="text-xs text-gray-500">Present</div>
              </div>
              <div className="text-center p-2 bg-red-100 rounded">
                <div className="text-lg font-bold text-red-500">{cls.absent}</div>
                <div className="text-xs text-gray-500">Absent</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(cls.present / cls.total) * 100}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">{Math.round((cls.present / cls.total) * 100)}% attendance</p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export default function TeacherDashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'today');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'today');
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, [searchParams]);

  if (!user) return <div className="flex items-center justify-center h-[500px]">Loading...</div>;

  return (
    <DashboardLayout allowedRoles={['teacher']}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Teacher'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Today</p>
            <p className="text-sm font-semibold text-gray-800">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Today's Classes", value: '5', icon: '📚', bg: 'bg-blue' },
            { label: 'My Students', value: '97', icon: '👨‍🎓', bg: 'bg-green' },
            { label: 'Homework Active', value: '2', icon: '📝', bg: 'bg-yellow' },
            { label: 'Results Pending', value: '3', icon: '📊', bg: 'bg-red' },
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
          {teacherTabContent[activeTab] || teacherTabContent.today}
        </div>
      </div>
    </DashboardLayout>
  );
}