import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return; // Don't search empty queries
    
    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Your existing working credentials
      const username = 'admin@entrsphere.com';
      const password = 'gW5pH8pWmfQKxyU';
      const credentials = btoa(`${username}:${password}`);

      const res = await fetch('https://n8n.entrsphere.com/webhook-test/api/search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Response data:', data); // For debugging
      
      // Handle the response format from your n8n workflow
      if (Array.isArray(data)) {
        setResults(data);
      } else if (data.json) {
        setResults([data.json]);
      } else {
        setResults([data]);
      }

    } catch (e) {
      setError('Failed to fetch search results. Please try again.');
      console.error('Search error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Function to highlight search terms in results
  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="highlight">{part}</span>
      ) : part
    );
  };

  // Function to truncate long URLs for display
  const formatUrl = (url) => {
    if (!url || url === '#') return null;
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname.substring(0, 30) + '...' : '');
    } catch {
      return url.length > 50 ? url.substring(0, 50) + '...' : url;
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">Smithery Brave Web Search</h1>
          <p className="subtitle">Powered by AI • Fast • Reliable</p>
        </header>

        <div className="search-section">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-input-wrapper">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for anything..."
                className="search-input"
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={loading || !query.trim()}
                className="search-button"
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {error}
            </div>
          )}
        </div>

        {results && results.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2 className="results-title">
                Search Results ({results.length} found)
              </h2>
              <div className="results-meta">
                Showing results for: <span className="query-highlight">"{query}"</span>
              </div>
            </div>
            
            <div className="results-grid">
              {results.map((result, index) => (
                <article key={index} className="result-card">
                  <div className="result-content">
                    <h3 className="result-title">
                      {result.link && result.link !== '#' ? (
                        <a 
                          href={result.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="result-link"
                        >
                          {highlightSearchTerm(result.title || `Search Result ${index + 1}`, query)}
                        </a>
                      ) : (
                        highlightSearchTerm(result.title || `Search Result ${index + 1}`, query)
                      )}
                    </h3>
                    
                    <p className="result-description">
                      {highlightSearchTerm(
                        result.description || result.text || 'No description available', 
                        query
                      )}
                    </p>
                    
                    {result.link && result.link !== '#' && (
                      <div className="result-url">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        <span>{formatUrl(result.link)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="result-actions">
                    {result.link && result.link !== '#' && (
                      <a 
                        href={result.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="visit-button"
                      >
                        Visit
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M7 17L17 7"></path>
                          <path d="M7 7h10v10"></path>
                        </svg>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {results && results.length === 0 && (
          <div className="no-results">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <h3>No results found</h3>
            <p>Try adjusting your search query or using different keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;