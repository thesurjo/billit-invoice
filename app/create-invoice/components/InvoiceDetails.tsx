'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface InvoiceDetailsProps {
  onSave: (data: any) => void;
  initialData?: any;
}

interface InvoiceFormData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

export default function InvoiceDetails({ onSave, initialData }: InvoiceDetailsProps) {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: 'USD',
    ...initialData?.invoice
  });

  const debouncedFormData = useDebounce(formData, 500);

  // Save form data whenever the debounced value changes
  useEffect(() => {
    // Only save if the data has actually changed
    if (JSON.stringify(debouncedFormData) !== JSON.stringify(initialData?.invoice)) {
      onSave({ invoice: debouncedFormData });
    }
  }, [debouncedFormData, onSave, initialData]);

  // Generate a unique invoice number when component mounts
  useEffect(() => {
    if (!initialData?.invoice?.invoiceNumber && !formData.invoiceNumber) {
      const timestamp = new Date().getTime().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setFormData(prev => ({
        ...prev,
        invoiceNumber: `INV-${timestamp}-${random}`
      }));
    }
  }, [initialData]);

  // Set default due date to 30 days from today if not set
  useEffect(() => {
    if (!initialData?.invoice?.dueDate && !formData.dueDate) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        dueDate: thirtyDaysFromNow.toISOString().split('T')[0]
      }));
    }
  }, [initialData]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const generateNewInvoiceNumber = useCallback(() => {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newInvoiceNumber = `INV-${timestamp}-${random}`;
    setFormData(prev => ({
      ...prev,
      invoiceNumber: newInvoiceNumber
    }));
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Invoice Number */}
        <div>
          <label 
            htmlFor="invoiceNumber" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Invoice Number
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              id="invoiceNumber"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter invoice number"
            />
            <button
              onClick={generateNewInvoiceNumber}
              className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              Generate New
            </button>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="invoiceDate" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Invoice Date
            </label>
            <input
              type="date"
              id="invoiceDate"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label 
              htmlFor="dueDate" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={formData.invoiceDate}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Currency Selection */}
        <div>
          <label 
            htmlFor="currency" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} - {currency.name} ({currency.code})
              </option>
            ))}
          </select>
        </div>

        {/* Preview Card */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Preview
          </h4>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Invoice Number:</span> {formData.invoiceNumber}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Invoice Date:</span> {new Date(formData.invoiceDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Due Date:</span> {new Date(formData.dueDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Currency:</span> {currencies.find(c => c.code === formData.currency)?.symbol} ({formData.currency})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 