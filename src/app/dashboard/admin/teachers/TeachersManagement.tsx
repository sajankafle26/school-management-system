'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, Teacher, ClassSection, AcademicYear } from '@/types';

export default function TeachersManagement() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '', nepaliName: '', subject: '', contact: '', email: '',
    profilePic: '', classTeacherOf: '', academicYear: ''
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, sectionsRes, yearsRes] = await Promise.all([
          fetch('/api/teachers').then(r => r.json()),
          fetch('/api/class-sections').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
        ]);
        setTeachers(Array.isArray(teachersRes) ? teachersRes : []);
        setClassSections(Array.isArray(sectionsRes) ? sectionsRes : []);
        setAcademicYears(Array.isArray(yearsRes) ? yearsRes : []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-[500px]">Loading...</div>;
  if (!user || user.role !== 'admin') return <div className="flex items-center justify-center h-[500px]">Access denied</div>;

  const currentYear = academicYears.find(y => y.isCurrent)?.year || academicYears[0]?.year || '';
  const subjects = [...new Set(teachers.map(t => t.subject))].sort();
  const classTeacherOptions = [...new Set(classSections.map(c => `${c.className} ${c.section}`))].sort();

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || t.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const handleOpenModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        name: teacher.name,
        nepaliName: teacher.nepaliName,
        subject: teacher.subject,
        contact: teacher.contact,
        email: teacher.email,
        profilePic: teacher.profilePic || '',
        classTeacherOf: teacher.classTeacherOf || '',
        academicYear: teacher.academicYear || currentYear
      });
    } else {
      setEditingTeacher(null);
      setFormData({ name: '', nepaliName: '', subject: '', contact: '', email: '', profilePic: '', classTeacherOf: '', academicYear: currentYear });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTeacher ? `/api/teachers/${editingTeacher._id}` : '/api/teachers';
      const method = editingTeacher ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save');
      setShowModal(false);
      const updated = await fetch('/api/teachers').then(r => r.json());
      setTeachers(Array.isArray(updated) ? updated : []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save teacher');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this teacher?')) return;
    try {
      const res = await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const updated = await fetch('/api/teachers').then(r => r.json());
      setTeachers(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to delete teacher');
    }
  };

  const handleExport = () => {
    const headers = ['Name', 'Nepali Name', 'Subject', 'Contact', 'Email', 'Class Teacher Of', 'Academic Year'];
    const rows = teachers.map(t => [t.name, t.nepaliName, t.subject, t.contact, t.email, t.classTeacherOf || '', t.academicYear || '']);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teachers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.trim().split('\n');
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
          return { name: values[0], nepaliName: values[1], subject: values[2], contact: values[3], email: values[4], classTeacherOf: values[5], academicYear: values[6] };
        });
        for (const item of data) {
          await fetch('/api/teachers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        }
        const updated = await fetch('/api/teachers').then(r => r.json());
        setTeachers(Array.isArray(updated) ? updated : []);
      } catch (error) {
        console.error('Import error:', error);
        alert('Import failed');
      }
    };
    reader.readAsText(file);
  };

  if (loading) return <div className="flex items-center justify-center h-[500px]">Loading...</div>;
  if (!user || user.role !== 'admin') return <div className="flex items-center justify-center h-[500px]">Access denied</div>;

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Teachers Management</h1>
            <p className="text-sm text-gray-500">Manage teacher records</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Export CSV</button>
            <input type="file" accept=".csv" onChange={handleImport} className="hidden" id="import-teachers" />
            <label htmlFor="import-teachers" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 cursor-pointer">Import CSV</label>
            <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Teacher</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="text-sm text-gray-500 ml-auto">{filteredTeachers.length} teachers</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nepali Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class Teacher</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTeachers.map((t, i) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{t.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{t.nepaliName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.subject}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.contact}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{t.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{t.classTeacherOf || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenModal(t)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200">Edit</button>
                        <button onClick={() => handleDelete(t._id!)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">{editingTeacher ? 'Edit Teacher' : 'Add Teacher'}</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nepali Name</label>
                    <input type="text" value={formData.nepaliName} onChange={e => setFormData({...formData, nepaliName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Subject</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="English">English</option>
                      <option value="Nepali">Nepali</option>
                      <option value="Social Studies">Social Studies</option>
                      <option value="EPH">EPH</option>
                      <option value="Computer">Computer</option>
                      <option value="Health">Health</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact *</label>
                    <input type="tel" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                    <input type="text" value={formData.profilePic} onChange={e => setFormData({...formData, profilePic: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Teacher Of</label>
                    <select value={formData.classTeacherOf} onChange={e => setFormData({...formData, classTeacherOf: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">None</option>
                      {classTeacherOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                    <select value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {academicYears.map(y => <option key={y.year} value={y.year}>{y.year} {y.isCurrent && '(Current)'}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">{editingTeacher ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}