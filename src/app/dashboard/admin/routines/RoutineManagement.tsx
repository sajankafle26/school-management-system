'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, AcademicYear, ClassSection } from '@/types';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const periods = [
  { period: 1, time: '10:00 - 10:45' },
  { period: 2, time: '10:45 - 11:30' },
  { period: 3, time: '11:30 - 12:15' },
  { period: 4, time: '12:15 - 1:00' },
];

const subjectColors: Record<string, string> = {
  'C. Maths': '#e3f2fd',
  'Science': '#e8f5e9',
  'English': '#fff3e0',
  'Nepali': '#fce4ec',
  'Social Studies': '#f3e5f5',
  'EPH': '#e0f7fa',
  'Accountancy': '#fff8e1',
  'Extra Curricular': '#f5f5f5',
};

const subjectTextColors: Record<string, string> = {
  'C. Maths': '#1565c0',
  'Science': '#2e7d32',
  'English': '#e65100',
  'Nepali': '#c62828',
  'Social Studies': '#6a1b9a',
  'EPH': '#00838f',
  'Accountancy': '#f57f17',
  'Extra Curricular': '#616161',
};

const getSubjectColor = (subject: string) => subjectColors[subject] || '#f5f5f5';
const getSubjectTextColor = (subject: string) => subjectTextColors[subject] || '#212529';

