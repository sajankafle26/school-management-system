import React, { useState } from 'react';
import type { Student } from '../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Update prop type to reflect that academicYear is handled by the parent.
  onAddStudent: (student: Omit<Student, 'id' | 'academicYear'>) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onAddStudent }) => {
  const [name, setName] = useState('');
  const [nepaliName, setNepaliName] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [roll, setRoll] = useState('');
  const [dob, setDob] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [profilePic, setProfilePic] = useState<string>('https://picsum.photos/seed/placeholder/100');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [parentId, setParentId] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setProfilePic(previewUrl); // In a real app, you'd upload the file and set the URL from the server response
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !className || !section || !roll || !dob || !guardianName || !contact || !address || !parentId) {
        alert("Please fill out all required fields.");
        return;
    }
    const newStudent = {
      name,
      nepaliName,
      className,
      section,
      roll: parseInt(roll, 10),
      dob,
      guardianName,
      contact,
      address,
      profilePic,
      parentId: parseInt(parentId, 10),
    };
    onAddStudent(newStudent);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Student</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none" aria-label="Close modal">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="md:col-span-2 flex flex-col items-center">
                <img src={imagePreview || 'https://ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png'} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-gray-200" />
                <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span>Upload Picture</span>
                    <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                </label>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="nepaliName" className="block text-sm font-medium text-gray-700 font-nepali">नेपाली नाम</label>
              <input type="text" id="nepaliName" value={nepaliName} onChange={e => setNepaliName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-nepali" />
            </div>
            <div>
              <label htmlFor="className" className="block text-sm font-medium text-gray-700">Class</label>
              <input type="text" id="className" value={className} placeholder="e.g., 10" onChange={e => setClassName(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
              <input type="text" id="section" value={section} placeholder="e.g., A" onChange={e => setSection(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="roll" className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input type="number" id="roll" value={roll} onChange={e => setRoll(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" id="dob" value={dob} onChange={e => setDob(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700">Guardian's Name</label>
              <input type="text" id="guardianName" value={guardianName} onChange={e => setGuardianName(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">Parent ID</label>
              <input type="number" id="parentId" value={parentId} onChange={e => setParentId(e.target.value)} required placeholder="e.g., 1" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input type="tel" id="contact" value={contact} onChange={e => setContact(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;