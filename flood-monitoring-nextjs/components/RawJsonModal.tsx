'use client';

import React, { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';

interface RawJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export const RawJsonModal: React.FC<RawJsonModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-low border border-surface-variant/40 rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-variant/30 bg-surface-container">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <h3 className="font-headline text-base font-bold text-on-surface">
              Raw Firebase RTDB Payload Inspector
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-bright rounded text-xs font-mono text-on-surface flex items-center gap-1 border border-surface-variant/40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto font-mono text-xs text-on-surface-variant bg-surface-container-lowest">
          <pre className="whitespace-pre-wrap select-all">{jsonString || '// Menunggu sinkronisasi...'}</pre>
        </div>
      </div>
    </div>
  );
};

