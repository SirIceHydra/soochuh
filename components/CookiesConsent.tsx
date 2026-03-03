import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'cookie_consent';

export const CookiesConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (!value) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {}
    setVisible(false);
  };

  const decline = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'declined');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9000] sm:left-6 sm:right-auto sm:max-w-xl">
      <div className="bg-zinc-950 text-white border border-purple-600 rounded-lg shadow-2xl p-4 sm:p-5">
        <p className="text-sm sm:text-base font-semibold leading-snug">
          We use cookies to improve your experience. See our{' '}
          <Link to="/cookies-policy" className="text-purple-400 underline underline-offset-4">
            Cookies Policy
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={accept}
            className="px-4 py-2 bg-purple-600 text-zinc-950 font-bold uppercase tracking-widest text-xs sm:text-sm rounded hover:bg-purple-500 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="px-4 py-2 bg-zinc-900 text-white font-bold uppercase tracking-widest text-xs sm:text-sm rounded border border-white/10 hover:bg-zinc-800 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};
