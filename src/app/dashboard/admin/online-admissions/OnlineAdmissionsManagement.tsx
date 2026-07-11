'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, OnlineAdmission, AcademicYear } from '@/types';

export default function OnlineAdmissionsManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [admissions, setAdmissions] = useState<OnlineAdmission[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [admissionsRes, yearsRes] = await Promise.all([
          fetch('/api/online-admissions').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
        ]);
        setAdmissions(Array.isArray(admissionsRes) ? admissionsRes : []);
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

  const statuses = ['All', 'Pending', 'Approved', 'Rejected'];

  const filteredAdmissions = admissions.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.motherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.contact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      const res = await fetch(`/api/online-admissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated = await fetch('/api/online-admissions').then(r => r.json());
      setAdmissions(Array.isArray(updated) ? updated : []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this admission application?')) return;
    try {
      const res = await fetch(`/api/online-admissions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const updated = await fetch('/api/online-admissions').then(r => r.json());
      setAdmissions(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Approved: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700'
    };
    return `${colors[status] || 'bg-gray-100 text-gray-700'} px-2 py-1 rounded text-xs font-medium`;
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Online Admissions</h1>
            <p className="text-sm text-gray-500">Manage incoming admission applications</p>
          </div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            {admissions.length} Total
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <input type="text" placeholder="Search by name, parent or contact..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72" />
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {statuses.map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterStatus === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {s}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-auto">{filteredAdmissions.length} applications</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Applicant Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">DOB</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Father</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Mother</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdmissions.map(a => (
                  <tr key={a._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === a._id ? null : (a._id || null))}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{a.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.className}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.dateOfBirth}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.fatherName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.motherName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.contact}</td>
                    <td className="px-4 py-3">
                      <span className={getStatusBadge(a.status)}>{a.status}</span>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {a.status === 'Pending' && (
                          <>
                            <button onClick={() => handleStatusUpdate(a._id!, 'Approved')}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200">Approve</button>
                            <button onClick={() => handleStatusUpdate(a._id!, 'Rejected')}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Reject</button>
                          </>
                        )}
                        {a.status !== 'Pending' && (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                        <button onClick={() => handleDelete(a._id!)}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {expandedRow && (
                  <tr key={`${expandedRow}-details`} className="bg-gray-50">
                    <td colSpan={8} className="px-6 py-4">
                      {(() => {
                        const a = admissions.find(x => x._id === expandedRow);
                        if (!a) return null;
                        return (
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-semibold text-gray-700">Full Name: </span>
                              <span className="text-gray-600">{a.name}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Gender: </span>
                              <span className="text-gray-600">{a.gender}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Class: </span>
                              <span className="text-gray-600">{a.className}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Date of Birth: </span>
                              <span className="text-gray-600">{a.dateOfBirth}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Father: </span>
                              <span className="text-gray-600">{a.fatherName}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Mother: </span>
                              <span className="text-gray-600">{a.motherName}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Contact: </span>
                              <span className="text-gray-600">{a.contact}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Email: </span>
                              <span className="text-gray-600">{a.email}</span>
                            </div>
                            <div className="md:col-span-2">
                              <span className="font-semibold text-gray-700">Address: </span>
                              <span className="text-gray-600">{a.address}</span>
                            </div>
                            <div className="md:col-span-2">
                              <span className="font-semibold text-gray-700">Previous School: </span>
                              <span className="text-gray-600">{a.previousSchool || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Academic Year: </span>
                              <span className="text-gray-600">{a.academicYear}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
