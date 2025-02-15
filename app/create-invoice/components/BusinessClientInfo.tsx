'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useDebounce } from '../hooks/useDebounce';

interface BusinessClientInfoProps {
  onSave: (data: any) => void;
  initialData?: any;
}

interface BusinessClientFormData {
  business: {
    businessName?: string;
    businessAddress?: string;
    businessPhone?: string;
    businessEmail?: string;
    businessLogo?: string;
  };
  client: {
    clientName?: string;
    clientAddress?: string;
    clientPhone?: string;
    clientEmail?: string;
  };
}

export default function BusinessClientInfo({ onSave, initialData }: BusinessClientInfoProps) {
  const [formData, setFormData] = useState<BusinessClientFormData>(() => ({
    business: {
      businessName: '',
      businessAddress: '',
      businessPhone: '',
      businessEmail: '',
      businessLogo: '',
      ...initialData?.business
    },
    client: {
      clientName: '',
      clientAddress: '',
      clientPhone: '',
      clientEmail: '',
      ...initialData?.client
    }
  }));

  const debouncedFormData = useDebounce(formData, 500);

  useEffect(() => {
    if (JSON.stringify(debouncedFormData) !== JSON.stringify(initialData)) {
      onSave(debouncedFormData);
    }
  }, [debouncedFormData, initialData, onSave]);

  const handleBusinessChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      business: {
        ...prev.business,
        [field]: value
      }
    }));
  }, []);

  const handleClientChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      client: {
        ...prev.client,
        [field]: value
      }
    }));
  }, []);

  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleBusinessChange('businessLogo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [handleBusinessChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Business Information */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Business Information
        </h3>
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="businessName" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              value={formData.business.businessName}
              onChange={(e) => handleBusinessChange('businessName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter your business name"
            />
          </div>

          <div>
            <label 
              htmlFor="businessAddress" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Business Address
            </label>
            <textarea
              id="businessAddress"
              value={formData.business.businessAddress}
              onChange={(e) => handleBusinessChange('businessAddress', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter your business address"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="businessPhone" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="businessPhone"
                value={formData.business.businessPhone}
                onChange={(e) => handleBusinessChange('businessPhone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label 
                htmlFor="businessEmail" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="businessEmail"
                value={formData.business.businessEmail}
                onChange={(e) => handleBusinessChange('businessEmail', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div>
            <label 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Business Logo
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="w-20 h-20 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg flex items-center justify-center overflow-hidden">
                {formData.business.businessLogo ? (
                  <img src={formData.business.businessLogo} alt="Business logo" className="w-full h-full object-contain" />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <label 
                htmlFor="logo-upload" 
                className="cursor-pointer px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                Upload Logo
                <input
                  id="logo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Client Information
        </h3>
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="clientName" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Client Name / Company
            </label>
            <input
              type="text"
              id="clientName"
              value={formData.client.clientName}
              onChange={(e) => handleClientChange('clientName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter client name or company"
            />
          </div>

          <div>
            <label 
              htmlFor="clientAddress" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Client Address
            </label>
            <textarea
              id="clientAddress"
              value={formData.client.clientAddress}
              onChange={(e) => handleClientChange('clientAddress', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter client address"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="clientPhone" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="clientPhone"
                value={formData.client.clientPhone}
                onChange={(e) => handleClientChange('clientPhone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label 
                htmlFor="clientEmail" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="clientEmail"
                value={formData.client.clientEmail}
                onChange={(e) => handleClientChange('clientEmail', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter email address"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 