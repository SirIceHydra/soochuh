import React from 'react';

interface PaymentProcessingModalProps {
  isOpen: boolean;
  message?: string;
}

export function PaymentProcessingModal({ isOpen, message = 'Processing your payment...' }: PaymentProcessingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-sm max-w-md mx-4 text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-black font-bold uppercase tracking-widest text-sm">{message}</p>
        <p className="text-zinc-500 text-xs mt-2">Please do not close this window</p>
      </div>
    </div>
  );
}
