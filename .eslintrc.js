module.exports = {
  extends: [
    'next/core-web-vitals'
  ],
  rules: {
    // React
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    
    // General
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error'
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  }
};
