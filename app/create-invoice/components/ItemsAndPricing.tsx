'use client';

import { useState, useEffect } from 'react';

interface ItemsAndPricingProps {
  onSave: (data: any) => void;
  initialData?: any;
  currency?: string;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PricingFormData {
  items: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  total: number;
}

export default function ItemsAndPricing({ onSave, initialData, currency = 'USD' }: ItemsAndPricingProps) {
  const [formData, setFormData] = useState<PricingFormData>({
    items: [],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    total: 0,
    ...initialData?.pricing
  });

  // Save form data whenever it changes
  useEffect(() => {
    onSave({ pricing: formData });
  }, [formData, onSave]);

  const calculateTotals = (
    items: LineItem[],
    taxRate: number,
    discountType: 'percentage' | 'fixed',
    discountValue: number
  ) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const discountAmount = discountType === 'percentage' 
      ? (subtotal * discountValue) / 100 
      : discountValue;
    const total = subtotal + taxAmount - discountAmount;

    return {
      subtotal,
      taxAmount,
      discountAmount,
      total
    };
  };

  const addNewItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };

    setFormData(prev => {
      const updatedItems = [...prev.items, newItem];
      const totals = calculateTotals(updatedItems, prev.taxRate, prev.discountType, prev.discountValue);
      return {
        ...prev,
        items: updatedItems,
        ...totals
      };
    });
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setFormData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
          }
          return updatedItem;
        }
        return item;
      });

      const totals = calculateTotals(updatedItems, prev.taxRate, prev.discountType, prev.discountValue);
      return {
        ...prev,
        items: updatedItems,
        ...totals
      };
    });
  };

  const removeItem = (id: string) => {
    setFormData(prev => {
      const updatedItems = prev.items.filter(item => item.id !== id);
      const totals = calculateTotals(updatedItems, prev.taxRate, prev.discountType, prev.discountValue);
      return {
        ...prev,
        items: updatedItems,
        ...totals
      };
    });
  };

  const updatePricing = (field: string, value: string | number) => {
    setFormData(prev => {
      return {
        ...prev,
        [field]: value,
        ...calculateTotals(
          prev.items,
          field === 'taxRate' ? Number(value) : prev.taxRate,
          field === 'discountType' ? value as 'percentage' | 'fixed' : prev.discountType,
          field === 'discountValue' ? Number(value) : prev.discountValue
        )
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Line Items */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            Line Items
          </h3>
          <button
            onClick={addNewItem}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Add Item
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {formData.items.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No items added yet. Click "Add Item" to start.
            </p>
          ) : (
            formData.items.map(item => (
              <div 
                key={item.id}
                className="grid grid-cols-12 gap-4 p-4 bg-gray-800 rounded-lg shadow-sm"
              >
                <div className="col-span-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Item description"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Unit Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      {currency === 'USD' ? '$' : currency}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white"
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Total
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      {currency === 'USD' ? '$' : currency}
                    </span>
                    <input
                      type="number"
                      value={item.total}
                      disabled
                      className="w-full pl-8 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400"
                    />
                  </div>
                </div>
                <div className="col-span-1 flex items-end">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Totals and Adjustments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tax and Discount */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">
            Adjustments
          </h4>
          
          {/* Tax Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tax Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.taxRate}
              onChange={(e) => updatePricing('taxRate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white"
            />
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Discount
            </label>
            <div className="flex gap-4">
              <select
                value={formData.discountType}
                onChange={(e) => updatePricing('discountType', e.target.value)}
                className="px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <div className="relative flex-1">
                {formData.discountType === 'fixed' && (
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    {currency === 'USD' ? '$' : currency}
                  </span>
                )}
                <input
                  type="number"
                  min="0"
                  step={formData.discountType === 'percentage' ? '0.1' : '0.01'}
                  max={formData.discountType === 'percentage' ? '100' : undefined}
                  value={formData.discountValue}
                  onChange={(e) => updatePricing('discountValue', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white ${
                    formData.discountType === 'fixed' ? 'pl-8' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-700 p-4 rounded-lg space-y-3">
          <h4 className="text-lg font-medium text-white mb-4">
            Summary
          </h4>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal:</span>
            <span className="text-white">
              {currency === 'USD' ? '$' : currency} {formData.subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">
              Tax ({formData.taxRate}%):
            </span>
            <span className="text-white">
              {currency === 'USD' ? '$' : currency} {formData.taxAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">
              Discount {formData.discountType === 'percentage' ? `(${formData.discountValue}%)` : ''}:
            </span>
            <span className="text-white">
              - {currency === 'USD' ? '$' : currency} {formData.discountAmount.toFixed(2)}
            </span>
          </div>

          <div className="pt-3 border-t border-gray-600">
            <div className="flex justify-between font-medium">
              <span className="text-white">Total:</span>
              <span className="text-blue-400 text-lg">
                {currency === 'USD' ? '$' : currency} {formData.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 