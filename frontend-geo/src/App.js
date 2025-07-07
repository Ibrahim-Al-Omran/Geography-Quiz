import React, { useState } from "react";
import './App.css';
import './components/global.css';
import { AuthProvider } from './contexts/AuthContext';
import MainApp from './components/MainApp';
import './styles/browserOverrides.css';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <div className="card-container">
          <MainApp />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;