'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface PreviewExportProps {
  formData: {
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
    invoice: {
      invoiceNumber: string;
      invoiceDate: string;
      dueDate: string;
      currency: string;
    };
    pricing: {
      items: Array<{
        id: string;
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
      }>;
      subtotal: number;
      taxRate: number;
      taxAmount: number;
      discountType: 'percentage' | 'fixed';
      discountValue: number;
      discountAmount: number;
      total: number;
    };
    payment: {
      paymentMethod: string;
      paymentInstructions: string;
      notes: string;
      terms: string;
    };
  };
}

const paymentMethodNames: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  credit_card: 'Credit Card',
  cash: 'Cash',
  paypal: 'PayPal',
  check: 'Check',
  other: 'Other'
};

export default function PreviewExport({ formData }: PreviewExportProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'html' | 'json'>('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.invoice.currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      switch (exportFormat) {
        case 'pdf':
          const element = document.getElementById('invoice-preview');
          if (element) {
            const canvas = await html2canvas(element, {
              scale: 2,
              logging: false,
              useCORS: true
            });
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice-${formData.invoice.invoiceNumber}.pdf`);
          }
          break;

        case 'html':
          const htmlContent = document.getElementById('invoice-preview')?.outerHTML;
          if (htmlContent) {
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `invoice-${formData.invoice.invoiceNumber}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
          break;

        case 'json':
          const jsonData = JSON.stringify(formData, null, 2);
          const jsonBlob = new Blob([jsonData], { type: 'application/json' });
          const jsonUrl = URL.createObjectURL(jsonBlob);
          const jsonLink = document.createElement('a');
          jsonLink.href = jsonUrl;
          jsonLink.download = `invoice-${formData.invoice.invoiceNumber}.json`;
          document.body.appendChild(jsonLink);
          jsonLink.click();
          document.body.removeChild(jsonLink);
          URL.revokeObjectURL(jsonUrl);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      // Handle error (you might want to show a notification)
    }
    setIsExporting(false);
  };

  return (
    <div className="space-y-8">
      {/* Export Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Export Options
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Format
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setExportFormat('pdf')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  exportFormat === 'pdf'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                PDF
              </button>
              <button
                onClick={() => setExportFormat('html')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  exportFormat === 'html'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => setExportFormat('json')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  exportFormat === 'json'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                JSON
              </button>
            </div>
          </div>
          <div className="sm:self-end">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? 'Exporting...' : 'Export Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Preview */}
      <div id="invoice-preview" className="bg-white rounded-lg p-8 shadow-lg max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-start pb-8 border-b border-gray-200">
          {/* Business Info */}
          <div className="space-y-4">
            {formData.business.businessLogo && (
              <img 
                src={formData.business.businessLogo} 
                alt="Business Logo" 
                className="h-20 w-auto object-contain"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {formData.business.businessName || 'Your Business Name'}
              </h1>
              <div className="mt-2 text-gray-600 text-sm leading-relaxed">
                {formData.business.businessAddress && (
                  <p className="whitespace-pre-line">{formData.business.businessAddress}</p>
                )}
                {formData.business.businessPhone && (
                  <p className="mt-1">Tel: {formData.business.businessPhone}</p>
                )}
                {formData.business.businessEmail && (
                  <p>{formData.business.businessEmail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="text-right">
            <h2 className="text-4xl font-extrabold tracking-tight text-blue-600 mb-4">
              INVOICE
            </h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-end items-center space-x-4">
                <span className="text-gray-500">Invoice No:</span>
                <span className="text-gray-900 font-medium">{formData.invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-end items-center space-x-4">
                <span className="text-gray-500">Issue Date:</span>
                <span className="text-gray-900">{formatDate(formData.invoice.invoiceDate)}</span>
              </div>
              <div className="flex justify-end items-center space-x-4">
                <span className="text-gray-500">Due Date:</span>
                <span className="text-gray-900">{formatDate(formData.invoice.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="py-8 border-b border-gray-200">
          <div className="max-w-md">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Bill To
            </h3>
            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-gray-900">
                {formData.client.clientName}
              </h4>
              <div className="text-gray-600 text-sm leading-relaxed">
                {formData.client.clientAddress && (
                  <p className="whitespace-pre-line">{formData.client.clientAddress}</p>
                )}
                {formData.client.clientPhone && (
                  <p className="mt-1">Tel: {formData.client.clientPhone}</p>
                )}
                {formData.client.clientEmail && (
                  <p>{formData.client.clientEmail}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="py-8 border-b border-gray-200">
          {formData.pricing.items.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-1">No Items Added</h4>
              <p className="text-gray-500 text-sm max-w-sm">
                Your invoice doesn't have any items yet. Add items in the "Items & Pricing" section to see them listed here.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-500 uppercase tracking-wider">
                  <th className="pb-4 text-left">Description</th>
                  <th className="pb-4 text-right">Qty</th>
                  <th className="pb-4 text-right">Unit Price</th>
                  <th className="pb-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {formData.pricing.items.map(item => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="py-4">
                      <div className="font-medium">{item.description}</div>
                    </td>
                    <td className="py-4 text-right">{item.quantity}</td>
                    <td className="py-4 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-4 text-right font-medium">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Totals Section */}
        <div className="py-6 border-b border-gray-200">
          <div className="w-80 ml-auto">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-800 font-medium">{formatCurrency(formData.pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax ({formData.pricing.taxRate}%)</span>
                <span className="text-gray-800">{formatCurrency(formData.pricing.taxAmount)}</span>
              </div>
              {formData.pricing.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Discount {formData.pricing.discountType === 'percentage' 
                      ? `(${formData.pricing.discountValue}%)` 
                      : ''}
                  </span>
                  <span className="text-gray-800">-{formatCurrency(formData.pricing.discountAmount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">{formatCurrency(formData.pricing.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="py-6 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Payment Method
              </h3>
              <p className="text-gray-800 font-medium">
                {paymentMethodNames[formData.payment.paymentMethod]}
              </p>
              {formData.payment.paymentInstructions && (
                <div className="mt-4 text-sm text-gray-600 whitespace-pre-line">
                  {formData.payment.paymentInstructions}
                </div>
              )}
            </div>
            {formData.payment.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Notes
                </h3>
                <p className="text-sm text-gray-600">
                  {formData.payment.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="pt-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Terms & Conditions
          </h3>
          <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
            {formData.payment.terms}
          </div>
        </div>
      </div>
    </div>
  );
} 