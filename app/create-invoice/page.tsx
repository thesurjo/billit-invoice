'use client';

import { useState } from 'react';
import Link from 'next/link';
import BusinessClientInfo from './components/BusinessClientInfo';
import InvoiceDetails from './components/InvoiceDetails';
import ItemsAndPricing from './components/ItemsAndPricing';
import PaymentTerms from './components/PaymentTerms';
import PreviewExport from './components/PreviewExport';

interface BusinessInfo {
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  businessLogo?: string;
}

interface ClientInfo {
  clientName?: string;
  clientAddress?: string;
  clientPhone?: string;
  clientEmail?: string;
}

interface InvoiceInfo {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PricingInfo {
  items: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  total: number;
}

interface PaymentInfo {
  paymentMethod: string;
  paymentInstructions: string;
  notes: string;
  terms: string;
}

interface FormData {
  business: BusinessInfo;
  client: ClientInfo;
  invoice: InvoiceInfo;
  pricing: PricingInfo;
  payment: PaymentInfo;
}

// Step components will be created in separate files
const steps = [
  { id: 1, title: 'Business & Client Info' },
  { id: 2, title: 'Invoice Details' },
  { id: 3, title: 'Items & Pricing' },
  { id: 4, title: 'Payment & Terms' },
  { id: 5, title: 'Preview & Export' }
];

const defaultTerms = `1. Payment is due within the specified due date on the invoice.
2. Late payments may be subject to additional fees.
3. All prices are in the specified currency.
4. Please include the invoice number in your payment reference.`;

export default function CreateInvoice() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    business: {},
    client: {},
    invoice: {
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      currency: 'USD'
    },
    pricing: {
      items: [],
      subtotal: 0,
      taxRate: 0,
      taxAmount: 0,
      discountType: 'percentage',
      discountValue: 0,
      discountAmount: 0,
      total: 0
    },
    payment: {
      paymentMethod: 'bank_transfer',
      paymentInstructions: '',
      notes: '',
      terms: defaultTerms
    }
  });

  const handleSave = (data: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BusinessClientInfo onSave={handleSave} initialData={formData} />;
      case 2:
        return <InvoiceDetails onSave={handleSave} initialData={formData} />;
      case 3:
        return <ItemsAndPricing 
          onSave={handleSave} 
          initialData={formData} 
          currency={formData.invoice.currency} 
        />;
      case 4:
        return <PaymentTerms onSave={handleSave} initialData={formData} />;
      case 5:
        return <PreviewExport formData={formData} />;
      default:
        return (
          <p className="text-gray-600 dark:text-gray-300">
            Step {currentStep} content will be implemented next
          </p>
        );
    }
  };

  const handleNext = () => {
    if (currentStep === 5) {
      // Handle final submission if needed
      return;
    }
    setCurrentStep(Math.min(5, currentStep + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Invoice</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  ${currentStep === step.id 
                    ? 'bg-blue-600 text-white' 
                    : currentStep > step.id 
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}
                `}>
                  {currentStep > step.id ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-full h-1 mx-2
                    ${currentStep > step.id 
                      ? 'bg-green-500' 
                      : 'bg-gray-200 dark:bg-gray-700'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div key={step.id} className="text-sm text-gray-600 dark:text-gray-300">
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          {currentStep !== 5 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="px-6 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 