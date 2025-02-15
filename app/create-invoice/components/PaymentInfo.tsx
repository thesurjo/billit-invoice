'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface PaymentInfoProps {
  onSave: (data: any) => void;
  initialData?: any;
}

interface PaymentFormData {
  paymentMethod: string;
  paymentInstructions: string;
  notes: string;
  termsAndConditions: string;
}

const paymentMethods = [
  'Bank Transfer',
  'Credit Card',
  'PayPal',
  'Cash',
  'Check',
  'Crypto',
  'Other'
];

export default function PaymentInfo({ onSave, initialData }: PaymentInfoProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    paymentMethod: 'Bank Transfer',
    paymentInstructions: '',
    notes: '',
    termsAndConditions: '',
    ...initialData?.payment
  });

  const debouncedFormData = useDebounce(formData);

  useEffect(() => {
    onSave({ payment: debouncedFormData });
  }, [debouncedFormData, onSave]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  return (
    <div className="space-y-6 p-4 bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-white">Payment Information</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-300">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 bg-gray-700 border-gray-600 text-white"
          >
            {paymentMethods.map(method => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="paymentInstructions" className="block text-sm font-medium text-gray-300">
            Payment Instructions
          </label>
          <textarea
            id="paymentInstructions"
            name="paymentInstructions"
            rows={3}
            value={formData.paymentInstructions}
            onChange={handleChange}
            placeholder="Enter payment instructions..."
            className="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any additional notes..."
            className="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <label htmlFor="termsAndConditions" className="block text-sm font-medium text-gray-300">
            Terms & Conditions
          </label>
          <textarea
            id="termsAndConditions"
            name="termsAndConditions"
            rows={3}
            value={formData.termsAndConditions}
            onChange={handleChange}
            placeholder="Enter terms and conditions..."
            className="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>
    </div>
  );
} 