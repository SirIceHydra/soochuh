import React, { useEffect } from 'react';

interface ToastProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ isOpen, message, onClose, duration = 2500 }) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{ pointerEvents: 'none' }}
      className="fixed top-4 sm:top-6 right-0 z-[10000] w-full max-w-sm px-4 sm:px-6"
    >
      <div
        className={`ml-auto transform transition-all duration-300 ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div
          className="shadow-xl border rounded-lg bg-zinc-950 border-purple-600 text-white"
          style={{
            pointerEvents: 'auto',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgb(147, 51, 234)',
          }}
          role="status"
        >
          <div className="p-4 flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-6 h-6 rounded-full bg-purple-600 text-zinc-950 flex items-center justify-center font-bold text-sm">
                ✓
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-widest text-purple-400">Added to cart</p>
              <p className="font-semibold leading-snug text-white mt-1">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="px-2 py-1 text-sm rounded hover:bg-purple-500/20 transition-colors text-purple-400"
              style={{ 
                fontSize: '18px',
                fontWeight: 'bold',
                minWidth: '24px',
                minHeight: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