export default function RoutineManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCell, setEditCell] = useState<{ day: string; period: number } | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editTeacher, setEditTeacher] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [csRes, yearsRes, routRes] = await Promise.all([
          fetch('/api/class-sections').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
          fetch('/api/routines').then(r => r.json()),
        ]);
        setClassSections(Array.isArray(csRes) ? csRes : []);
        setAcademicYears(Array.isArray(yearsRes) ? yearsRes : []);
        setRoutines(Array.isArray(routRes) ? routRes : []);
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

  const classes = [...new Set(classSections.map(c => c.className))].sort((a, b) => {
    const na = parseInt(a), nb = parseInt(b);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  });
  const sections = [...new Set(classSections.filter(c => c.className === selectedClass).map(c => c.section))].sort();
  const currentYear = academicYears.find(y => y.isCurrent)?.year || academicYears[0]?.year || '';

  const year = selectedYear || currentYear;

  const classRoutines = routines.filter(r =>
    r.className === selectedClass && r.section === selectedSection && r.academicYear === year
  );

  const getEntry = (day: string, period: number) => {
    const dayRoutine = classRoutines.find(r => r.day === day);
    if (!dayRoutine) return null;
    return dayRoutine.periods?.find((p: any) => p.period === period) || null;
  };

  const handleOpenEdit = (day: string, period: number) => {
    const entry = getEntry(day, period);
    setEditCell({ day, period });
    setEditSubject(entry?.subject || '');
    setEditTeacher(entry?.teacherId ? String(entry.teacherId) : '');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editCell) return;
    const { day, period } = editCell;
    const existing = classRoutines.find(r => r.day === day);

    try {
      if (existing) {
        const existingPeriods = existing.periods || [];
        const periodIdx = existingPeriods.findIndex((p: any) => p.period === period);
        let newPeriods;
        if (periodIdx > -1) {
          newPeriods = [...existingPeriods];
          newPeriods[periodIdx] = { period, subject: editSubject, teacherId: editTeacher ? Number(editTeacher) : null };
        } else {
          newPeriods = [...existingPeriods, { period, subject: editSubject, teacherId: editTeacher ? Number(editTeacher) : null }];
        }
        await fetch(`/api/routines/${existing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ periods: newPeriods })
        });
      } else {
        await fetch('/api/routines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            className: selectedClass, section: selectedSection, day,
            periods: [{ period, subject: editSubject, teacherId: editTeacher ? Number(editTeacher) : null }],
            academicYear: year
          })
        });
      }
      setShowModal(false);
      const updated = await fetch('/api/routines').then(r => r.json());
      setRoutines(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to save routine entry');
    }
  };

  const handleClearDay = async (day: string) => {
    if (!confirm(`Clear all entries for ${day}?`)) return;
    const existing = classRoutines.find(r => r.day === day);
    if (!existing) return;
    try {
      await fetch(`/api/routines/${existing._id}`, { method: 'DELETE' });
      const updated = await fetch('/api/routines').then(r => r.json());
      setRoutines(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to clear day');
    }
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
          <h3 className="card-title mb-0">Routine / Timetable</h3>
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
            <div>
              <label className="form-label fw-medium small mb-1">Class</label>
              <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedSection(''); }}
                className="form-select form-select-sm" style={{ width: '140px' }}>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label fw-medium small mb-1">Section</label>
              <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}
                className="form-select form-select-sm" style={{ width: '120px' }} disabled={!selectedClass}>
                <option value="">Select</option>
                {sections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label fw-medium small mb-1">Academic Year</label>
              <select value={year} onChange={e => setSelectedYear(e.target.value)}
                className="form-select form-select-sm" style={{ width: '140px' }}>
                {academicYears.map(y => <option key={y.year} value={y.year}>{y.year}</option>)}
              </select>
            </div>
          </div>

          {!selectedClass || !selectedSection ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-0" style={{ fontSize: '1.1rem' }}>Select a class and section to view the timetable</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered mb-0" style={{ minWidth: '700px' }}>
                <thead>
                  <tr>
                    <th className="text-center align-middle px-3 py-3" style={{ width: '130px', backgroundColor: '#f8f9fa', fontWeight: 600, fontSize: '0.8rem', color: '#495057' }}>
                      Time / Day
                    </th>
                    {daysOfWeek.map(day => (
                      <th key={day} className="text-center align-middle px-2 py-3" style={{ backgroundColor: '#f8f9fa', fontWeight: 600, fontSize: '0.8rem', color: '#495057', textTransform: 'uppercase' }}>
                        <div className="d-flex align-items-center justify-content-center gap-1">
                          <span>{day.slice(0, 3)}</span>
                          {classRoutines.find(r => r.day === day) && (
                            <button onClick={() => handleClearDay(day)}
                              className="btn btn-sm p-0" style={{ color: '#dc3545', fontSize: '0.7rem', lineHeight: 1 }}
                              title="Clear day">&times;</button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map(({ period, time }) => (
                    <tr key={period}>
                      <td className="text-center align-middle px-2 py-2" style={{ backgroundColor: '#f8f9fa', fontWeight: 600, fontSize: '0.8rem', color: '#495057' }}>
                        <div className="small">{time}</div>
                      </td>
                      {daysOfWeek.map(day => {
                        const entry = getEntry(day, period);
                        const bgColor = entry ? getSubjectColor(entry.subject) : '#fff';
                        const textColor = entry ? getSubjectTextColor(entry.subject) : '#6c757d';
                        return (
                          <td key={`${day}-${period}`}
                            onClick={() => handleOpenEdit(day, period)}
                            className="text-center align-middle px-1 py-1"
                            style={{ backgroundColor: bgColor, cursor: 'pointer', minHeight: '70px', verticalAlign: 'middle', transition: 'box-shadow 0.15s', border: '1px solid #dee2e6' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'inset 0 0 0 2px #007bff'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                            {entry ? (
                              <div>
                                <div className="fw-bold small" style={{ color: textColor }}>{entry.subject}</div>
                              </div>
                            ) : (
                              <span className="small" style={{ color: '#adb5bd' }}>+</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedClass && selectedSection && (
            <div className="mt-3 text-muted small">
              <span className="fw-medium">Class {selectedClass} - Section {selectedSection}</span>
              <span className="ms-3">Academic Year: {year}</span>
              <span className="ms-3">Click any cell to add/edit subject</span>
            </div>
          )}
        </div>
      </div>

      {showModal && editCell && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editCell.day} - Period {editCell.period}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Subject</label>
                  <input type="text" value={editSubject}
                    onChange={e => setEditSubject(e.target.value)}
                    className="form-control" list="subjectList" />
                  <datalist id="subjectList">
                    {['C. Maths', 'Science', 'English', 'Nepali', 'Social Studies', 'EPH', 'Accountancy', 'Extra Curricular'].map(s => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Teacher ID</label>
                  <input type="number" value={editTeacher}
                    onChange={e => setEditTeacher(e.target.value)}
                    className="form-control" placeholder="Optional" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
