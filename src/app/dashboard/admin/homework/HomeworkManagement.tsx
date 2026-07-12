'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, AcademicYear, ClassSection } from '@/types';

interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export default function HomeworkManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '', className: '', section: '', subject: '', description: '', dueDate: '', status: 'Pending' as string, priority: 'Medium' as string, academicYear: ''
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hwRes, csRes, yearsRes] = await Promise.all([
          fetch('/api/homework').then(r => r.json()),
          fetch('/api/class-sections').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
        ]);
        setHomeworks(Array.isArray(hwRes) ? hwRes : []);
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

  if (loading) return <div className="d-flex align-items-center justify-content-center p-5" style={{minHeight:'300px'}}>Loading...</div>;
  if (!user || user.role !== 'admin') return <div className="d-flex align-items-center justify-content-center p-5" style={{minHeight:'300px'}}>Access denied</div>;

  const currentYear = academicYears.find(y => y.isCurrent)?.year || academicYears[0]?.year || '';
  const classes = [...new Set(classSections.map(c => c.className))].sort();
  const sections = [...new Set(classSections.map(c => c.section))].sort();

  const filtered = homeworks.filter(h => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = h.title.toLowerCase().includes(q) || h.subject.toLowerCase().includes(q);
    const matchesClass = filterClass === 'all' || h.className === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title, className: item.className, section: item.section, subject: item.subject,
        description: item.description, dueDate: item.dueDate, status: item.status || 'Pending',
        priority: item.priority || 'Medium', academicYear: item.academicYear || currentYear
      });
      setAttachments(item.attachments || []);
    } else {
      setEditingItem(null);
      setFormData({ title: '', className: '', section: '', subject: '', description: '', dueDate: '', status: 'Pending', priority: 'Medium', academicYear: currentYear });
      setAttachments([]);
    }
    setShowModal(true);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAttachments: Attachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });
      newAttachments.push({ name: file.name, url: dataUrl, type: file.type, size: file.size });
    }
    setAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('sheet') || type.includes('excel')) return '📊';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📎';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/homework/${editingItem._id}` : '/api/homework';
      const method = editingItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, attachments })
      });
      if (!res.ok) throw new Error('Failed to save');
      setShowModal(false);
      const updated = await fetch('/api/homework').then(r => r.json());
      setHomeworks(Array.isArray(updated) ? updated : []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save homework');
    }
  };

  const downloadAttachment = (att: Attachment) => {
    if (att.url && att.url !== '#') {
      const a = document.createElement('a');
      a.href = att.url;
      a.download = att.name;
      a.click();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this homework?')) return;
    try {
      const res = await fetch(`/api/homework/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const updated = await fetch('/api/homework').then(r => r.json());
      setHomeworks(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const handleExport = () => {
    const headers = ['Title', 'Class', 'Section', 'Subject', 'Description', 'Due Date', 'Status', 'Priority', 'Academic Year'];
    const rows = filtered.map(h => [h.title, h.className, h.section, h.subject, h.description, h.dueDate, h.status || '', h.priority || '', h.academicYear]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `homework-${new Date().toISOString().split('T')[0]}.csv`;
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
            title: v[0], className: v[1], section: v[2], subject: v[3], description: v[4],
            dueDate: v[5], status: v[6] || 'Pending', priority: v[7] || 'Medium', academicYear: v[8] || currentYear,
            attachments: []
          };
        });
        for (const item of data) {
          await fetch('/api/homework', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        }
        const updated = await fetch('/api/homework').then(r => r.json());
        setHomeworks(Array.isArray(updated) ? updated : []);
        alert(`Imported ${data.length} homework entries`);
      } catch (error) {
        alert('Import failed');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
          <h3 className="card-title mb-0">Homework</h3>
          <div className="d-flex align-items-center gap-2">
            <button onClick={handleExport} className="btn btn-sm" style={{ backgroundColor: '#28a745', color: '#fff', border: 'none' }}>Export CSV</button>
            <label className="btn btn-sm" style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Import CSV
              <input type="file" accept=".csv" onChange={handleImport} className="d-none" />
            </label>
            <button onClick={() => handleOpenModal()} className="btn btn-sm" style={{ backgroundColor: '#6610f2', color: '#fff', border: 'none' }}>+ Add Homework</button>
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
            <input type="text" placeholder="Search homework..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-control form-control-sm" style={{ width: '250px' }} />
            <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
              className="form-select form-select-sm" style={{ width: '150px' }}>
              <option value="all">All Classes</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="text-muted small ms-auto">{filtered.length} homework</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d' }}>Title</th>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d' }}>Class</th>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d' }}>Subject</th>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d' }}>Attachments</th>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d' }}>Due Date</th>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d' }}>Status</th>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-4 text-muted">No homework found</td></tr>
                )}
                {filtered.map(h => (
                  <tr key={h._id}>
                    <td className="px-3 py-2">
                      <div className="fw-semibold">{h.title}</div>
                      {h.description && <div className="text-muted small" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.description}</div>}
                    </td>
                    <td className="px-3 py-2">{h.className} {h.section}</td>
                    <td className="px-3 py-2">{h.subject}</td>
                    <td className="px-3 py-2">
                      {h.attachments && h.attachments.length > 0 ? (
                        <div className="d-flex flex-column gap-1">
                          {h.attachments.map((att: Attachment, i: number) => (
                            <div key={i} className="d-flex align-items-center gap-1">
                              <span>{getFileIcon(att.type)}</span>
                              <a href={att.url !== '#' ? att.url : undefined}
                                onClick={e => { if (att.url === '#') e.preventDefault(); else downloadAttachment(att); }}
                                className="text-decoration-none small" style={{ color: '#007bff', cursor: att.url !== '#' ? 'pointer' : 'default' }}>
                                {att.name}
                              </a>
                              <small className="text-muted">({formatFileSize(att.size)})</small>
                            </div>
                          ))}
                        </div>
                      ) : <span className="text-muted small">No files</span>}
                    </td>
                    <td className="px-3 py-2">{h.dueDate}</td>
                    <td className="px-3 py-2">
                      <span className={`badge ${
                        h.status === 'Completed' ? 'bg-success' :
                        h.status === 'Due Today' ? 'bg-warning text-dark' :
                        h.status === 'Draft' ? 'bg-secondary' :
                        'bg-info'
                      }`}>{h.status || 'Pending'}</span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="d-flex gap-1">
                        <button onClick={() => handleOpenModal(h)}
                          className="btn btn-sm" style={{ color: '#007bff', border: '1px solid #007bff', background: 'transparent' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(h._id)}
                          className="btn btn-sm" style={{ color: '#dc3545', border: '1px solid #dc3545', background: 'transparent' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editingItem ? 'Edit Homework' : 'Add Homework'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-medium">Title *</label>
                      <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="form-control" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Class *</label>
                      <select value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} required className="form-select">
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Section</label>
                      <select value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className="form-select">
                        <option value="">All Sections</option>
                        {sections.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Subject *</label>
                      <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required className="form-control" />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-medium">Due Date *</label>
                      <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} required className="form-control" />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-medium">Status</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="form-select">
                        <option value="Pending">Pending</option>
                        <option value="Due Today">Due Today</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-medium">Priority</label>
                      <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="form-select">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-medium">Academic Year</label>
                      <select value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})} className="form-select">
                        {academicYears.map(y => <option key={y.year} value={y.year}>{y.year} {y.isCurrent ? '(Current)' : ''}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Description</label>
                      <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="form-control" />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Attachments</label>
                      <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="form-control" />
                      {attachments.length > 0 && (
                        <div className="mt-2 d-flex flex-column gap-1">
                          {attachments.map((att, i) => (
                            <div key={i} className="d-flex align-items-center justify-content-between p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                              <div className="d-flex align-items-center gap-2">
                                <span>{getFileIcon(att.type)}</span>
                                <span className="small fw-medium">{att.name}</span>
                                <small className="text-muted">({formatFileSize(att.size)})</small>
                              </div>
                              <button type="button" onClick={() => handleRemoveAttachment(i)}
                                className="btn btn-sm btn-outline-danger px-2 py-0">Remove</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingItem ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
