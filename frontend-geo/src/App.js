import React, { useState } from "react";
import './App.css';
import './components/global.css';
import { AuthProvider } from './contexts/AuthContext';
import MainApp from './components/MainApp';
import './styles/browserOverrides.css';

function App() {
  const [showSocialButtons, setShowSocialButtons] = useState(true); // State to toggle visibility

  return (
    <AuthProvider>
      <div className="app-container">
        <div className="scroll-wrapper">
          <div className="card-container">
            <MainApp />
          </div>
        </div>

        {/* Social buttons */}
        <div className={`socialButtons ${showSocialButtons ? '' : 'hidden'}`}>
          <a href="https://github.com/Ibrahim-Al-Omran" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fab fa-github"></i> {/* GitHub icon */}
          </a>
          <a href="https://linkedin.com/in/Ibrahim-Al-Omran" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in"></i> {/* LinkedIn icon */}
          </a>
        </div>

        {/* Toggle button for all screens */}
        <button 
          className="toggleSocialButton" 
          onClick={() => setShowSocialButtons(!showSocialButtons)}
        >
          {showSocialButtons ? '✖' : '☰'} {/* "X" for hide, "☰" for show */}
        </button>
      </div>
    </AuthProvider>
  );
}

export default App;