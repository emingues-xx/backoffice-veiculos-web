import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        {/* Force CSS loading in production */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for production */
            body {
              font-family: 'Inter', system-ui, sans-serif !important;
              background-color: #f9fafb !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            /* Basic button styles */
            button {
              background-color: #3b82f6 !important;
              color: white !important;
              border: 1px solid #d1d5db !important;
              border-radius: 0.375rem !important;
              padding: 0.5rem 1rem !important;
              cursor: pointer !important;
              font-family: inherit !important;
            }
            
            button:hover {
              background-color: #2563eb !important;
            }
            
            /* Basic input styles */
            input {
              border: 1px solid #d1d5db !important;
              border-radius: 0.375rem !important;
              padding: 0.5rem !important;
              font-family: inherit !important;
            }
            
            /* Basic layout */
            .min-h-screen {
              min-height: 100vh !important;
            }
            
            .flex {
              display: flex !important;
            }
            
            .items-center {
              align-items: center !important;
            }
            
            .justify-center {
              justify-content: center !important;
            }
            
            .bg-white {
              background-color: white !important;
            }
            
            .p-8 {
              padding: 2rem !important;
            }
            
            .rounded-lg {
              border-radius: 0.5rem !important;
            }
            
            .shadow-lg {
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1) !important;
            }
            
            .w-full {
              width: 100% !important;
            }
            
            .max-w-md {
              max-width: 28rem !important;
            }
            
            .mb-6 {
              margin-bottom: 1.5rem !important;
            }
            
            .text-2xl {
              font-size: 1.5rem !important;
              line-height: 2rem !important;
            }
            
            .font-bold {
              font-weight: 700 !important;
            }
            
            .text-gray-900 {
              color: #111827 !important;
            }
            
            .text-gray-600 {
              color: #4b5563 !important;
            }
            
            .mb-4 {
              margin-bottom: 1rem !important;
            }
            
            .block {
              display: block !important;
            }
            
            .text-sm {
              font-size: 0.875rem !important;
              line-height: 1.25rem !important;
            }
            
            .font-medium {
              font-weight: 500 !important;
            }
            
            .mb-2 {
              margin-bottom: 0.5rem !important;
            }
            
            /* Additional Tailwind classes for layout */
            .space-y-4 > * + * {
              margin-top: 1rem !important;
            }
            
            .space-y-6 > * + * {
              margin-top: 1.5rem !important;
            }
            
            .text-center {
              text-align: center !important;
            }
            
            .text-left {
              text-align: left !important;
            }
            
            .mt-4 {
              margin-top: 1rem !important;
            }
            
            .mt-6 {
              margin-top: 1.5rem !important;
            }
            
            .mb-8 {
              margin-bottom: 2rem !important;
            }
            
            .px-4 {
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }
            
            .py-2 {
              padding-top: 0.5rem !important;
              padding-bottom: 0.5rem !important;
            }
            
            .py-3 {
              padding-top: 0.75rem !important;
              padding-bottom: 0.75rem !important;
            }
            
            .py-4 {
              padding-top: 1rem !important;
              padding-bottom: 1rem !important;
            }
            
            .border {
              border-width: 1px !important;
            }
            
            .border-gray-300 {
              border-color: #d1d5db !important;
            }
            
            .focus\\:outline-none:focus {
              outline: 2px solid transparent !important;
              outline-offset: 2px !important;
            }
            
            .focus\\:ring-2:focus {
              --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important;
              --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important;
              box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important;
            }
            
            .focus\\:ring-blue-500:focus {
              --tw-ring-opacity: 1 !important;
              --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity)) !important;
            }
            
            .focus\\:border-blue-500:focus {
              border-color: #3b82f6 !important;
            }
            
            .w-full {
              width: 100% !important;
            }
            
            .h-10 {
              height: 2.5rem !important;
            }
            
            .h-12 {
              height: 3rem !important;
            }
            
            .text-base {
              font-size: 1rem !important;
              line-height: 1.5rem !important;
            }
            
            .leading-6 {
              line-height: 1.5rem !important;
            }
            
            .placeholder-gray-500::placeholder {
              color: #6b7280 !important;
            }
            
            .disabled\\:opacity-50:disabled {
              opacity: 0.5 !important;
            }
            
            .disabled\\:cursor-not-allowed:disabled {
              cursor: not-allowed !important;
            }
          `
        }} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
