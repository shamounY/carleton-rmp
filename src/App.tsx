import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Load saved theme preference
    chrome.storage.local.get(['themePreference'], (result) => {
      if (result.themePreference !== undefined) {
        setIsDarkMode(result.themePreference === 'dark');
      }
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      chrome.storage.local.get(['themePreference'], (result) => {
          if (result.themePreference === undefined) {
              setIsDarkMode(e.matches);
          }
      });
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    // Save theme preference
    chrome.storage.local.set({ themePreference: newTheme ? 'dark' : 'light' });

    // Only reload tabs that match our content script URL pattern
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      if (currentTab.url?.includes('central.carleton.ca/prod/bwysched.p_course_search')) {
        chrome.tabs.reload(currentTab.id!);
      }
    });
  };

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="App-header">
        <h1>Carleton RMP</h1>
        <p>Rate My Professors Integration</p>
        
        <div className="theme-toggle">
          <button onClick={toggleTheme} className="theme-button">
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <div className="info-section">
          <p>
            This extension shows RateMyProfessors ratings directly on Carleton Central.
          </p>
          <p>
            <a
              className="App-link"
              href="https://www.ratemyprofessors.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit RateMyProfessors
            </a>
          </p>
        </div>
      </header>
    </div>
  )
}

export default App
