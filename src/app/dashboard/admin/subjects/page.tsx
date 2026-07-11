'use client';
import DashboardLayout from '@/components/DashboardLayout';

const defaultSubjects = [
  { name: 'Nepali', code: 'NEP', class: '8-10', type: 'Theory' },
  { name: 'English', code: 'ENG', class: '8-10', type: 'Theory' },
  { name: 'C. Maths', code: 'MAT', class: '8-10', type: 'Theory' },
  { name: 'Science', code: 'SCI', class: '8-10', type: 'Theory+Practical' },
  { name: 'Social Studies', code: 'SOC', class: '8-10', type: 'Theory' },
  { name: 'EPH', code: 'EPH', class: '8-10', type: 'Theory' },
  { name: 'Accountancy', code: 'ACC', class: '11-12', type: 'Theory' },
  { name: 'Economics', code: 'ECO', class: '11-12', type: 'Theory' },
  { name: 'Computer Science', code: 'COM', class: '9-12', type: 'Theory+Practical' },
];

export default function SubjectsPage() {
  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h3 className="card-title mb-0">Subjects</h3>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d' }}>Subject Name</th>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d' }}>Code</th>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d' }}>Class</th>
                  <th className="px-3 py-3" style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#6c757d' }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {defaultSubjects.map((s, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2">{s.name}</td>
                    <td className="px-3 py-2"><code>{s.code}</code></td>
                    <td className="px-3 py-2">{s.class}</td>
                    <td className="px-3 py-2"><span className="badge" style={{ backgroundColor: '#e9ecef', color: '#495057' }}>{s.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
