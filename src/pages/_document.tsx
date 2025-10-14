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
