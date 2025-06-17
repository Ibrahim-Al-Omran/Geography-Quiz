// Create a new file: src/components/ErrorScreen.jsx
import React from 'react';

export default function ErrorScreen({ error }) {
  return (
    <div className="card">
      <div className="status-text error-text">
        {error}
      </div>
    </div>
  );
}