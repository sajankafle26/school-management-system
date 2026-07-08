import React, { useState } from 'react';
import type { AcademicYear } from '../types';
import { SettingsIcon } from '../components/icons';

interface AcademicSettingsProps {
    academicYears: AcademicYear[];
    setAcademicYears: React.Dispatch<React.SetStateAction<AcademicYear[]>>;
}

const AcademicSettings: React.FC<AcademicSettingsProps> = ({ academicYears, setAcademicYears }) => {
    const [newYear, setNewYear] = useState('');

    const handleAddYear = () => {
        if (newYear.trim() && !academicYears.some(y => y.year === newYear.trim())) {
            const newAcademicYear: AcademicYear = {
                year: newYear.trim(),
                isCurrent: false,
            };
            setAcademicYears(prev => [...prev, newAcademicYear]);
            setNewYear('');
        } else {
            alert("Invalid or duplicate academic year.");
        }
    };

    const handleSetCurrent = (yearToSet: string) => {
        setAcademicYears(prev => 
            prev.map(y => ({
                ...y,
                isCurrent: y.year === yearToSet,
            }))
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Academic Settings</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Add New Year Section */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                       <SettingsIcon className="w-6 h-6 mr-3 text-blue-500" />
                       Add New Academic Year
                    </h2>
                    <div className="flex space-x-2">
                        <input 
                            type="text" 
                            value={newYear}
                            onChange={(e) => setNewYear(e.target.value)}
                            placeholder="e.g., 2081/2082"
                            className="flex-grow p-2 border border-gray-300 rounded-lg"
                        />
                        <button 
                            onClick={handleAddYear}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Manage Existing Years Section */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Academic Years</h2>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {academicYears.map(year => (
                            <div key={year.year} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className={`font-medium ${year.isCurrent ? 'text-blue-700' : 'text-gray-800'}`}>
                                    {year.year}
                                </span>
                                {year.isCurrent ? (
                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                        Current Session
                                    </span>
                                ) : (
                                    <button 
                                        onClick={() => handleSetCurrent(year.year)}
                                        className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md transition-colors"
                                    >
                                        Set as Current
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademicSettings;