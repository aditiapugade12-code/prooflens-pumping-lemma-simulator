import React from 'react';
import '../styles/Navbar.css';

export default function Navbar({ currentPage, setCurrentPage, darkMode, setDarkMode }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="navbar-title">Pumping Lemma Simulator</h1>
        </div>
        
        <div className="navbar-links">
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${currentPage === 'learn' ? 'active' : ''}`}
            onClick={() => setCurrentPage('learn')}
          >
            Learn
          </button>
          <button 
            className={`nav-link ${currentPage === 'examples' ? 'active' : ''}`}
            onClick={() => setCurrentPage('examples')}
          >
            Examples
          </button>
          <button 
            className={`nav-link ${currentPage === 'tryit' ? 'active' : ''}`}
            onClick={() => setCurrentPage('tryit')}
          >
            Try It
          </button>
          <button 
            className={`nav-link ${currentPage === 'proof' ? 'active' : ''}`}
            onClick={() => setCurrentPage('proof')}
          >
            Proof
          </button>
          <button 
            className={`nav-link ${currentPage === 'viva' ? 'active' : ''}`}
            onClick={() => setCurrentPage('viva')}
          >
            Viva
          </button>
        </div>

        <button 
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
