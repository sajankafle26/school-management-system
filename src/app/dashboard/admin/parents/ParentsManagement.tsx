'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, Parent, AcademicYear, Student } from '@/types';

export default function ParentsManagement() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [formData, setFormData] = useState({
    name: '', contact: '', email: '', address: ''
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parentsRes, studentsRes, yearsRes] = await Promise.all([
          fetch('/api/parents').then(r => r.json()),
          fetch('/api/students').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
        ]);
        setParents(Array.isArray(parentsRes) ? parentsRes : []);
        setStudents(Array.isArray(studentsRes) ? studentsRes : []);
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

  const filteredParents = parents.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleOpenModal = (parent?: Parent) => {
    if (parent) {
      setEditingParent(parent);
      setFormData({
        name: parent.name,
        contact: parent.contact,
        email: parent.email,
        address: parent.address || ''
      });
    } else {
      setEditingParent(null);
      setFormData({ name: '', contact: '', email: '', address: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingParent ? `/api/parents/${editingParent._id}` : '/api/parents';
      const method = editingParent ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save');
      setShowModal(false);
      const updated = await fetch('/api/parents').then(r => r.json());
      setParents(Array.isArray(updated) ? updated : []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save parent');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this parent?')) return;
    try {
      const res = await fetch(`/api/parents/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const updated = await fetch('/api/parents').then(r => r.json());
      setParents(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to delete parent');
    }
  };

  const handleExport = () => {
    const headers = ['Name', 'Contact', 'Email', 'Address'];
    const rows = parents.map(p => [p.name, p.contact, p.email, p.address || '']);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parents-${new Date().toISOString().split('T')[0]}.csv`;
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
          return { name: values[0], contact: values[1], email: values[2], address: values[3] };
        });
        for (const item of data) {
          await fetch('/api/parents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        }
        const updated = await fetch('/api/parents').then(r => r.json());
        setParents(Array.isArray(updated) ? updated : []);
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
            <h1 className="text-2xl font-bold text-gray-800">Parents Management</h1>
            <p className="text-sm text-gray-500">Manage parent records</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Export CSV</button>
            <input type="file" accept=".csv" onChange={handleImport} className="hidden" id="import-parents" />
            <label htmlFor="import-parents" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 cursor-pointer">Import CSV</label>
            <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">+ Add Parent</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search parents..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <span className="text-sm text-gray-500 ml-auto">{filteredParents.length} parents</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Address</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Children</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredParents.map((p, i) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.contact}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{p.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{p.address || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">3</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenModal(p)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200">Edit</button>
                        <button onClick={() => handleDelete(p._id!)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Delete</button>
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
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">{editingParent ? 'Edit Parent' : 'Add Parent'}</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">{editingParent ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}