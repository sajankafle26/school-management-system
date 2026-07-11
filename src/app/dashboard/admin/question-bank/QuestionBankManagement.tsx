'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, QuestionBank, QuestionGroup, QuestionLevel, ClassSection, AcademicYear } from '@/types';

const QUESTION_TYPES = ['Single Choice', 'Multiple Choice', 'True/False', 'Descriptive'] as const;
const SUBJECTS = ['Mathematics', 'Science', 'English', 'Nepali', 'Social Studies', 'EPH', 'Computer', 'Health'];

export default function QuestionBankManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<QuestionBank[]>([]);
  const [groups, setGroups] = useState<QuestionGroup[]>([]);
  const [levels, setLevels] = useState<QuestionLevel[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<QuestionBank | null>(null);
  const [formData, setFormData] = useState({
    question: '', type: 'Single Choice' as QuestionBank['type'], options: ['', ''],
    correctAnswer: '', groupId: '', levelId: '', className: '', subject: '',
    mark: '', academicYear: ''
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes, groupsRes, levelsRes, csRes, yearsRes] = await Promise.all([
          fetch('/api/question-bank').then(r => r.json()),
          fetch('/api/question-groups').then(r => r.json()),
          fetch('/api/question-levels').then(r => r.json()),
          fetch('/api/class-sections').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
        ]);
        setQuestions(Array.isArray(questionsRes) ? questionsRes : []);
        setGroups(Array.isArray(groupsRes) ? groupsRes : []);
        setLevels(Array.isArray(levelsRes) ? levelsRes : []);
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

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || q.type === filterType;
    const matchesClass = filterClass === 'all' || q.className === filterClass;
    const matchesGroup = filterGroup === 'all' || q.groupId === filterGroup;
    return matchesSearch && matchesType && matchesClass && matchesGroup;
  });

  const getGroupName = (id: string) => groups.find(g => g._id === id)?.name || 'Unknown';
  const getLevelName = (id: string) => levels.find(l => l._id === id)?.name || 'Unknown';

  const truncate = (text: string, len: number) => text.length > len ? text.slice(0, len) + '...' : text;

  const handleOpenModal = (item?: QuestionBank) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        question: item.question,
        type: item.type,
        options: item.options && item.options.length > 0 ? item.options : ['', ''],
        correctAnswer: item.correctAnswer,
        groupId: item.groupId,
        levelId: item.levelId,
        className: item.className,
        subject: item.subject,
        mark: String(item.mark),
        academicYear: item.academicYear || currentYear
      });
    } else {
      setEditingItem(null);
      setFormData({
        question: '', type: 'Single Choice', options: ['', ''],
        correctAnswer: '', groupId: '', levelId: '', className: '',
        subject: '', mark: '', academicYear: currentYear
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        question: formData.question,
        type: formData.type,
        correctAnswer: formData.correctAnswer,
        groupId: formData.groupId,
        levelId: formData.levelId,
        className: formData.className,
        subject: formData.subject,
        mark: Number(formData.mark),
        academicYear: formData.academicYear
      };
      if (formData.type === 'Single Choice' || formData.type === 'Multiple Choice') {
        payload.options = formData.options.filter(o => o.trim() !== '');
      }
      const url = editingItem ? `/api/question-bank/${editingItem._id}` : '/api/question-bank';
      const method = editingItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save');
      setShowModal(false);
      const updated = await fetch('/api/question-bank').then(r => r.json());
      setQuestions(Array.isArray(updated) ? updated : []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save question');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    try {
      const res = await fetch(`/api/question-bank/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const updated = await fetch('/api/question-bank').then(r => r.json());
      setQuestions(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const handleExport = () => {
    const headers = ['Question', 'Type', 'Options', 'Correct Answer', 'Group', 'Level', 'Class', 'Subject', 'Mark', 'Academic Year'];
    const rows = questions.map(q => [
      q.question, q.type, (q.options || []).join('|'), q.correctAnswer,
      getGroupName(q.groupId), getLevelName(q.levelId),
      q.className, q.subject, String(q.mark), q.academicYear
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question-bank-${new Date().toISOString().split('T')[0]}.csv`;
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
          return {
            question: v[0], type: v[1] as QuestionBank['type'],
            options: v[2] ? v[2].split('|') : [],
            correctAnswer: v[3], groupId: v[4], levelId: v[5],
            className: v[6], subject: v[7], mark: Number(v[8]), academicYear: v[9] || currentYear
          };
        });
        for (const item of data) {
          await fetch('/api/question-bank', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        }
        const updated = await fetch('/api/question-bank').then(r => r.json());
        setQuestions(Array.isArray(updated) ? updated : []);
        alert(`Imported ${data.length} questions`);
      } catch (error) {
        alert('Import failed');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) return;
    setFormData({ ...formData, options: formData.options.filter((_, i) => i !== index) });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const showOptions = formData.type === 'Single Choice' || formData.type === 'Multiple Choice';

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Question Bank</h1>
            <p className="text-sm text-gray-500">Manage question bank for online exams</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Export CSV</button>
            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer">
              Import CSV
              <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
            </label>
            <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Question</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <input type="text" placeholder="Search questions..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Types</option>
              {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Classes</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Groups</option>
              {groups.map(g => <option key={g._id} value={g._id!}>{g.name}</option>)}
            </select>
            <span className="text-sm text-gray-500 ml-auto">{filteredQuestions.length} questions</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Question</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Group</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Level</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Mark</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredQuestions.map(q => (
                  <tr key={q._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 max-w-xs">
                      <span title={q.question}>{truncate(q.question, 60)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">{q.type}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{getGroupName(q.groupId)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{getLevelName(q.levelId)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{q.className}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{q.mark}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenModal(q)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200">Edit</button>
                        <button onClick={() => handleDelete(q._id!)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Delete</button>
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
                <h2 className="text-xl font-bold text-gray-800">{editingItem ? 'Edit Question' : 'Add Question'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                  <textarea value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} required rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as QuestionBank['type'], options: e.target.value === 'Single Choice' || e.target.value === 'Multiple Choice' ? formData.options : []})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group *</label>
                    <select value={formData.groupId} onChange={e => setFormData({...formData, groupId: e.target.value})} required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Group</option>
                      {groups.map(g => <option key={g._id} value={g._id!}>{g.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                    <select value={formData.levelId} onChange={e => setFormData({...formData, levelId: e.target.value})} required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Level</option>
                      {levels.map(l => <option key={l._id} value={l._id!}>{l.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                    <select value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Class</option>
                      {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Subject</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mark *</label>
                    <input type="number" value={formData.mark} onChange={e => setFormData({...formData, mark: e.target.value})} required min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {showOptions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    {formData.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <input type="text" value={opt} onChange={e => updateOption(i, e.target.value)}
                          placeholder={`Option ${i + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button type="button" onClick={() => removeOption(i)}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={addOption}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm font-medium hover:bg-gray-200">+ Add Option</button>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer *</label>
                  <input type="text" value={formData.correctAnswer} onChange={e => setFormData({...formData, correctAnswer: e.target.value})} required
                    placeholder={showOptions ? 'Enter the exact correct option value' : 'True, False, or descriptive answer'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                  <select value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
