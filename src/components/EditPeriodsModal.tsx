import React, { useState, useEffect } from 'react';
import { TrashIcon } from './icons';
import type { Period } from '../types';

interface EditPeriodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (periods: Period[]) => void;
  initialPeriods: Period[];
}

const EditPeriodsModal: React.FC<EditPeriodsModalProps> = ({ isOpen, onClose, onSave, initialPeriods }) => {
  const [periods, setPeriods] = useState<Period[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPeriods(JSON.parse(JSON.stringify(initialPeriods))); // Deep copy
    }
  }, [isOpen, initialPeriods]);

  const handleTimeChange = (index: number, time: string) => {
    const newPeriods = [...periods];
    newPeriods[index].time = time;
    setPeriods(newPeriods);
  };

  const handleAddPeriod = () => {
    const newPeriodNumber = periods.length > 0 ? Math.max(...periods.map(p => p.period)) + 1 : 1;
    setPeriods([...periods, { period: newPeriodNumber, time: '00:00 - 00:00' }]);
  };

  const handleRemovePeriod = (index: number) => {
    const newPeriods = periods.filter((_, i) => i !== index);
    setPeriods(newPeriods);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(periods);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Class Periods</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {periods.map((p, index) => (
              <div key={p.period} className="flex items-center space-x-3">
                <label className="font-semibold w-24">Period {p.period}</label>
                <input
                  type="text"
                  value={p.time}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  placeholder="e.g., 10:00 - 10:45"
                  className="flex-grow p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePeriod(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddPeriod}
            className="mt-4 w-full text-blue-600 border-2 border-dashed border-blue-400 rounded-lg py-2 hover:bg-blue-50 transition-colors"
          >
            + Add Period
          </button>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPeriodsModal;