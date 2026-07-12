'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, ClassSection } from '@/types';

export default function ClassesManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editValue, setEditValue] = useState('');
  const [newClass, setNewClass] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    fetch('/api/class-sections').then(r => r.json()).then(data => {
      setClassSections(Array.isArray(data) ? data : []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="d-flex align-items-center justify-content-center p-5" style={{minHeight:'300px'}}>Loading...</div>;
  if (!user || user.role !== 'admin') return <div className="d-flex align-items-center justify-content-center p-5" style={{minHeight:'300px'}}>Access denied</div>;

  const classes = [...new Set(classSections.map(c => c.className))].sort((a, b) => {
    const na = parseInt(a), nb = parseInt(b);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  });

  const filtered = classes.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAdd = async () => {
    const trimmed = newClass.trim();
    if (!trimmed) return;
    if (classes.includes(trimmed)) { alert('Class already exists'); return; }
    try {
      const currentYear = classSections.find(cs => cs.academicYear)?.academicYear || '';
      await fetch('/api/class-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ className: trimmed, section: 'A', capacity: 40, academicYear: currentYear })
      });
      setNewClass('');
      const updated = await fetch('/api/class-sections').then(r => r.json());
      setClassSections(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to add class');
    }
  };

  const handleRename = async (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) { setEditingIndex(-1); return; }
    const toUpdate = classSections.filter(cs => cs.className === oldName);
    if (toUpdate.length === 0) return;
    try {
      await Promise.all(toUpdate.map(cs =>
        fetch(`/api/class-sections/${cs._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...cs, className: trimmed })
        })
      ));
      setEditingIndex(-1);
      const updated = await fetch('/api/class-sections').then(r => r.json());
      setClassSections(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to rename class');
    }
  };

  const handleDelete = async (className: string) => {
    if (!confirm(`Delete class "${className}" and all its sections?`)) return;
    const toDelete = classSections.filter(cs => cs.className === className);
    try {
      await Promise.all(toDelete.map(cs =>
        fetch(`/api/class-sections/${cs._id}`, { method: 'DELETE' })
      ));
      const updated = await fetch('/api/class-sections').then(r => r.json());
      setClassSections(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to delete class');
    }
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
          <h3 className="card-title mb-0">Classes</h3>
          <div className="d-flex align-items-center gap-2">
            <input
              type="text" placeholder="Search classes..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="form-control form-control-sm" style={{ width: '200px' }}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center gap-2 mb-3">
            <input
              type="text" placeholder="New class name (e.g. 11, 12)"
              value={newClass} onChange={e => setNewClass(e.target.value)}
              className="form-control form-control-sm" style={{ width: '250px' }}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button onClick={handleAdd} className="btn btn-sm" style={{ backgroundColor: '#007bff', color: '#fff', border: 'none' }}>Add Class</button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d', width: '60px' }}>#</th>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d' }}>Class</th>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d', width: '100px' }}>Sections</th>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d', width: '200px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-4" style={{ color: '#6c757d' }}>No classes found</td></tr>
                )}
                {filtered.map((cls, idx) => {
                  const sectionCount = classSections.filter(cs => cs.className === cls).length;
                  return (
                    <tr key={cls}>
                      <td className="px-3 py-2" style={{ color: '#6c757d' }}>{idx + 1}</td>
                      <td className="px-3 py-2">
                        {editingIndex === idx ? (
                          <div className="d-flex align-items-center gap-1">
                            <input type="text" value={editValue} onChange={e => setEditValue(e.target.value)}
                              className="form-control form-control-sm" style={{ width: '100px' }}
                              onKeyDown={e => { if (e.key === 'Enter') handleRename(cls, editValue); if (e.key === 'Escape') setEditingIndex(-1); }} />
                            <button onClick={() => handleRename(cls, editValue)} className="btn btn-sm btn-success px-2 py-0">Save</button>
                            <button onClick={() => setEditingIndex(-1)} className="btn btn-sm btn-secondary px-2 py-0">Cancel</button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>Class {cls}</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span className="badge" style={{ backgroundColor: '#e9ecef', color: '#495057' }}>{sectionCount} section{sectionCount !== 1 ? 's' : ''}</span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="d-flex align-items-center gap-1">
                          <button onClick={() => { setEditingIndex(idx); setEditValue(cls); }}
                            className="btn btn-sm px-2 py-0" style={{ color: '#007bff', border: '1px solid #007bff', background: 'transparent' }}>
                            Rename
                          </button>
                          <button onClick={() => handleDelete(cls)}
                            className="btn btn-sm px-2 py-0" style={{ color: '#dc3545', border: '1px solid #dc3545', background: 'transparent' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
