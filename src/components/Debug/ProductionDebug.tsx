import React, { useEffect, useState } from 'react';

export const ProductionDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkResources = async () => {
      const info: any = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        userAgent: navigator.userAgent,
        cssFiles: [],
        jsFiles: [],
        errors: []
      };

      // Check CSS files
      const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
      cssLinks.forEach((link: any) => {
        info.cssFiles.push({
          href: link.href,
          media: link.media,
          disabled: link.disabled
        });
      });

      // Check JS files
      const jsScripts = document.querySelectorAll('script[src]');
      jsScripts.forEach((script: any) => {
        info.jsFiles.push({
          src: script.src,
          async: script.async,
          defer: script.defer
        });
      });

      // Check for errors
      const originalError = console.error;
      const originalWarn = console.warn;
      const errors: string[] = [];
      
      console.error = (...args) => {
        errors.push(`ERROR: ${args.join(' ')}`);
        originalError.apply(console, args);
      };
      
      console.warn = (...args) => {
        errors.push(`WARN: ${args.join(' ')}`);
        originalWarn.apply(console, args);
      };

      // Test CSS loading
      try {
        const testElement = document.createElement('div');
        testElement.className = 'bg-blue-500 text-white p-4 rounded';
        testElement.style.display = 'none';
        document.body.appendChild(testElement);
        
        const computedStyle = window.getComputedStyle(testElement);
        info.tailwindTest = {
          backgroundColor: computedStyle.backgroundColor,
          color: computedStyle.color,
          padding: computedStyle.padding,
          borderRadius: computedStyle.borderRadius
        };
        
        document.body.removeChild(testElement);
      } catch (error) {
        info.tailwindTest = { error: error.message };
      }

      // Check if CSS is actually loaded
      const bodyStyles = window.getComputedStyle(document.body);
      info.bodyStyles = {
        backgroundColor: bodyStyles.backgroundColor,
        fontFamily: bodyStyles.fontFamily,
        margin: bodyStyles.margin,
        padding: bodyStyles.padding
      };

      setDebugInfo(info);
    };

    checkResources();
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      maxHeight: '80vh',
      overflow: 'auto',
      backgroundColor: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <h3>🔍 Production Debug</h3>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
};
