'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, TransportRoute, TransportMember, Driver, AcademicYear, Student } from '@/types';

export default function TransportRoutesManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [members, setMembers] = useState<TransportMember[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'routes' | 'members'>('routes');
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<TransportRoute | null>(null);
  const [routeForm, setRouteForm] = useState({
    name: '', route: '', fare: '', vehicleNo: '', driverId: '', academicYear: ''
  });
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberForm, setMemberForm] = useState({
    studentId: '', routeId: '', pickupPoint: '', academicYear: ''
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routesRes, membersRes, driversRes, studentsRes, yearsRes] = await Promise.all([
          fetch('/api/transport-routes').then(r => r.json()),
          fetch('/api/transport-members').then(r => r.json()),
          fetch('/api/drivers').then(r => r.json()),
          fetch('/api/students').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
        ]);
        setRoutes(Array.isArray(routesRes) ? routesRes : []);
        setMembers(Array.isArray(membersRes) ? membersRes : []);
        setDrivers(Array.isArray(driversRes) ? driversRes : []);
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

  const getDriverName = (id: string) => drivers.find(d => d._id === id)?.name || 'Unknown';
  const getStudentName = (id: number) => students.find(s => s.id === id)?.name || `Student #${id}`;
  const getRouteName = (id: string) => routes.find(r => r._id === id)?.name || 'Unknown';

  const filteredRoutes = routes.filter(r => {
    const q = searchQuery.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.route.toLowerCase().includes(q) || r.vehicleNo.toLowerCase().includes(q);
  });

  const filteredMembers = members.filter(m => {
    const q = searchQuery.toLowerCase();
    return getStudentName(m.studentId).toLowerCase().includes(q) || getRouteName(m.routeId).toLowerCase().includes(q);
  });

  const handleOpenRouteModal = (route?: TransportRoute) => {
    if (route) {
      setEditingRoute(route);
      setRouteForm({
        name: route.name, route: route.route, fare: String(route.fare),
        vehicleNo: route.vehicleNo, driverId: route.driverId,
        academicYear: route.academicYear || currentYear
      });
    } else {
      setEditingRoute(null);
      setRouteForm({ name: '', route: '', fare: '', vehicleNo: '', driverId: '', academicYear: currentYear });
    }
    setShowRouteModal(true);
  };

  const handleRouteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...routeForm, fare: Number(routeForm.fare) };
      const url = editingRoute ? `/api/transport-routes/${editingRoute._id}` : '/api/transport-routes';
      const method = editingRoute ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save');
      setShowRouteModal(false);
      const updated = await fetch('/api/transport-routes').then(r => r.json());
      setRoutes(Array.isArray(updated) ? updated : []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save route');
    }
  };

  const handleDeleteRoute = async (id: string) => {
    if (!confirm('Delete this route?')) return;
    try {
      const res = await fetch(`/api/transport-routes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const updated = await fetch('/api/transport-routes').then(r => r.json());
      setRoutes(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to delete route');
    }
  };

  const handleOpenMemberModal = () => {
    setMemberForm({ studentId: '', routeId: '', pickupPoint: '', academicYear: currentYear });
    setShowMemberModal(true);
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...memberForm, studentId: Number(memberForm.studentId) };
      const res = await fetch('/api/transport-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to add member');
      setShowMemberModal(false);
      const updated = await fetch('/api/transport-members').then(r => r.json());
      setMembers(Array.isArray(updated) ? updated : []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add member');
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Remove this member from route?')) return;
    try {
      const res = await fetch(`/api/transport-members/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove');
      const updated = await fetch('/api/transport-members').then(r => r.json());
      setMembers(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to remove member');
    }
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Transport Routes</h1>
            <p className="text-sm text-gray-500">Manage routes and route members</p>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex gap-0">
            <button onClick={() => { setActiveTab('routes'); setSearchQuery(''); }}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'routes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              Routes
            </button>
            <button onClick={() => { setActiveTab('members'); setSearchQuery(''); }}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'members' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              Route Members
            </button>
          </div>
        </div>

        {activeTab === 'routes' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input type="text" placeholder="Search routes..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
              </div>
              <button onClick={() => handleOpenRouteModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Route</button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <span className="text-sm text-gray-500">{filteredRoutes.length} routes</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Route Name</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fare</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Vehicle No</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Driver</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Academic Year</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRoutes.map(r => (
                      <tr key={r._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{r.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.route}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Rs. {r.fare}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.vehicleNo}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{getDriverName(r.driverId)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{r.academicYear}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleOpenRouteModal(r)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200">Edit</button>
                            <button onClick={() => handleDeleteRoute(r._id!)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {showRouteModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">{editingRoute ? 'Edit Route' : 'Add Route'}</h2>
                    <button onClick={() => setShowRouteModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                  </div>
                  <form onSubmit={handleRouteSubmit} className="p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Route Name *</label>
                        <input type="text" value={routeForm.name} onChange={e => setRouteForm({...routeForm, name: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fare (Rs.) *</label>
                        <input type="number" value={routeForm.fare} onChange={e => setRouteForm({...routeForm, fare: e.target.value})} required min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Route Description *</label>
                        <input type="text" value={routeForm.route} onChange={e => setRouteForm({...routeForm, route: e.target.value})} required placeholder="e.g., City Center to School via Main Road" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle No *</label>
                        <input type="text" value={routeForm.vehicleNo} onChange={e => setRouteForm({...routeForm, vehicleNo: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Driver *</label>
                        <select value={routeForm.driverId} onChange={e => setRouteForm({...routeForm, driverId: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">Select Driver</option>
                          {drivers.map(d => <option key={d._id} value={d._id!}>{d.name} ({d.licenseNumber})</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                        <select value={routeForm.academicYear} onChange={e => setRouteForm({...routeForm, academicYear: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          {academicYears.map(y => <option key={y.year} value={y.year}>{y.year} {y.isCurrent && '(Current)'}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button type="button" onClick={() => setShowRouteModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">{editingRoute ? 'Update' : 'Create'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'members' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input type="text" placeholder="Search by student or route..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
              </div>
              <button onClick={handleOpenMemberModal} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Member</button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <span className="text-sm text-gray-500">{filteredMembers.length} members</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Route</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pickup Point</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMembers.map(m => (
                      <tr key={m._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{getStudentName(m.studentId)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{getRouteName(m.routeId)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{m.pickupPoint}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteMember(m._id!)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {showMemberModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Add Route Member</h2>
                    <button onClick={() => setShowMemberModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                  </div>
                  <form onSubmit={handleMemberSubmit} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                      <select value={memberForm.studentId} onChange={e => setMemberForm({...memberForm, studentId: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Student</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.className} {s.section}, Roll: {s.roll})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Route *</label>
                      <select value={memberForm.routeId} onChange={e => setMemberForm({...memberForm, routeId: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Route</option>
                        {routes.map(r => <option key={r._id} value={r._id!}>{r.name} - {r.vehicleNo}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Point *</label>
                      <input type="text" value={memberForm.pickupPoint} onChange={e => setMemberForm({...memberForm, pickupPoint: e.target.value})} required placeholder="e.g., Main Gate, Bus Stop A, etc." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button type="button" onClick={() => setShowMemberModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Add Member</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
