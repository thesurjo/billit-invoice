'use client';

import { useState, useEffect } from 'react';

interface PaymentTermsProps {
  onSave: (data: any) => void;
  initialData?: any;
}

interface PaymentFormData {
  paymentMethod: string;
  paymentInstructions: string;
  notes: string;
  terms: string;
}

const paymentMethods = [
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
  { id: 'credit_card', name: 'Credit Card', icon: '💳' },
  { id: 'cash', name: 'Cash', icon: '💵' },
  { id: 'paypal', name: 'PayPal', icon: '📱' },
  { id: 'check', name: 'Check', icon: '📝' },
  { id: 'other', name: 'Other', icon: '🔄' }
];

const defaultTerms = `1. Payment is due within the specified due date on the invoice.
2. Late payments may be subject to additional fees.
3. All prices are in the specified currency.
4. Please include the invoice number in your payment reference.`;

export default function PaymentTerms({ onSave, initialData }: PaymentTermsProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    paymentMethod: 'bank_transfer',
    paymentInstructions: '',
    notes: '',
    terms: defaultTerms,
    ...initialData?.payment
  });

  // Save form data whenever it changes
  useEffect(() => {
    onSave({ payment: formData });
  }, [formData, onSave]);

  const handleChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Payment Method */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Payment Method
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              onClick={() => handleChange('paymentMethod', method.id)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                formData.paymentMethod === method.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-2">{method.icon}</div>
              <div className={`text-sm font-medium ${
                formData.paymentMethod === method.id
                  ? 'text-blue-700 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {method.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Instructions */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Payment Instructions
        </h3>
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="paymentInstructions" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Instructions for Payment
            </label>
            <textarea
              id="paymentInstructions"
              rows={4}
              value={formData.paymentInstructions}
              onChange={(e) => handleChange('paymentInstructions', e.target.value)}
              placeholder={`Example:
For bank transfers, please use the following details:
Bank: [Bank Name]
Account: [Account Number]
Sort Code: [Sort Code]
Reference: [Invoice Number]`}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Additional Notes
        </h3>
        <div>
          <label 
            htmlFor="notes" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Notes (will appear on invoice)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Add any additional notes or messages for your client..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Terms and Conditions */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Terms & Conditions
        </h3>
        <div>
          <label 
            htmlFor="terms" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Terms of Payment
          </label>
          <textarea
            id="terms"
            rows={6}
            value={formData.terms}
            onChange={(e) => handleChange('terms', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            These terms will appear at the bottom of your invoice. You can modify them as needed.
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Preview
        </h4>
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Selected Payment Method:
            </span>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {paymentMethods.find(m => m.id === formData.paymentMethod)?.name}
            </p>
          </div>
          
          {formData.paymentInstructions && (
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Instructions:
              </span>
              <p className="mt-1 text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {formData.paymentInstructions}
              </p>
            </div>
          )}

          {formData.notes && (
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Additional Notes:
              </span>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {formData.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 