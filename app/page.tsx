import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            BiLLiT Invoice Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Create professional invoices instantly, with no database required. 
            All data stays on your device for maximum privacy and security.
          </p>
          <Link 
            href="/create-invoice"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Create Invoice
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: 'No Database Required',
              description: 'All data processing happens locally on your device',
              icon: '🔒'
            },
            {
              title: 'Professional Templates',
              description: 'Choose from beautifully designed invoice templates',
              icon: '📄'
            },
            {
              title: 'Export Options',
              description: 'Download as PDF, HTML, or save locally as JSON',
              icon: '⬇️'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8 dark:text-white">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {[
              { step: '1', text: 'Enter business & client details' },
              { step: '2', text: 'Add items and calculate totals' },
              { step: '3', text: 'Choose template & download' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 justify-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <p className="text-gray-700 dark:text-gray-300">{item.text}</p>
                {index < 2 && (
                  <svg className="w-6 h-6 text-gray-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
