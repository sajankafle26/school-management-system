import React from 'react';
import type { Student, Result, SubjectMark } from '../types';
import { PrintIcon } from './icons';

interface ResultDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  result: Result;
}

const getSubjectGrade = (marksObtained: number, fullMarks: number): string => {
    const percentage = (marksObtained / fullMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'NG';
};

const ResultDetailsModal: React.FC<ResultDetailsModalProps> = ({ isOpen, onClose, student, result }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 print:p-0 print:bg-white" aria-modal="true" role="dialog">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col print:shadow-none print:max-h-full" onClick={e => e.stopPropagation()}>
        <div className="p-6 md:p-8 border-b flex justify-between items-center print:hidden">
          <h2 className="text-2xl font-bold text-gray-800">Student Marksheet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none" aria-label="Close modal">&times;</button>
        </div>
        
        <div id="marksheet-content" className="p-8 overflow-y-auto">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Shree Adarsha Secondary School</h1>
                <p className="text-gray-600">Marksheet - {result.examType}</p>
            </header>

            <div className="grid grid-cols-3 gap-4 mb-8 pb-4 border-b">
                <div><span className="font-semibold">Student Name:</span> {student.name}</div>
                <div><span className="font-semibold">Class:</span> {student.className} {student.section}</div>
                <div><span className="font-semibold">Roll No:</span> {student.roll}</div>
            </div>

            <table className="min-w-full divide-y divide-gray-300 border">
                <thead className="bg-gray-100">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                        <th scope="col" className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Full Marks</th>
                        <th scope="col" className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Pass Marks</th>
                        <th scope="col" className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Obtained Marks</th>
                        <th scope="col" className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Grade</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {result.marks.map((mark: SubjectMark) => (
                        <tr key={mark.subject}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-800">{mark.subject}</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">{mark.fullMarks}</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">{mark.fullMarks * 0.4}</td>
                            <td className="px-4 py-3 text-center text-sm font-semibold text-gray-800">{mark.marksObtained}</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">{getSubjectGrade(mark.marksObtained, mark.fullMarks)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-8 grid grid-cols-2 gap-8 items-start">
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-gray-600">Total Marks Obtained:</span> <span className="font-bold">{result.totalMarks}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Percentage:</span> <span className="font-bold">{result.percentage.toFixed(2)}%</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Final Grade:</span> <span className="font-bold">{result.grade}</span></div>
                        {result.rank && <div className="flex justify-between"><span className="text-gray-600">Class Rank:</span> <span className="font-bold">{result.rank}</span></div>}
                    </div>
                </div>
                 <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-2">Remarks</h4>
                    <p className="text-sm text-gray-600">{result.remarks}</p>
                </div>
            </div>

            <div className="mt-12 flex justify-between text-sm text-gray-500">
                <span>Date of Issue: {new Date().toLocaleDateString()}</span>
                <span>Principal's Signature</span>
            </div>
        </div>

        <div className="p-6 border-t flex justify-end space-x-4 print:hidden">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button type="button" onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <PrintIcon className="w-5 h-5 mr-2" />
                Print
            </button>
        </div>
        <style>
            {`
                @media print {
                    body > div:not(.fixed) {
                        display: none;
                    }
                    .fixed {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        overflow: visible;
                    }
                    body * {
                        visibility: hidden;
                    }
                    #marksheet-content, #marksheet-content * {
                        visibility: visible;
                    }
                    #marksheet-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}
        </style>
      </div>
    </div>
  );
};

export default ResultDetailsModal;