// Create a new file: src/components/Loading.jsx
import React from 'react';

const Loading = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      fontSize: '1.2rem',
      color: '#6b7280'
    }}>
      Loading...
    </div>
  );
};

export default Loading;