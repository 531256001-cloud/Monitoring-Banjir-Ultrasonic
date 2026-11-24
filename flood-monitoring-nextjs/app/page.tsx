'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroBento } from '@/components/HeroBento';
import { TelemetryChart } from '@/components/TelemetryChart';
import { TelemetryTable } from '@/components/TelemetryTable';
import { IncidentBar } from '@/components/IncidentBar';
import { RawJsonModal } from '@/components/RawJsonModal';
import { useFirebaseRealtime } from '@/hooks/useFirebaseRealtime';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Home() {
  const { history, stats, rawDb, loading, error, manualRefresh } = useFirebaseRealtime();
  const [selectedPos, setSelectedPos] = useState<string>('POS-03');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isRawJsonOpen, setIsRawJsonOpen] = useState<boolean>(false);

  const handleManualRefresh = async () => {
    setIsSyncing(true);
    await manualRefresh();
    setTimeout(() => {
      setIsSyncing(false);
    }, 450);
  };

  return (
    <div className="w-full min-h-screen bg-surface flex flex-col">
      {/* Top Navigation Bar */}
      <Header
        connectionStatus={stats.connectionStatus}
        status={stats.currentStatus}
        selectedPos={selectedPos}
        onSelectPos={setSelectedPos}
        onRefresh={handleManualRefresh}
        isRefreshing={isSyncing}
      />

      {/* Main Monitoring Content */}
      <main className="relative w-full max-w-[1600px] mx-auto px-4 lg:px-6 py-5 flex-1 flex flex-col gap-5">
        {/* Connection Notice / Error notification if needed */}
        {error && (
          <div className="bg-error-container/30 border border-error/40 text-error rounded-lg px-4 py-2.5 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-error" />
              <span>Status Koneksi: {error} (Mencoba menghubungkan kembali...)</span>
            </div>
            <button
              onClick={handleManualRefresh}
              className="px-2.5 py-1 rounded bg-error/20 hover:bg-error/30 text-white flex items-center gap-1 font-bold"
            >
              <RefreshCw className="w-3 h-3" /> Coba Lagi
            </button>
          </div>
        )}

        {/* TOP HERO BENTO: Realtime Ultrasonic & Hydrology KPIs */}
        <HeroBento
          stats={stats}
          selectedPos={selectedPos}
          onManualSync={handleManualRefresh}
          isSyncing={isSyncing}
        />

        {/* BOTTOM SECTION: 2-Column Responsive Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
          {/* Left Column (7 cols): Interactive Elevation Chart & Video/Radar */}
          <div className="lg:col-span-7">
            <TelemetryChart history={history} currentDistance={stats.currentDistance} />
          </div>

          {/* Right Column (5 cols): Table History Data with search, filter, CSV */}
          <div className="lg:col-span-5">
            <TelemetryTable
              history={history}
              onToggleRawJson={() => setIsRawJsonOpen(true)}
              isRawJsonOpen={isRawJsonOpen}
            />
          </div>
        </div>

        {/* Incident Trigger Bar / EWS Siren Testing */}
        <IncidentBar />
      </main>

      {/* Footer System Stamp */}
      <footer className="border-t border-surface-variant/20 py-4 px-6 text-center font-mono text-xs text-outline bg-surface-container-lowest">
        HYDRO-EWS Telemetry Dashboard • Praktikum Instrumentasi Elektronika (Randy Rahmanto, ST., MT.) • Powered by Firebase RTDB
      </footer>

      {/* Raw JSON Modal Viewer */}
      <RawJsonModal
        isOpen={isRawJsonOpen}
        onClose={() => setIsRawJsonOpen(false)}
        data={rawDb}
      />
    </div>
  );
}

