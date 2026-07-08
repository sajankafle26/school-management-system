import React from 'react';
import type { User, FeeInvoice } from '../types';
import AdminDashboard from './dashboards/AdminDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import StudentDashboard from './dashboards/StudentDashboard';
import ParentDashboard from './dashboards/ParentDashboard';
import StaffDashboard from './dashboards/StaffDashboard';
import DriverDashboard from './dashboards/DriverDashboard';

interface DashboardProps {
    user: User;
    selectedAcademicYear: string;
    invoices: FeeInvoice[];
    setInvoices: React.Dispatch<React.SetStateAction<FeeInvoice[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, selectedAcademicYear, invoices, setInvoices }) => {
    switch (user.role) {
        case 'admin':
            return <AdminDashboard selectedAcademicYear={selectedAcademicYear} invoices={invoices} />;
        case 'teacher':
            return <TeacherDashboard user={user} selectedAcademicYear={selectedAcademicYear} />;
        case 'student':
            return <StudentDashboard user={user} selectedAcademicYear={selectedAcademicYear} invoices={invoices} setInvoices={setInvoices} />;
        case 'parent':
            return <ParentDashboard user={user} selectedAcademicYear={selectedAcademicYear} invoices={invoices} setInvoices={setInvoices} />;
        case 'staff':
            return <StaffDashboard user={user} selectedAcademicYear={selectedAcademicYear} />;
        case 'driver':
            return <DriverDashboard user={user} selectedAcademicYear={selectedAcademicYear} />;
        default:
            return <div>Welcome!</div>;
    }
};

export default Dashboard;