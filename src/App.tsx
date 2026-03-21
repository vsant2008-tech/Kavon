import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Redirect to standalone Kavon HTML page
    window.location.href = '/kavon.html';
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Redirecting to Kavon Trading Platform...</h1>
      <p>If you're not redirected automatically, <a href="/kavon.html">click here</a>.</p>
    </div>
  );
}

export default App;
