import React from 'react';

export const EnvDebug: React.FC = () => {
  if (process.env.NODE_ENV !== 'production') {
    return null; // Only show in production for debugging
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Environment Debug</h3>
      <div className="space-y-1">
        <div>NODE_ENV: {process.env.NODE_ENV}</div>
        <div>BFF_BASE_URL: {process.env.BFF_BASE_URL || 'Not set'}</div>
        <div>NEXT_PUBLIC_BFF_BASE_URL: {process.env.NEXT_PUBLIC_BFF_BASE_URL || 'Not set'}</div>
        <div>NEXT_PUBLIC_API_TIMEOUT: {process.env.NEXT_PUBLIC_API_TIMEOUT || 'Not set'}</div>
      </div>
    </div>
  );
};
