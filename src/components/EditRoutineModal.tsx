import React, { useState, useEffect } from 'react';
import type { ClassRoutine, RoutineEntry, Syllabus, Teacher, Period } from '../types';
import { daysOfWeek } from '../data/mockData';

interface EditRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routine: ClassRoutine) => void;
  routines: ClassRoutine[];
  selectedClassName: string;
  selectedSection: string;
  teachers: Teacher[];
  syllabuses: Syllabus[];
  periods: Period[];
  academicYear: string;
}

const EditRoutineModal: React.FC<EditRoutineModalProps> = ({ isOpen, onClose, onSave, routines, selectedClassName, selectedSection, teachers, syllabuses, periods, academicYear }) => {
  const [currentRoutine, setCurrentRoutine] = useState<ClassRoutine | null>(null);

  useEffect(() => {
    if (isOpen && selectedClassName && selectedSection) {
      const existingRoutine = routines.find(r => r.className === selectedClassName && r.section === selectedSection);
      if (existingRoutine) {
        setCurrentRoutine(JSON.parse(JSON.stringify(existingRoutine))); // Deep copy
      } else {
        const blankRoutine: { [day: string]: RoutineEntry[] } = {};
        daysOfWeek.forEach(day => {
          blankRoutine[day] = periods.map(p => ({ period: p.period, subject: '', teacherId: null }));
        });
        // FIX: Add academicYear to the new routine object.
        setCurrentRoutine({ className: selectedClassName, section: selectedSection, routine: blankRoutine, academicYear: academicYear });
      }
    }
  }, [isOpen, selectedClassName, selectedSection, routines, periods, academicYear]);

  const handleEntryChange = (day: string, period: number, field: 'subject' | 'teacherId', value: string) => {
    if (!currentRoutine) return;

    const updatedRoutine = { ...currentRoutine };
    const dayRoutine = updatedRoutine.routine[day] || [];
    const entryIndex = dayRoutine.findIndex(e => e.period === period);

    if (entryIndex > -1) {
      const updatedEntry = { ...dayRoutine[entryIndex] };
      if (field === 'teacherId') {
        updatedEntry.teacherId = value ? parseInt(value, 10) : null;
      } else {
        updatedEntry.subject = value;
      }
      dayRoutine[entryIndex] = updatedEntry;
    } else { // In case the day routine was empty
        const newEntry: RoutineEntry = { period, subject: '', teacherId: null };
        if (field === 'teacherId') {
            newEntry.teacherId = value ? parseInt(value, 10) : null;
        } else {
            newEntry.subject = value;
        }
        dayRoutine.push(newEntry);
    }
    
    updatedRoutine.routine[day] = dayRoutine;
    setCurrentRoutine(updatedRoutine);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRoutine) {
      onSave(currentRoutine);
    }
  };

  const classSyllabus = syllabuses.find(s => s.className === selectedClassName)?.subjects || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-6xl max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Edit Routine for Class {selectedClassName} Section {selectedSection}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button>
        </div>
        
        <div className="flex-grow overflow-auto">
            {currentRoutine ? (
                 <form onSubmit={handleSubmit}>
                    <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 font-semibold text-xs text-gray-600 bg-gray-50 border">Period</th>
                            {daysOfWeek.map(day => (
                                <th key={day} className="p-2 font-semibold text-xs text-gray-600 bg-gray-50 border uppercase">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {periods.map(({ period, time }) => (
                             <tr key={period}>
                                <td className="p-2 font-bold text-xs text-center text-gray-700 bg-gray-50 border">
                                    {time}
                                </td>
                                {daysOfWeek.map(day => {
                                    const entry = currentRoutine?.routine[day]?.find(e => e.period === period);
                                    return (
                                        <td key={`${day}-${period}`} className="p-1 border align-top">
                                           <div className="space-y-1">
                                                <select 
                                                    value={entry?.subject || ''}
                                                    onChange={e => handleEntryChange(day, period, 'subject', e.target.value)}
                                                    className="w-full p-1 text-xs border-gray-300 rounded"
                                                >
                                                    <option value="">-- Subject --</option>
                                                    {classSyllabus.map(s => <option key={s} value={s}>{s}</option>)}
                                                    <option value="Extra Curricular">Extra Curricular</option>
                                                </select>
                                                <select 
                                                    value={entry?.teacherId || ''}
                                                    onChange={e => handleEntryChange(day, period, 'teacherId', e.target.value)}
                                                    className="w-full p-1 text-xs border-gray-300 rounded"
                                                >
                                                     <option value="">-- Teacher --</option>
                                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                </select>
                                           </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-8 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Routine</button>
                </div>
              </form>
            ) : <p>Loading routine...</p>}
        </div>
      </div>
    </div>
  );
};

export default EditRoutineModal;