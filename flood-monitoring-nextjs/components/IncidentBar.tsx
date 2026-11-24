'use client';

import React, { useState } from 'react';
import { BellRing, Volume2, VolumeX, Send, CheckCircle2 } from 'lucide-react';
import { sirenPlayer } from '@/lib/audio';

export const IncidentBar: React.FC = () => {
  const [isSirenPlaying, setIsSirenPlaying] = useState<boolean>(false);
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);

  const toggleSiren = () => {
    if (sirenPlayer) {
      const active = sirenPlayer.toggle();
      setIsSirenPlaying(active);
    }
  };

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
    }, 3500);
  };

  return (
    <section className="w-full bg-surface-container rounded-xl p-4 lg:p-5 flex flex-wrap items-center justify-between gap-4 border border-surface-variant/30">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/30">
          <BellRing className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="font-headline text-base lg:text-lg font-bold text-on-surface">
            Protokol Diseminasi EWS & Sirene Darurat
          </h4>
          <p className="font-body text-xs lg:text-sm text-on-surface-variant">
            Sirene Pos Katulampa & Manggarai terhubung otomatis ke Firebase RTDB saat ambang jarak &lt; 100 cm.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Test Siren Button */}
        <button
          onClick={toggleSiren}
          className={`px-4 py-2 rounded font-mono text-xs flex items-center gap-2 border transition-all ${
            isSirenPlaying
              ? 'bg-error text-on-error border-error shadow-[0_0_16px_rgba(239,68,68,0.5)] animate-pulse'
              : 'bg-surface-container-high hover:bg-surface-bright text-on-surface border-surface-variant/40'
          }`}
        >
          {isSirenPlaying ? (
            <>
              <VolumeX className="w-4 h-4 text-white" />
              <span className="font-bold">STOP SIRENE EWS</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-primary" />
              <span>TEST AUDIO SIRENE POS</span>
            </>
          )}
        </button>

        {/* Broadcast Alert BPBD Button */}
        <button
          onClick={handleBroadcast}
          disabled={broadcastSent}
          className={`px-4 py-2 rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${
            broadcastSent
              ? 'bg-secondary text-on-secondary'
              : 'bg-primary text-on-primary hover:opacity-90'
          }`}
        >
          {broadcastSent ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>ALERT TERKIRIM KE BPBD</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>BROADCAST ALERT BPBD</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};

