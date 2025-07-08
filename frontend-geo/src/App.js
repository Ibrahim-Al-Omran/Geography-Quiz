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
        <div className="scroll-wrapper">
          <div className="card-container">
            <MainApp />
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;