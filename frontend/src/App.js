import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Replace 'yourusername' and 'yourpassword' with your actual n8n credentials
      const username = 'yourusername';
      const password = 'yourpassword';
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
        // If it's a single item wrapped in { json: {...} }
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

  return (
    <div className="App">
      <header className="App-header" style={{ 
        backgroundColor: '#282c34', 
        padding: '20px', 
        color: 'white', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{ marginBottom: '30px' }}>Smithery Brave Web Search</h1>
        
        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '30px',
          width: '100%',
          maxWidth: '600px'
        }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query (e.g., weather in Johannesburg)"
            required
            style={{ 
              flex: 1,
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: loading ? '#666' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div style={{ 
            color: '#ff6b6b', 
            backgroundColor: '#ffe0e0',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            width: '100%',
            maxWidth: '600px'
          }}>
            {error}
          </div>
        )}

        {results && results.length > 0 && (
          <div className="results-container" style={{ 
            width: '100%',
            maxWidth: '800px',
            textAlign: 'left'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#4CAF50' }}>
              Search Results ({results.length} found):
            </h3>
            
            {results.map((result, index) => (
              <div key={index} style={{ 
                backgroundColor: '#f8f9fa',
                color: '#333',
                padding: '20px',
                marginBottom: '15px',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <h4 style={{ 
                  margin: '0 0 10px 0',
                  color: '#007bff'
                }}>
                  {result.title || `Search Result ${index + 1}`}
                </h4>
                
                <p style={{ 
                  margin: '0 0 10px 0',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {result.description || result.text || 'No description available'}
                </p>
                
                {result.link && result.link !== '#' && (
                  <a 
                    href={result.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#28a745',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}
                  >
                    {result.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {results && results.length === 0 && (
          <div style={{ 
            color: '#ffc107',
            backgroundColor: '#fff3cd',
            padding: '15px',
            borderRadius: '4px',
            width: '100%',
            maxWidth: '600px'
          }}>
            No search results found. Try a different query.
          </div>
        )}
      </header>
    </div>
  );
}

export default App;


