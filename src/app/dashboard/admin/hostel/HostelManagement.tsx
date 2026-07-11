'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, Hostel, HostelMember, Student, AcademicYear } from '@/types';

export default function HostelManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [members, setMembers] = useState<HostelMember[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHostelModal, setShowHostelModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingHostel, setEditingHostel] = useState<Hostel | null>(null);
  const [hostelForm, setHostelForm] = useState({
    name: '', type: 'Boys' as Hostel['type'], address: '',
    wardenName: '', wardenContact: '', rooms: '', capacity: '', academicYear: ''
  });
  const [memberForm, setMemberForm] = useState({
    studentId: '', hostelId: '', roomNumber: '', academicYear: ''
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hostelsRes, membersRes, studentsRes, yearsRes] = await Promise.all([
          fetch('/api/hostels').then(r => r.json()),
          fetch('/api/hostel-members').then(r => r.json()),
          fetch('/api/students').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
        ]);
        setHostels(Array.isArray(hostelsRes) ? hostelsRes : []);
        setMembers(Array.isArray(membersRes) ? membersRes : []);
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

  const currentYear = academicYears.find(y => y.isCurrent)?.year || academicYears[0]?.year || '';

  const getStudentName = (id: number) => students.find(s => s.id === id)?.name || `Student #${id}`;
  const getHostelName = (id: string) => hostels.find(h => h._id === id)?.name || 'Unknown';

  const filteredHostels = hostels.filter(h => {
    const q = searchQuery.toLowerCase();
    return h.name.toLowerCase().includes(q) || h.address.toLowerCase().includes(q) || h.wardenName.toLowerCase().includes(q);
  });

  const filteredMembers = members.filter(m => {
    const q = searchQuery.toLowerCase();
    const studentName = getStudentName(m.studentId).toLowerCase();
    const hostelName = getHostelName(m.hostelId).toLowerCase();
    return studentName.includes(q) || hostelName.includes(q);
  });

  const handleOpenHostelModal = (item?: Hostel) => {
    if (item) {
      setEditingHostel(item);
      setHostelForm({
        name: item.name, type: item.type, address: item.address,
        wardenName: item.wardenName, wardenContact: item.wardenContact,
        rooms: String(item.rooms), capacity: String(item.capacity),
        academicYear: item.academicYear || currentYear
      });
    } else {
      setEditingHostel(null);
      setHostelForm({ name: '', type: 'Boys', address: '', wardenName: '', wardenContact: '', rooms: '', capacity: '', academicYear: currentYear });
    }
    setShowHostelModal(true);
  };

  const handleHostelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: hostelForm.name, type: hostelForm.type, address: hostelForm.address,
        wardenName: hostelForm.wardenName, wardenContact: hostelForm.wardenContact,
        rooms: Number(hostelForm.rooms), capacity: Number(hostelForm.capacity),
        academicYear: hostelForm.academicYear
      };
      const url = editingHostel ? `/api/hostels/${editingHostel._id}` : '/api/hostels';
      const method = editingHostel ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save');
      setShowHostelModal(false);
      const updated = await fetch('/api/hostels').then(r => r.json());
      setHostels(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to save hostel');
    }
  };

  const handleDeleteHostel = async (id: string) => {
    if (!confirm('Delete this hostel?')) return;
    try {
      await fetch(`/api/hostels/${id}`, { method: 'DELETE' });
      setHostels(prev => prev.filter(h => h._id !== id));
      setMembers(prev => prev.filter(m => m.hostelId !== id));
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const handleOpenMemberModal = () => {
    setMemberForm({ studentId: '', hostelId: '', roomNumber: '', academicYear: currentYear });
    setShowMemberModal(true);
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        studentId: Number(memberForm.studentId),
        hostelId: memberForm.hostelId,
        roomNumber: memberForm.roomNumber,
        academicYear: memberForm.academicYear
      };
      const res = await fetch('/api/hostel-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save');
      setShowMemberModal(false);
      const updated = await fetch('/api/hostel-members').then(r => r.json());
      setMembers(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to add member');
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Remove this member?')) return;
    try {
      await fetch(`/api/hostel-members/${id}`, { method: 'DELETE' });
      setMembers(prev => prev.filter(m => m._id !== id));
    } catch (error) {
      alert('Failed to remove');
    }
  };

  const handleExportHostels = () => {
    const headers = ['Name', 'Type', 'Address', 'Warden', 'Warden Contact', 'Rooms', 'Capacity'];
    const rows = hostels.map(h => [h.name, h.type, h.address, h.wardenName, h.wardenContact, String(h.rooms), String(h.capacity)]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hostels-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMembers = () => {
    const headers = ['Student', 'Hostel', 'Room Number'];
    const rows = members.map(m => [getStudentName(m.studentId), getHostelName(m.hostelId), m.roomNumber]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hostel-members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hostel Management</h1>
            <p className="text-sm text-gray-500">Manage hostels and hostel members</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExportHostels} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Export Hostels CSV</button>
            <button onClick={handleExportMembers} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700">Export Members CSV</button>
            <button onClick={() => handleOpenHostelModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Hostel</button>
            <button onClick={handleOpenMemberModal} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">+ Add Member</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4">
            <input type="text" placeholder="Search hostels or members..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-80" />
            <span className="text-sm text-gray-500 ml-auto">{filteredHostels.length} hostels, {filteredMembers.length} members</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Hostels</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Address</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Warden</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rooms</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Capacity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredHostels.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">No hostels found</td>
                  </tr>
                ) : filteredHostels.map(h => (
                  <tr key={h._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{h.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        h.type === 'Boys' ? 'bg-blue-100 text-blue-700' :
                        h.type === 'Girls' ? 'bg-pink-100 text-pink-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>{h.type}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{h.address}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{h.wardenName} ({h.wardenContact})</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{h.rooms}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{h.capacity}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenHostelModal(h)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200">Edit</button>
                        <button onClick={() => handleDeleteHostel(h._id!)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">Hostel Members</h3>
            <button onClick={handleOpenMemberModal} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">+ Add Member</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Hostel</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Room Number</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">No members found</td>
                  </tr>
                ) : filteredMembers.map(m => (
                  <tr key={m._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{getStudentName(m.studentId)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{getHostelName(m.hostelId)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{m.roomNumber}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteMember(m._id!)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showHostelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">{editingHostel ? 'Edit Hostel' : 'Add Hostel'}</h2>
                <button onClick={() => setShowHostelModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              </div>
              <form onSubmit={handleHostelSubmit} className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input type="text" value={hostelForm.name} onChange={e => setHostelForm({...hostelForm, name: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select value={hostelForm.type} onChange={e => setHostelForm({...hostelForm, type: e.target.value as Hostel['type']})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Boys">Boys</option>
                      <option value="Girls">Girls</option>
                      <option value="Combined">Combined</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input type="text" value={hostelForm.address} onChange={e => setHostelForm({...hostelForm, address: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warden Name *</label>
                    <input type="text" value={hostelForm.wardenName} onChange={e => setHostelForm({...hostelForm, wardenName: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warden Contact</label>
                    <input type="text" value={hostelForm.wardenContact} onChange={e => setHostelForm({...hostelForm, wardenContact: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rooms *</label>
                    <input type="number" value={hostelForm.rooms} onChange={e => setHostelForm({...hostelForm, rooms: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                    <input type="number" value={hostelForm.capacity} onChange={e => setHostelForm({...hostelForm, capacity: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                    <select value={hostelForm.academicYear} onChange={e => setHostelForm({...hostelForm, academicYear: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {academicYears.map(y => <option key={y.year} value={y.year}>{y.year} {y.isCurrent && '(Current)'}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setShowHostelModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">{editingHostel ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showMemberModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Add Hostel Member</h2>
                <button onClick={() => setShowMemberModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              </div>
              <form onSubmit={handleMemberSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                  <select value={memberForm.studentId} onChange={e => setMemberForm({...memberForm, studentId: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Student</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.className} {s.section})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hostel *</label>
                  <select value={memberForm.hostelId} onChange={e => setMemberForm({...memberForm, hostelId: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Hostel</option>
                    {hostels.map(h => <option key={h._id} value={h._id}>{h.name} ({h.type})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                  <input type="text" value={memberForm.roomNumber} onChange={e => setMemberForm({...memberForm, roomNumber: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                  <select value={memberForm.academicYear} onChange={e => setMemberForm({...memberForm, academicYear: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {academicYears.map(y => <option key={y.year} value={y.year}>{y.year} {y.isCurrent && '(Current)'}</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setShowMemberModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Add Member</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
