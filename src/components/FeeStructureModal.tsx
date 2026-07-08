import React, { useState, useEffect } from 'react';
import type { FeeStructure } from '../types';

interface FeeStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (feeStructure: FeeStructure) => void;
  existingFeeStructure: FeeStructure | null;
  existingClasses: string[];
}

const emptyStructure: FeeStructure = {
    className: '',
    tuition: 0,
    library: 0,
    lab: 0,
    other: 0,
};

const FeeStructureModal: React.FC<FeeStructureModalProps> = ({ isOpen, onClose, onSave, existingFeeStructure, existingClasses }) => {
  const [formData, setFormData] = useState<FeeStructure>(emptyStructure);
  const isEditMode = !!existingFeeStructure;

  useEffect(() => {
    if (isOpen) {
        setFormData(existingFeeStructure ? { ...existingFeeStructure } : emptyStructure);
    }
  }, [existingFeeStructure, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'className' ? value : Number(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.className) {
        alert("Class name is required.");
        return;
    }
    if (!isEditMode && existingClasses.includes(formData.className)) {
        alert(`A fee structure for class ${formData.className} already exists.`);
        return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? `Edit Fee Structure for Class ${existingFeeStructure.className}` : 'Add New Fee Structure'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="className" className="block text-sm font-medium text-gray-700">Class Name</label>
              <input type="text" name="className" placeholder="e.g., 11" value={formData.className} onChange={handleChange} required disabled={isEditMode} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tuition" className="block text-sm font-medium text-gray-700">Tuition Fee (NPR)</label>
                <input type="number" name="tuition" value={formData.tuition} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="library" className="block text-sm font-medium text-gray-700">Library Fee (NPR)</label>
                <input type="number" name="library" value={formData.library} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="lab" className="block text-sm font-medium text-gray-700">Lab Fee (NPR)</label>
                <input type="number" name="lab" value={formData.lab} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="other" className="block text-sm font-medium text-gray-700">Other Fees (NPR)</label>
                <input type="number" name="other" value={formData.other} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{isEditMode ? 'Save Changes' : 'Add Structure'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeeStructureModal;