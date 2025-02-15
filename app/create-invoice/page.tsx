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

// Update the steps array with better icons and descriptions
const steps = [
  { 
    id: 1, 
    title: 'Business & Client', 
    description: 'Enter company details',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  { 
    id: 2, 
    title: 'Invoice Details', 
    description: 'Set invoice information',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    id: 3, 
    title: 'Items & Pricing', 
    description: 'Add items and costs',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    id: 4, 
    title: 'Payment & Terms', 
    description: 'Define payment details',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    id: 5, 
    title: 'Preview & Export', 
    description: 'Review and download',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  }
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
        <div className="flex justify-between items-center mb-12">
          <Link 
            href="/"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Invoice</h1>
        </div>

        {/* Progress Steps - Modern Timeline */}
        <div className="mb-12 overflow-x-auto">
          <div className="min-w-max">
            <div className="relative flex items-center justify-between md:px-8 py-4">
              {/* Progress Bar Background */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
              
              {/* Active Progress Bar with Gradient */}
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 transition-all duration-500 ease-out"
                style={{ 
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                }}
              ></div>

              {/* Steps */}
              <div className="relative flex justify-between w-full">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center">
                    {/* Step Circle */}
                    <div 
                      className={`
                        relative flex items-center justify-center w-14 h-14 rounded-full 
                        transition-all duration-500 ease-out
                        ${currentStep === step.id 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 ring-4 ring-blue-100 dark:ring-blue-900 scale-110 shadow-xl' 
                          : currentStep > step.id 
                            ? 'bg-green-500 ring-4 ring-green-100 dark:ring-green-900' 
                            : 'bg-white dark:bg-gray-800 ring-4 ring-gray-100 dark:ring-gray-700'}
                        ${currentStep >= step.id ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                      `}
                      onClick={() => currentStep >= step.id && setCurrentStep(step.id)}
                    >
                      <div className={`
                        transition-all duration-300
                        ${currentStep === step.id ? 'scale-100' : 'scale-90'}
                        ${currentStep > step.id ? 'text-white' : currentStep === step.id ? 'text-white' : 'text-gray-400 dark:text-gray-500'}
                      `}>
                        {currentStep > step.id ? (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : step.icon}
                      </div>

                      {/* Pulse Animation */}
                      {currentStep === step.id && (
                        <>
                          <div className="absolute w-full h-full rounded-full animate-ping-slow bg-blue-400 opacity-20"></div>
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        </>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="mt-4 space-y-1">
                      {/* Step Number */}
                      <span className={`
                        hidden md:block text-xs font-semibold uppercase tracking-wider text-center
                        ${currentStep === step.id 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : currentStep > step.id
                            ? 'text-green-500'
                            : 'text-gray-400 dark:text-gray-500'}
                      `}>
                        Step {step.id}
                      </span>
                      
                      {/* Step Title */}
                      <h3 className={`
                        text-sm font-medium text-center whitespace-nowrap px-2
                        ${currentStep === step.id 
                          ? 'text-gray-900 dark:text-white' 
                          : currentStep > step.id
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'}
                      `}>
                        {step.title}
                      </h3>
                      
                      {/* Step Description - Hidden on Mobile */}
                      <p className={`
                        hidden md:block text-xs text-center
                        ${currentStep === step.id 
                          ? 'text-gray-600 dark:text-gray-300' 
                          : 'text-gray-400 dark:text-gray-500'}
                      `}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          {currentStep !== 5 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="group px-6 py-3 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <button
                onClick={handleNext}
                className="group px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-xl"
              >
                Next
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 