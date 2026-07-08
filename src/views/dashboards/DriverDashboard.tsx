import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { User, Driver, Bus, Student } from '../../types';
import { BusIcon, SteeringWheelIcon, RouteIcon, StudentsIcon } from '../../components/icons';
import DashboardCard from '../../components/DashboardCard';

interface DriverDashboardProps {
    user: User;
    selectedAcademicYear: string;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user, selectedAcademicYear }) => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [buses, setBuses] = useState<Bus[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        fetch('/api/drivers').then(res => res.json()).then(setDrivers).catch(console.error);
        fetch('/api/buses').then(res => res.json()).then(setBuses).catch(console.error);
        fetch('/api/students').then(res => res.json()).then(setStudents).catch(console.error);
    }, []);

    const driverDetails = drivers.find(d => d.id === user.referenceId);
    const busDetails = buses.find(b => b.id === driverDetails?.busId);
    const assignedStudents = useMemo(() => 
        students.filter(s => s.busId === busDetails?.id && s.academicYear === selectedAcademicYear),
        [students, busDetails, selectedAcademicYear]
    );

    const [busStatus, setBusStatus] = useState<'parked' | 'morning' | 'afternoon'>('parked');
    const [busPosition, setBusPosition] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const handleStartMorning = () => {
        setBusStatus('morning');
    };

    const handleEndRoute = () => {
        setBusStatus('parked');
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    useEffect(() => {
        if (busStatus === 'morning') {
            intervalRef.current = window.setInterval(() => {
                setBusPosition(prev => {
                    if (prev >= 100) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        setBusStatus('parked');
                        return 100;
                    }
                    return prev + 1;
                });
            }, 200);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [busStatus]);
    
    if (!driverDetails || !busDetails) {
        return <div className="text-red-500">Error: Driver or Bus details not found.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {driverDetails.name}!</h1>
            <p className="text-gray-600 mb-6">Here is your dashboard for today.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <DashboardCard title="Bus Number" value={busDetails.busNumber} icon={<BusIcon className="w-8 h-8 text-white" />} color="bg-blue-500" />
                <DashboardCard title="Assigned Route" value={busDetails.route} icon={<RouteIcon className="w-8 h-8 text-white" />} color="bg-green-500" />
                <DashboardCard title="Total Students" value={assignedStudents.length} icon={<StudentsIcon className="w-8 h-8 text-white" />} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                        <SteeringWheelIcon className="w-6 h-6 mr-3 text-indigo-500" />
                        Route Control
                    </h2>
                    
                    <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden border p-2 mb-4">
                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-400" />
                        <div className="absolute top-1/2 left-2 text-xs font-bold">H</div>
                        <div className="absolute top-1/2 right-2 text-xs font-bold">S</div>
                        <div 
                            className="absolute top-1/2 transition-all duration-200 ease-linear"
                            style={{ left: `calc(${busPosition}% - 12px)` }}
                        >
                            <BusIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                     <p className="text-center text-sm font-semibold text-gray-600 mb-4">
                        Status: <span className="capitalize text-indigo-700">{busStatus.replace('-', ' ')}</span>
                    </p>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={handleStartMorning} 
                            disabled={busStatus !== 'parked' || busPosition > 0}
                            className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Start Morning Route
                        </button>
                        <button 
                            onClick={handleEndRoute}
                            disabled={busStatus === 'parked'}
                            className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            End Route
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Student Manifest</h2>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {assignedStudents.map(student => (
                            <div key={student.id} className="flex items-center p-3 bg-gray-50 rounded-lg border">
                                <img src={student.profilePic} alt={student.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800">{student.name}</p>
                                    <p className="text-sm text-gray-500">Class {student.className} {student.section}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-800">{student.guardianName}</p>
                                    <a href={`tel:${student.contact}`} className="text-sm text-blue-600 hover:underline">{student.contact}</a>
                                </div>
                            </div>
                        ))}
                         {assignedStudents.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No students assigned to this bus for {selectedAcademicYear}.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
