'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, Grade, AcademicYear } from '@/types';

export default function GradesManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Grade | null>(null);
  const [formData, setFormData] = useState({
    name: '', gradePoint: '', markFrom: '', markTo: '', academicYear: ''
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gradesRes, yearsRes] = await Promise.all([
          fetch('/api/grades').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
        ]);
        setGrades(Array.isArray(gradesRes) ? gradesRes : []);
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
  const sorted = [...grades].sort((a, b) => a.gradePoint - b.gradePoint);

  const filtered = sorted.filter(g => {
    const q = searchQuery.toLowerCase();
    return g.name.toLowerCase().includes(q);
  });

  const handleOpenModal = (item?: Grade) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name, gradePoint: String(item.gradePoint),
        markFrom: String(item.markFrom), markTo: String(item.markTo),
        academicYear: item.academicYear || currentYear
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', gradePoint: '', markFrom: '', markTo: '', academicYear: currentYear });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        gradePoint: Number(formData.gradePoint),
        markFrom: Number(formData.markFrom),
        markTo: Number(formData.markTo),
        academicYear: formData.academicYear
      };
      const url = editingItem ? `/api/grades/${editingItem._id}` : '/api/grades';
      const method = editingItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save');
      setShowModal(false);
      const updated = await fetch('/api/grades').then(r => r.json());
      setGrades(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to save grade');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this grade?')) return;
    try {
      const res = await fetch(`/api/grades/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setGrades(prev => prev.filter(g => g._id !== id));
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const handleExport = () => {
    const headers = ['Name', 'Grade Point', 'Mark From', 'Mark To', 'Academic Year'];
    const rows = grades.map(g => [g.name, String(g.gradePoint), String(g.markFrom), String(g.markTo), g.academicYear]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grades-${new Date().toISOString().split('T')[0]}.csv`;
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
          const v = line.split(',').map(x => x.replace(/^"|"$/g, '').trim());
          return { name: v[0], gradePoint: Number(v[1]), markFrom: Number(v[2]), markTo: Number(v[3]), academicYear: v[4] };
        });
        for (const item of data) {
          await fetch('/api/grades', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        }
        const updated = await fetch('/api/grades').then(r => r.json());
        setGrades(Array.isArray(updated) ? updated : []);
        alert(`Imported ${data.length} grades`);
      } catch (error) {
        alert('Import failed');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Grades</h1>
            <p className="text-sm text-gray-500">Manage grade definitions</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Export CSV</button>
            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer">
              Import CSV
              <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
            </label>
            <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Grade</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4">
            <input type="text" placeholder="Search grades..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
            <span className="text-sm text-gray-500 ml-auto">{filtered.length} grades</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Grade Point</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Mark From</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Mark To</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Academic Year</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(g => (
                  <tr key={g._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{g.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{g.gradePoint}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{g.markFrom}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{g.markTo}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{g.academicYear}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenModal(g)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200">Edit</button>
                        <button onClick={() => handleDelete(g._id!)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Delete</button>
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
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">{editingItem ? 'Edit Grade' : 'Add Grade'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. A+" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Point *</label>
                    <input type="number" step="0.1" value={formData.gradePoint} onChange={e => setFormData({...formData, gradePoint: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mark From *</label>
                    <input type="number" value={formData.markFrom} onChange={e => setFormData({...formData, markFrom: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mark To *</label>
                    <input type="number" value={formData.markTo} onChange={e => setFormData({...formData, markTo: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                    <select value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {academicYears.map(y => <option key={y.year} value={y.year}>{y.year} {y.isCurrent && '(Current)'}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">{editingItem ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
