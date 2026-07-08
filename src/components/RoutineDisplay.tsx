import React from 'react';
import type { ClassRoutine, Teacher, Period } from '../types';
import { daysOfWeek } from '../data/mockData';

interface RoutineDisplayProps {
    routine: ClassRoutine | undefined;
    teachers: Teacher[];
    periods: Period[];
}

const subjectColors = [
    'bg-blue-100 border-blue-200 text-blue-800',
    'bg-green-100 border-green-200 text-green-800',
    'bg-yellow-100 border-yellow-200 text-yellow-800',
    'bg-purple-100 border-purple-200 text-purple-800',
    'bg-indigo-100 border-indigo-200 text-indigo-800',
    'bg-pink-100 border-pink-200 text-pink-800',
    'bg-red-100 border-red-200 text-red-800',
    'bg-gray-100 border-gray-200 text-gray-800',
];

const getSubjectColor = (subject: string) => {
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
        hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % subjectColors.length);
    return subjectColors[index];
};


const RoutineDisplay: React.FC<RoutineDisplayProps> = ({ routine, teachers, periods }) => {
    const teachersMap = new Map(teachers.map(t => [t.id, t.name]));

    if (!routine) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <h2 className="text-xl font-semibold text-gray-700">No Routine Found</h2>
                <p className="text-gray-500 mt-2">A routine has not been set for this class yet.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th className="p-3 font-semibold text-sm text-gray-600 bg-gray-50 border border-gray-200 text-left">Time / Day</th>
                        {daysOfWeek.map(day => (
                            <th key={day} className="p-3 font-semibold text-sm text-gray-600 bg-gray-50 border border-gray-200 uppercase">{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {periods.map(({ period, time }) => (
                        <tr key={period}>
                            <td className="p-3 font-bold text-sm text-gray-700 bg-gray-50 border border-gray-200">
                                {time}
                            </td>
                            {daysOfWeek.map(day => {
                                const entry = routine.routine[day]?.find(e => e.period === period);
                                return (
                                    <td key={`${day}-${period}`} className="p-2 border border-gray-200 align-top h-24">
                                        {entry ? (
                                            <div className={`p-2 rounded-lg h-full flex flex-col justify-center text-center border-l-4 ${getSubjectColor(entry.subject)}`}>
                                                <p className="font-bold text-sm">{entry.subject}</p>
                                                <p className="text-xs">{entry.teacherId ? (teachersMap.get(entry.teacherId) || 'N/A') : 'N/A'}</p>
                                            </div>
                                        ) : null}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoutineDisplay;