'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, Student, AcademicYear, ClassSection } from '@/types';

export default function AttendanceManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [csRes, yearsRes] = await Promise.all([
          fetch('/api/class-sections').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
        ]);
        setClassSections(Array.isArray(csRes) ? csRes : []);
        setAcademicYears(Array.isArray(yearsRes) ? yearsRes : []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedClass === 'all' || !selectedClass) return;
    const fetchStudents = async () => {
      try {
        const params = new URLSearchParams();
        params.set('className', selectedClass);
        if (selectedSection !== 'all') params.set('section', selectedSection);
        const res = await fetch(`/api/students?${params}`);
        const data = await res.json();
        setStudents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        setStudents([]);
      }
    };
    fetchStudents();
  }, [selectedClass, selectedSection]);

  const fetchAttendance = useCallback(async () => {
    if (selectedClass === 'all' || !date) return;
    try {
      const params = new URLSearchParams();
      params.set('date', date);
      params.set('className', selectedClass);
      if (selectedSection !== 'all') params.set('section', selectedSection);
      const res = await fetch(`/api/attendance?${params}`);
      const data = await res.json();
      const map: Record<string, 'present' | 'absent' | 'late'> = {};
      if (Array.isArray(data)) {
        data.forEach((a: any) => {
          if (a.studentId) map[a.studentId] = a.status;
        });
      }
      setAttendanceMap(map);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    }
  }, [date, selectedClass, selectedSection]);

  useEffect(() => {
    if (students.length > 0) fetchAttendance();
  }, [students, fetchAttendance]);

  if (loading) return <div className="flex items-center justify-center h-[500px]">Loading...</div>;
  if (!user || user.role !== 'admin') return <div className="flex items-center justify-center h-[500px]">Access denied</div>;

  const currentYear = academicYears.find(y => y.isCurrent)?.year || academicYears[0]?.year || '';
  const classes = [...new Set(classSections.map(c => c.className))].sort();
  const sections = [...new Set(classSections.filter(c => selectedClass === 'all' || c.className === selectedClass).map(c => c.section))].sort();

  const filtered = students.filter(s => {
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.guardianName.toLowerCase().includes(q);
  });

  const toggleStatus = (studentId: string, currentStatus?: 'present' | 'absent' | 'late') => {
    const next: Record<string, 'present' | 'absent' | 'late'> = { present: 'absent', absent: 'late', late: 'present' };
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: currentStatus ? next[currentStatus] : 'present'
    }));
  };

  const summary = { present: 0, absent: 0, late: 0 };
  filtered.forEach(s => {
    const status = attendanceMap[s._id!];
    if (status === 'present') summary.present++;
    else if (status === 'absent') summary.absent++;
    else if (status === 'late') summary.late++;
  });

  const handleSaveAll = async () => {
    if (selectedClass === 'all') { alert('Please select a class'); return; }
    setSaving(true);
    try {
      const attendanceData = filtered.map(s => ({
        studentId: s._id,
        date,
        status: attendanceMap[s._id!] || 'present',
        className: selectedClass,
        section: selectedSection !== 'all' ? selectedSection : s.section,
        academicYear: currentYear
      }));
      const res = await fetch('/api/attendance/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: attendanceData })
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('Attendance saved successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
            <p className="text-sm text-gray-500">Manage student attendance</p>
          </div>
          {selectedClass !== 'all' && (
            <button onClick={handleSaveAll} disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Class</label>
              <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedSection('all'); }}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Select Class</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Section</label>
              <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Sections</option>
                {sections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
              <input type="text" placeholder="Search student..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48" />
            </div>
          </div>

          {selectedClass !== 'all' && (
            <>
              <div className="p-4 flex flex-wrap items-center gap-6 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-sm font-medium text-gray-700">Present: <strong>{summary.present}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-sm font-medium text-gray-700">Absent: <strong>{summary.absent}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm font-medium text-gray-700">Late: <strong>{summary.late}</strong></span>
                </div>
                <span className="text-sm text-gray-500 ml-auto">Total: {filtered.length} students</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Roll</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map(s => {
                      const status = attendanceMap[s._id!];
                      return (
                        <tr key={s._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800">{s.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{s.className} {s.section}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{s.roll}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button type="button" onClick={() => toggleStatus(s._id!, status)}
                                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                                  status === 'present' ? 'bg-green-500 text-white ring-2 ring-green-300' :
                                  'bg-gray-100 text-gray-600 hover:bg-green-100'
                                }`}>Present</button>
                              <button type="button" onClick={() => toggleStatus(s._id!, status)}
                                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                                  status === 'absent' ? 'bg-red-500 text-white ring-2 ring-red-300' :
                                  'bg-gray-100 text-gray-600 hover:bg-red-100'
                                }`}>Absent</button>
                              <button type="button" onClick={() => toggleStatus(s._id!, status)}
                                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                                  status === 'late' ? 'bg-yellow-500 text-white ring-2 ring-yellow-300' :
                                  'bg-gray-100 text-gray-600 hover:bg-yellow-100'
                                }`}>Late</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {selectedClass === 'all' && (
            <div className="p-12 text-center text-gray-400">
              <p className="text-lg font-medium">Select a class and section to mark attendance</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
