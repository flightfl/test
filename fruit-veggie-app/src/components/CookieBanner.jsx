import { useState, useEffect } from 'react';

function CookieBanner() {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const stored = localStorage.getItem('cookiesAccepted');
    if (stored) {
      const { accepted, expiresAt } = JSON.parse(stored);
      if (!accepted || Date.now() > expiresAt) {
        setVisible(true); // Expired or invalid
      }
    } else {
      setVisible(true); // Not stored at all
    }
  }, []);
  
  const acceptCookies = () => {
    const expiresAt = Date.now() + 1000 * 60; // 1 minute for testing
    localStorage.setItem('cookiesAccepted', JSON.stringify({ accepted: true, expiresAt }));
    setVisible(false);
  };
  
  if (!visible) return null;
  
  return (
    <div className="cookie-banner">
      <p>This site uses cookies for authentication and preferences.</p>
      <button onClick={acceptCookies}>Accept</button>
    </div>
  );
}

export default CookieBanner;