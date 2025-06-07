import React, { useState } from 'react';
import './App.css'; // Assuming you have some basic styles

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null); // To store search results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      // NOTE: Use your final production n8n webhook URL here.
      // The /api/search path should be proxied by your deployment to your n8n instance.
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      // Access the nested 'results' array from the Code node's output
      setResults(data.results); 

    } catch (e) {
      setError('Failed to fetch search results. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Smithery Brave Web Search</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query"
            required
            style={{ width: '60%', padding: '10px' }}
          />
          <button type="submit" disabled={loading} style={{ padding: '10px' }}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {results && (
          <div className="results-container" style={{ textAlign: 'left', marginTop: '30px' }}>
            {results.map((result, index) => (
              <div key={index} className="result-item" style={{ marginBottom: '20px' }}>
                <h3><a href={result.link} target="_blank" rel="noopener noreferrer">{result.title}</a></h3>
                <p>{result.description}</p>
                <a href={result.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9em', color: '#ccc' }}>{result.link}</a>
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

