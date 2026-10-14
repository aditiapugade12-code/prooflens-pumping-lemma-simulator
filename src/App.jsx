import React, { useState } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Learn from './components/Learn';
import Examples from './components/Examples';
import TryIt from './components/TryIt';
import Proof from './components/Proof';
import Viva from './components/Viva';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [tryItState, setTryItState] = useState(null);

  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'learn':
        return <Learn />;
      case 'examples':
        return <Examples setCurrentPage={setCurrentPage} setTryItState={setTryItState} />;
      case 'tryit':
        return <TryIt initialState={tryItState} />;
      case 'proof':
        return <Proof />;
      case 'viva':
        return <Viva />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      
      <main className="main-content">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
}

export default App;
