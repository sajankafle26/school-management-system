'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, Exam, ExamSchedule, ClassSection, AcademicYear } from '@/types';

export default function ExamsManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showExamModal, setShowExamModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSchedulePanel, setShowSchedulePanel] = useState<string | null>(null);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [examForm, setExamForm] = useState({
    name: '', type: 'First Terminal' as Exam['type'],
    startDate: '', endDate: '', className: '', section: '', academicYear: ''
  });
  const [scheduleForm, setScheduleForm] = useState({
    subject: '', date: '', startTime: '', endTime: '', fullMarks: '', passMarks: ''
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, schedulesRes, csRes, yearsRes] = await Promise.all([
          fetch('/api/exams').then(r => r.json()),
          fetch('/api/exam-schedules').then(r => r.json()),
          fetch('/api/class-sections').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
        ]);
        setExams(Array.isArray(examsRes) ? examsRes : []);
        setSchedules(Array.isArray(schedulesRes) ? schedulesRes : []);
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

  const filtered = exams.filter(e => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = e.name.toLowerCase().includes(q);
    const matchesClass = filterClass === 'all' || e.className === filterClass;
    const matchesType = filterType === 'all' || e.type === filterType;
    return matchesSearch && matchesClass && matchesType;
  });

  const getSectionsForClass = (className: string) =>
    classSections.filter(c => c.className === className).map(c => c.section);

  const handleOpenExamModal = (item?: Exam) => {
    if (item) {
      setEditingExam(item);
      setExamForm({
        name: item.name, type: item.type,
        startDate: item.startDate, endDate: item.endDate,
        className: item.className, section: item.section,
        academicYear: item.academicYear || currentYear
      });
    } else {
      setEditingExam(null);
      setExamForm({ name: '', type: 'First Terminal', startDate: '', endDate: '', className: '', section: '', academicYear: currentYear });
    }
    setShowExamModal(true);
  };

  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingExam ? `/api/exams/${editingExam._id}` : '/api/exams';
      const method = editingExam ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examForm)
      });
      if (!res.ok) throw new Error('Failed to save');
      setShowExamModal(false);
      const updated = await fetch('/api/exams').then(r => r.json());
      setExams(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to save exam');
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (!confirm('Delete this exam?')) return;
    try {
      const res = await fetch(`/api/exams/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setExams(prev => prev.filter(e => e._id !== id));
      setSchedules(prev => prev.filter(s => s.examId !== id));
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const handleOpenScheduleModal = (examId: string) => {
    setSelectedExamId(examId);
    setScheduleForm({ subject: '', date: '', startTime: '', endTime: '', fullMarks: '', passMarks: '' });
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/exam-schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: selectedExamId,
          subject: scheduleForm.subject,
          date: scheduleForm.date,
          startTime: scheduleForm.startTime,
          endTime: scheduleForm.endTime,
          fullMarks: Number(scheduleForm.fullMarks),
          passMarks: Number(scheduleForm.passMarks),
          academicYear: examForm.academicYear || currentYear
        })
      });
      if (!res.ok) throw new Error('Failed to save');
      setShowScheduleModal(false);
      const updated = await fetch('/api/exam-schedules').then(r => r.json());
      setSchedules(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to save schedule');
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Delete this schedule entry?')) return;
    try {
      const res = await fetch(`/api/exam-schedules/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setSchedules(prev => prev.filter(s => s._id !== id));
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const getSchedulesForExam = (examId: string) =>
    schedules.filter(s => s.examId === examId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleExport = () => {
    const headers = ['Name', 'Type', 'Start Date', 'End Date', 'Class', 'Section', 'Academic Year'];
    const rows = exams.map(e => [e.name, e.type, e.startDate, e.endDate, e.className, e.section, e.academicYear]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exams-${new Date().toISOString().split('T')[0]}.csv`;
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
          return { name: v[0], type: v[1] as Exam['type'], startDate: v[2], endDate: v[3], className: v[4], section: v[5], academicYear: v[6] };
        });
        for (const item of data) {
          await fetch('/api/exams', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        }
        const updated = await fetch('/api/exams').then(r => r.json());
        setExams(Array.isArray(updated) ? updated : []);
        alert(`Imported ${data.length} exams`);
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
            <h1 className="text-2xl font-bold text-gray-800">Exams</h1>
            <p className="text-sm text-gray-500">Manage exams and schedules</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Export CSV</button>
            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer">
              Import CSV
              <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
            </label>
            <button onClick={() => handleOpenExamModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Exam</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4">
            <input type="text" placeholder="Search exams..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
            <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Classes</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Types</option>
              <option value="First Terminal">First Terminal</option>
              <option value="Mid Terminal">Mid Terminal</option>
              <option value="Final Terminal">Final Terminal</option>
              <option value="Pre-Board">Pre-Board</option>
            </select>
            <span className="text-sm text-gray-500 ml-auto">{filtered.length} exams</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Start Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">End Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(e => (
                  <tr key={e._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{e.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        e.type === 'First Terminal' ? 'bg-blue-100 text-blue-700' :
                        e.type === 'Mid Terminal' ? 'bg-yellow-100 text-yellow-700' :
                        e.type === 'Final Terminal' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>{e.type}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{e.startDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{e.endDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{e.className} - {e.section}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setShowSchedulePanel(showSchedulePanel === e._id ? null : e._id!)}
                          className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-medium hover:bg-teal-200">
                          {showSchedulePanel === e._id ? 'Hide Schedule' : 'View Schedule'}
                        </button>
                        <button onClick={() => handleOpenExamModal(e)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200">Edit</button>
                        <button onClick={() => handleDeleteExam(e._id!)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showSchedulePanel && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Schedule - {exams.find(e => e._id === showSchedulePanel)?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {exams.find(e => e._id === showSchedulePanel)?.className} - {exams.find(e => e._id === showSchedulePanel)?.section}
                </p>
              </div>
              <button onClick={() => handleOpenScheduleModal(showSchedulePanel)}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Schedule</button>
            </div>
            <div className="overflow-x-auto">
              {getSchedulesForExam(showSchedulePanel).length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">No schedule entries yet. Click "+ Add Schedule" to add one.</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Start Time</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">End Time</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Full Marks</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pass Marks</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {getSchedulesForExam(showSchedulePanel).map(s => (
                      <tr key={s._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{s.subject}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{s.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{s.startTime}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{s.endTime}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{s.fullMarks}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{s.passMarks}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteSchedule(s._id!)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {showExamModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">{editingExam ? 'Edit Exam' : 'Add Exam'}</h2>
                <button onClick={() => setShowExamModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              </div>
              <form onSubmit={handleExamSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name *</label>
                  <input type="text" value={examForm.name} onChange={e => setExamForm({...examForm, name: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select value={examForm.type} onChange={e => setExamForm({...examForm, type: e.target.value as Exam['type']})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="First Terminal">First Terminal</option>
                      <option value="Mid Terminal">Mid Terminal</option>
                      <option value="Final Terminal">Final Terminal</option>
                      <option value="Pre-Board">Pre-Board</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                    <select value={examForm.className} onChange={e => setExamForm({...examForm, className: e.target.value, section: ''})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Class</option>
                      {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
                    <select value={examForm.section} onChange={e => setExamForm({...examForm, section: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Section</option>
                      {getSectionsForClass(examForm.className).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input type="date" value={examForm.startDate} onChange={e => setExamForm({...examForm, startDate: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <input type="date" value={examForm.endDate} onChange={e => setExamForm({...examForm, endDate: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                    <select value={examForm.academicYear} onChange={e => setExamForm({...examForm, academicYear: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {academicYears.map(y => <option key={y.year} value={y.year}>{y.year} {y.isCurrent && '(Current)'}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setShowExamModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">{editingExam ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Add Schedule Entry</h2>
                <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              </div>
              <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <input type="text" value={scheduleForm.subject} onChange={e => setScheduleForm({...scheduleForm, subject: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input type="date" value={scheduleForm.date} onChange={e => setScheduleForm({...scheduleForm, date: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                    <input type="time" value={scheduleForm.startTime} onChange={e => setScheduleForm({...scheduleForm, startTime: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                    <input type="time" value={scheduleForm.endTime} onChange={e => setScheduleForm({...scheduleForm, endTime: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Marks *</label>
                    <input type="number" value={scheduleForm.fullMarks} onChange={e => setScheduleForm({...scheduleForm, fullMarks: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pass Marks *</label>
                    <input type="number" value={scheduleForm.passMarks} onChange={e => setScheduleForm({...scheduleForm, passMarks: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setShowScheduleModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
