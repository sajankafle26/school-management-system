import React, { useState } from 'react';
import type { Student, FeeInvoice } from '../types';
import { EsewaIcon, KhaltiIcon } from './icons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paidInvoiceIds: number[]) => void;
  student: Student;
  dueInvoices: FeeInvoice[];
  totalDue: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess, student, dueInvoices, totalDue }) => {
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'eSewa' | 'Khalti' | null>(null);

  const handlePayment = (method: 'eSewa' | 'Khalti') => {
    setPaymentMethod(method);
    setPaymentState('processing');

    // Simulate API call
    setTimeout(() => {
      setPaymentState('success');
      
      setTimeout(() => {
        const paidIds = dueInvoices.map(inv => inv.id);
        onPaymentSuccess(paidIds);
        onClose();
        // Reset state for next time
        setTimeout(() => {
            setPaymentState('idle');
            setPaymentMethod(null);
        }, 300);
      }, 1500); // Show success message for 1.5s
    }, 2500); // Simulate 2.5s processing time
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Online Fee Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none" aria-label="Close modal">&times;</button>
        </div>
        
        {paymentState === 'idle' && (
             <div className="text-center">
                <p className="text-gray-600 mb-1">You are paying for:</p>
                <p className="font-bold text-lg text-gray-800">{student.name}</p>
                <p className="text-sm text-gray-500">Class {student.className} {student.section}</p>
                
                <div className="my-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">Total Amount Due</p>
                    <p className="text-4xl font-bold text-blue-900">NPR {totalDue.toLocaleString()}</p>
                </div>

                <p className="text-gray-600 mb-4">Choose a payment method:</p>
                <div className="space-y-3">
                    <button 
                        onClick={() => handlePayment('eSewa')}
                        className="w-full flex items-center justify-center p-4 bg-green-500 text-white rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors"
                    >
                        <EsewaIcon className="w-8 h-8 mr-3" />
                        Pay with eSewa
                    </button>
                    <button 
                        onClick={() => handlePayment('Khalti')}
                        className="w-full flex items-center justify-center p-4 bg-purple-700 text-white rounded-lg font-semibold text-lg hover:bg-purple-800 transition-colors"
                    >
                        <KhaltiIcon className="w-8 h-8 mr-3" />
                        Pay with Khalti
                    </button>
                </div>
            </div>
        )}

        {paymentState === 'processing' && (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
                <h3 className="text-xl font-semibold text-gray-800 mt-6">Processing Payment...</h3>
                <p className="text-gray-500">Please wait while we securely process your payment with {paymentMethod}.</p>
            </div>
        )}

        {paymentState === 'success' && (
             <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mt-6">Payment Successful!</h3>
                <p className="text-gray-500">Thank you for your payment. The records have been updated.</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;
