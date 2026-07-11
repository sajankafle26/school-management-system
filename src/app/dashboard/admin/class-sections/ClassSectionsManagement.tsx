'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, ClassSection, AcademicYear } from '@/types';

export default function ClassSectionsManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ClassSection | null>(null);
  const [formData, setFormData] = useState({
    className: '', section: '', capacity: '', description: '', academicYear: ''
  });

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

  if (loading) return <div className="flex items-center justify-center h-[500px]">Loading...</div>;
  if (!user || user.role !== 'admin') return <div className="flex items-center justify-center h-[500px]">Access denied</div>;

  const currentYear = academicYears.find(y => y.isCurrent)?.year || academicYears[0]?.year || '';
  const classes = [...new Set(classSections.map(c => c.className))].sort();
  const sections = [...new Set(classSections.map(c => c.section))].sort();

  const filtered = classSections.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = c.className.toLowerCase().includes(q) || c.section.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q);
    const matchesYear = filterYear === 'all' || c.academicYear === filterYear;
    return matchesSearch && matchesYear;
  });

  const handleOpenModal = (item?: ClassSection) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        className: item.className, section: item.section,
        capacity: String(item.capacity || ''),
        description: item.description || '',
        academicYear: item.academicYear || currentYear
      });
    } else {
      setEditingItem(null);
      setFormData({ className: '', section: '', capacity: '', description: '', academicYear: currentYear });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/class-sections/${editingItem._id}` : '/api/class-sections';
      const method = editingItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, capacity: Number(formData.capacity) || undefined })
      });
      if (!res.ok) throw new Error('Failed to save');
      setShowModal(false);
      const updated = await fetch('/api/class-sections').then(r => r.json());
      setClassSections(Array.isArray(updated) ? updated : []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save class section');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this class section?')) return;
    try {
      const res = await fetch(`/api/class-sections/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const updated = await fetch('/api/class-sections').then(r => r.json());
      setClassSections(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to delete class section');
    }
  };

  const handleExport = () => {
    const headers = ['Class', 'Section', 'Capacity', 'Description', 'Academic Year'];
    const rows = classSections.map(c => [c.className, c.section, String(c.capacity || ''), c.description || '', c.academicYear]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `class-sections-${new Date().toISOString().split('T')[0]}.csv`;
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
          return { className: v[0], section: v[1], capacity: Number(v[2]) || undefined, description: v[3], academicYear: v[4] };
        });
        for (const item of data) {
          await fetch('/api/class-sections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        }
        const updated = await fetch('/api/class-sections').then(r => r.json());
        setClassSections(Array.isArray(updated) ? updated : []);
        alert(`Imported ${data.length} class sections`);
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
            <h1 className="text-2xl font-bold text-gray-800">Class Sections</h1>
            <p className="text-sm text-gray-500">Manage classes and sections</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Export CSV</button>
            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer">
              Import CSV
              <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
            </label>
            <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Class</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4">
            <input type="text" placeholder="Search..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Years</option>
              {academicYears.map(y => <option key={y.year} value={y.year}>{y.year}</option>)}
            </select>
            <span className="text-sm text-gray-500 ml-auto">{filtered.length} classes</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Section</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Capacity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Year</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{c.className}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.section}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.capacity || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.description || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.academicYear}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenModal(c)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200">Edit</button>
                        <button onClick={() => handleDelete(c._id!)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Delete</button>
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
                <h2 className="text-xl font-bold text-gray-800">{editingItem ? 'Edit Class Section' : 'Add Class Section'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                    <select value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Class</option>
                      {['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
                    <select value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Section</option>
                      {['A', 'B', 'C', 'D', 'E'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                    <select value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {academicYears.map(y => <option key={y.year} value={y.year}>{y.year} {y.isCurrent && '(Current)'}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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