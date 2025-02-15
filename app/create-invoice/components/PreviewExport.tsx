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
      <div id="invoice-preview" className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            {formData.business.businessLogo && (
              <img 
                src={formData.business.businessLogo} 
                alt="Business Logo" 
                className="h-16 w-auto object-contain mb-4"
              />
            )}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {formData.business.businessName || 'Your Business Name'}
            </h1>
            <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {formData.business.businessAddress}
              {formData.business.businessPhone && `\nPhone: ${formData.business.businessPhone}`}
              {formData.business.businessEmail && `\nEmail: ${formData.business.businessEmail}`}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              INVOICE
            </h2>
            <div className="text-gray-600 dark:text-gray-400">
              <p>Invoice #: {formData.invoice.invoiceNumber}</p>
              <p>Date: {formatDate(formData.invoice.invoiceDate)}</p>
              <p>Due Date: {formatDate(formData.invoice.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Bill To:
          </h3>
          <div className="text-gray-600 dark:text-gray-400">
            <p className="font-semibold">{formData.client.clientName}</p>
            <div className="whitespace-pre-line">
              {formData.client.clientAddress}
              {formData.client.clientPhone && `\nPhone: ${formData.client.clientPhone}`}
              {formData.client.clientEmail && `\nEmail: ${formData.client.clientEmail}`}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-4 text-gray-900 dark:text-white">Description</th>
                <th className="pb-4 text-gray-900 dark:text-white text-right">Quantity</th>
                <th className="pb-4 text-gray-900 dark:text-white text-right">Unit Price</th>
                <th className="pb-4 text-gray-900 dark:text-white text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              {formData.pricing.items.map(item => (
                <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="py-4">{item.description}</td>
                  <td className="py-4 text-right">{item.quantity}</td>
                  <td className="py-4 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-4 text-right">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="w-72 ml-auto space-y-2">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal:</span>
              <span>{formatCurrency(formData.pricing.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Tax ({formData.pricing.taxRate}%):</span>
              <span>{formatCurrency(formData.pricing.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>
                Discount 
                {formData.pricing.discountType === 'percentage' 
                  ? ` (${formData.pricing.discountValue}%)`
                  : ''}:
              </span>
              <span>-{formatCurrency(formData.pricing.discountAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total:</span>
              <span>{formatCurrency(formData.pricing.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Payment Method
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {paymentMethodNames[formData.payment.paymentMethod]}
            </p>
          </div>

          {formData.payment.paymentInstructions && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Payment Instructions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {formData.payment.paymentInstructions}
              </p>
            </div>
          )}

          {formData.payment.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Additional Notes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {formData.payment.notes}
              </p>
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Terms & Conditions
          </h3>
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line text-sm">
            {formData.payment.terms}
          </p>
        </div>
      </div>
    </div>
  );
} 