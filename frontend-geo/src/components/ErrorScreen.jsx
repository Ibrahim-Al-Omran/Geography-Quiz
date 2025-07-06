// Create a new file: src/components/ErrorScreen.jsx
import React from 'react';

const ErrorScreen = ({ error }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      padding: '2rem',
      backgroundColor: '#fef2f2',
      borderRadius: '0.5rem',
      border: '1px solid #fecaca'
    }}>
      <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Error</h2>
      <p style={{ color: '#7f1d1d' }}>{error}</p>
    </div>
  );
};

export default ErrorScreen;