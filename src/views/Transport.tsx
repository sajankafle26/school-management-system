import React, { useState, useEffect, useMemo } from 'react';
import type { Bus, Student } from '../types';
import LiveBusMap from '../components/LiveBusMap';
import { BusIcon } from '../components/icons';

interface TransportProps {
    selectedAcademicYear: string;
}

const Transport: React.FC<TransportProps> = ({ selectedAcademicYear }) => {
    const [buses, setBuses] = useState<Bus[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        fetch('/api/buses')
            .then(res => res.json())
            .then(setBuses)
            .catch(console.error);
        fetch('/api/students')
            .then(res => res.json())
            .then(setStudents)
            .catch(console.error);
    }, []);

    // Simulate bus movement
    useEffect(() => {
        const interval = setInterval(() => {
            setBuses(prevBuses => 
                prevBuses.map(bus => {
                    let newX = bus.currentPosition.x + (Math.random() * 2);
                    if (newX > 100) newX = 0; // Reset journey
                    return { ...bus, currentPosition: { ...bus.currentPosition, x: newX } };
                })
            );
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const studentsByBus = useMemo(() => {
        const map = new Map<number, Student[]>();
        students.forEach(student => {
            if (student.busId) {
                if (!map.has(student.busId)) {
                    map.set(student.busId, []);
                }
                map.get(student.busId)!.push(student);
            }
        });
        return map;
    }, [students]);


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Transport Management</h1>

            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Live Bus Fleet Overview</h2>
                <div className="relative w-full h-80 bg-green-100 rounded-lg overflow-hidden border-2 border-green-200">
                    <div className="absolute top-1/2 left-10 right-10 h-1 border-t-2 border-dashed border-gray-400" style={{ transform: 'translateY(-50%)' }}></div>
                    <div className="absolute top-1/2 left-4 text-center" style={{ transform: 'translateY(-50%)' }}>
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">H</div>
                        <span className="text-xs font-semibold">Residences</span>
                    </div>
                    <div className="absolute top-1/2 right-4 text-center" style={{ transform: 'translateY(-50%)' }}>
                         <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">S</div>
                        <span className="text-xs font-semibold">School</span>
                    </div>

                    {buses.map(bus => (
                         <div 
                            key={bus.id}
                            className="absolute top-1/2 transition-all duration-1000 ease-linear"
                            style={{ 
                                left: `calc(10% + ${bus.currentPosition.x} * 0.8%)`,
                                transform: `translate(-50%, -50%) translateY(${(bus.id-1) * 20 - 20}px)`
                            }}
                            title={`${bus.busNumber} - ${bus.driverName}`}
                        >
                            <div className="relative flex flex-col items-center">
                                <div className="bg-gray-800 text-white text-xs rounded-md px-2 py-1 mb-2 whitespace-nowrap">
                                    {bus.busNumber}
                                </div>
                                <BusIcon className="w-10 h-10 text-gray-700" style={{ transform: 'rotate(-90deg)' }}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buses.map(bus => {
                    const assignedStudents = studentsByBus.get(bus.id) || [];
                    return (
                        <div key={bus.id} className="bg-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-indigo-100 rounded-full mr-4">
                                    <BusIcon className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{bus.busNumber}</h3>
                                    <p className="text-sm text-gray-500">{bus.route}</p>
                                </div>
                            </div>
                             <div className="text-sm space-y-2 mb-4">
                                <p><span className="font-semibold">Driver:</span> {bus.driverName}</p>
                                <p><span className="font-semibold">Contact:</span> {bus.driverContact}</p>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-600 mb-2">Assigned Students ({assignedStudents.length}):</h4>
                                <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {assignedStudents.map(student => (
                                        <li key={student.id} className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                                            {student.name} - Class {student.className} {student.section}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Transport;
