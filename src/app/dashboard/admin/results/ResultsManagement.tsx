'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, Result, Student, AcademicYear, ClassSection } from '@/types';

export default function ResultsManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterExamType, setFilterExamType] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Result | null>(null);
  const [formData, setFormData] = useState({
    studentId: '', examType: 'First Terminal' as Result['examType'],
    className: '', section: '',
    marks: [{ subject: '', marksObtained: 0, fullMarks: 100 }],
    academicYear: ''
  });

  const subjectOptions = ['Mathematics', 'Science', 'English', 'Nepali', 'Social Studies', 'EPH', 'Computer', 'Health', 'Opt. Math', 'Account'];

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resultsRes, studentsRes, csRes, yearsRes] = await Promise.all([
          fetch('/api/results').then(r => r.json()),
          fetch('/api/students').then(r => r.json()),
          fetch('/api/class-sections').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
        ]);
        setResults(Array.isArray(resultsRes) ? resultsRes : []);
        setStudents(Array.isArray(studentsRes) ? studentsRes : []);
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

  const getStudentName = (id: number) => students.find(s => s.id === id)?.name || `Student #${id}`;
  const classStudents = students.filter(s => s.className === formData.className && s.section === formData.section);

  const filtered = results.filter(r => {
    const q = searchQuery.toLowerCase();
    const studentName = getStudentName(r.studentId).toLowerCase();
    const matchesSearch = studentName.includes(q) || r.examType.toLowerCase().includes(q) || r.grade.toLowerCase().includes(q);
    const matchesType = filterExamType === 'all' || r.examType === filterExamType;
    const matchesClass = filterClass === 'all' || r.className === filterClass;
    return matchesSearch && matchesType && matchesClass;
  });

  const handleOpenModal = (item?: Result) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        studentId: String(item.studentId),
        examType: item.examType,
        className: item.className,
        section: item.section,
        marks: item.marks.length > 0 ? item.marks : [{ subject: '', marksObtained: 0, fullMarks: 100 }],
        academicYear: item.academicYear || currentYear
      });
    } else {
      setEditingItem(null);
      setFormData({
        studentId: '', examType: 'First Terminal', className: '', section: '',
        marks: [{ subject: '', marksObtained: 0, fullMarks: 100 }],
        academicYear: currentYear
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        studentId: Number(formData.studentId),
        examType: formData.examType,
        className: formData.className,
        section: formData.section,
        marks: formData.marks,
        totalMarks: formData.marks.reduce((sum, m) => sum + m.fullMarks, 0),
        marksObtained: formData.marks.reduce((sum, m) => sum + m.marksObtained, 0),
        academicYear: formData.academicYear
      };
      const url = editingItem ? `/api/results/${editingItem._id}` : '/api/results';
      const method = editingItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save');
      setShowModal(false);
      const updated = await fetch('/api/results').then(r => r.json());
      setResults(Array.isArray(updated) ? updated : []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save result');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this result?')) return;
    try {
      const res = await fetch(`/api/results/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const updated = await fetch('/api/results').then(r => r.json());
      setResults(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const addMarkRow = () => {
    setFormData({ ...formData, marks: [...formData.marks, { subject: '', marksObtained: 0, fullMarks: 100 }] });
  };

  const removeMarkRow = (index: number) => {
    if (formData.marks.length <= 1) return;
    setFormData({ ...formData, marks: formData.marks.filter((_, i) => i !== index) });
  };

  const updateMark = (index: number, field: string, value: any) => {
    const marks = [...formData.marks];
    (marks[index] as any)[field] = value;
    setFormData({ ...formData, marks });
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Results Management</h1>
            <p className="text-sm text-gray-500">Manage exam results & grade cards</p>
          </div>
          <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Result</button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-4">
            <input type="text" placeholder="Search results..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
            <select value={filterExamType} onChange={e => setFilterExamType(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Exams</option>
              <option value="First Terminal">First Terminal</option>
              <option value="Mid Terminal">Mid Terminal</option>
              <option value="Final Terminal">Final Terminal</option>
            </select>
            <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Classes</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="text-sm text-gray-500 ml-auto">{filtered.length} results</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Exam</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Percentage</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rank</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{getStudentName(r.studentId)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.className} {r.section}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.examType}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.percentage.toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        r.grade === 'A+' || r.grade === 'A' ? 'bg-green-100 text-green-700' :
                        r.grade === 'B+' || r.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                        r.grade === 'C+' || r.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>{r.grade}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{r.rank || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenModal(r)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200">Edit</button>
                        <button onClick={() => handleDelete(r._id!)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Delete</button>
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
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">{editingItem ? 'Edit Result' : 'Add Result'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                    <select value={formData.className} onChange={e => {
                      const sec = classSections.find(c => c.className === e.target.value);
                      setFormData({...formData, className: e.target.value, section: sec?.section || ''});
                    }} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Class</option>
                      {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
                    <select value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Section</option>
                      {[...new Set(classSections.filter(c => c.className === formData.className).map(c => c.section))].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                    <select value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Student</option>
                      {classStudents.map(s => <option key={s.id} value={s.id}>{s.name} (Roll: {s.roll})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type *</label>
                    <select value={formData.examType} onChange={e => setFormData({...formData, examType: e.target.value as Result['examType']})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="First Terminal">First Terminal</option>
                      <option value="Mid Terminal">Mid Terminal</option>
                      <option value="Final Terminal">Final Terminal</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">Subject Marks</h3>
                    <button type="button" onClick={addMarkRow} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm font-medium hover:bg-indigo-200">+ Add Subject</button>
                  </div>
                  <div className="space-y-2">
                    {formData.marks.map((mark, i) => (
                      <div key={i} className="grid grid-cols-[1fr_100px_100px_40px] gap-2 items-end">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                          <select value={mark.subject} onChange={e => updateMark(i, 'subject', e.target.value)}
                            className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select</option>
                            {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Obtained</label>
                          <input type="number" value={mark.marksObtained} onChange={e => updateMark(i, 'marksObtained', Number(e.target.value))}
                            className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Full Marks</label>
                          <input type="number" value={mark.fullMarks} onChange={e => updateMark(i, 'fullMarks', Number(e.target.value))}
                            className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <button type="button" onClick={() => removeMarkRow(i)}
                          className="px-2 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 disabled:opacity-50"
                          disabled={formData.marks.length <= 1}>&times;</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                  <select value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {academicYears.map(y => <option key={y.year} value={y.year}>{y.year} {y.isCurrent && '(Current)'}</option>)}
                  </select>
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