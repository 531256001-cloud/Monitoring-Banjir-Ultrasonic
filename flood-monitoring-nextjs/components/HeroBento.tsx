'use client';

import React from 'react';
import {
  Database,
  ArrowDown,
  ArrowUp,
  Activity,
  Droplets,
  CloudRain,
  Clock,
  Sun,
  Signal,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { SystemStats } from '@/lib/types';

interface HeroBentoProps {
  stats: SystemStats;
  selectedPos: string;
  onManualSync: () => void;
  isSyncing: boolean;
}

export const HeroBento: React.FC<HeroBentoProps> = ({
  stats,
  selectedPos,
  onManualSync,
  isSyncing,
}) => {
  // Status styling
  const getBadgeStyle = () => {
    switch (stats.currentStatus) {
      case 'BAHAYA':
        return {
          container: 'bg-[#7F1D1D] text-[#F87171] border border-[#EF4444]/40',
          dot: 'bg-error',
          label: 'STATUS: BAHAYA',
        };
      case 'WASPADA':
        return {
          container: 'bg-[#7C2D12] text-[#FB923C] border border-[#F97316]/40',
          dot: 'bg-primary-container',
          label: 'STATUS: WASPADA',
        };
      case 'DI LUAR JANGKAUAN':
        return {
          container: 'bg-surface-container-high text-on-surface-variant border border-surface-variant/40',
          dot: 'bg-outline',
          label: 'DI LUAR JANGKAUAN',
        };
      case 'AMAN':
      default:
        return {
          container: 'bg-[#064E3B] text-[#34D399] border border-[#10B981]/40',
          dot: 'bg-secondary',
          label: 'STATUS: AMAN',
        };
    }
  };

  const badge = getBadgeStyle();

  // Calculate percentage of water level bar (0 to 400 cm)
  // Distance 0 = 100% full (overflowing / Bahaya)
  // Distance 400 = 0% full (dry riverbed / bottom)
  const barPercent = Math.min(100, Math.max(0, ((400 - Math.min(400, stats.currentDistance)) / 400) * 100));

  return (
    <section className="w-full bg-surface-container-low rounded-xl p-5 lg:p-6 shadow-xl relative overflow-hidden border border-surface-variant/30">
      {/* Ambient status illumination glow */}
      <div
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          stats.currentStatus === 'BAHAYA'
            ? 'bg-error/20'
            : stats.currentStatus === 'WASPADA'
            ? 'bg-primary-container/15'
            : 'bg-secondary/10'
        }`}
      />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-variant/30 relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                stats.currentStatus === 'BAHAYA'
                  ? 'bg-error shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-ping'
                  : stats.currentStatus === 'WASPADA'
                  ? 'bg-primary-container shadow-[0_0_12px_rgba(249,115,22,0.9)] animate-pulse'
                  : 'bg-secondary shadow-[0_0_12px_rgba(78,222,163,0.9)] animate-pulse'
              }`}
            />
            <span className="font-mono text-xs text-secondary uppercase tracking-widest font-semibold">
              TELEMETRI AKTIF • FIREBASE RTDB STREAM
            </span>
            <span className="text-surface-variant hidden sm:inline">•</span>
            <span className="font-mono text-xs text-on-surface-variant">
              NODE: ESP32-ULTRASONIC-E7
            </span>
          </div>
          <h1 className="font-headline text-xl lg:text-2xl font-bold text-on-surface tracking-tight">
            Data Realtime Sensor Ultrasonic
            <span className="text-on-surface-variant font-body text-sm lg:text-base font-normal block sm:inline sm:ml-2">
              — {selectedPos === 'POS-01' ? 'Pos Pantau Bendung Katulampa' : selectedPos === 'POS-02' ? 'Pos Pantau Pintu Air Manggarai' : selectedPos === 'POS-03' ? 'Pos Pantau Sungai Ciliwung (Jembatan Depok KM 34)' : 'Pos Pantau Kali Angke Pesing'}
            </span>
          </h1>
        </div>

        {/* Live RTDB Endpoint Pill */}
        <div className="flex items-center gap-2.5 bg-surface-container px-3.5 py-1.5 rounded border border-surface-variant/40">
          <Database className="w-4 h-4 text-primary" />
          <div className="flex flex-col text-right">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase">
              RTDB Instance Path
            </span>
            <span className="font-mono text-xs text-primary font-semibold select-all">
              /sensor_jarak/value
            </span>
          </div>
          <div
            className={`w-2 h-2 rounded-full ${
              stats.connectionStatus === 'STREAMING' || stats.connectionStatus === 'POLLING'
                ? 'bg-secondary animate-pulse'
                : 'bg-outline'
            }`}
          />
        </div>
      </div>

      {/* Realtime Core Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-5 relative z-10">
        {/* Primary KPI: Ultrasonic Distance (Firebase sensor_jarak) */}
        <div className="lg:col-span-4 bg-surface-container rounded-lg p-5 flex flex-col justify-between shadow-md border border-surface-variant/30 relative overflow-hidden group">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                Jarak Sensor ke Muka Air
              </span>
              <span className="font-body text-xs text-outline">
                Realtime Ultrasonic Ping Echo (HC-SR04 / JSN-SR04T)
              </span>
            </div>

            {/* Dynamic Status Badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold ${badge.container}`}>
              <span className={`w-2 h-2 rounded-full ${badge.dot} animate-ping`} />
              <span>{badge.label}</span>
            </div>
          </div>

          {/* Big Metric Display */}
          <div className="my-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tighter">
                {stats.currentDistance > 400 ? '> 400' : stats.currentDistance.toFixed(2)}
              </span>
              <span className="font-headline text-xl text-primary font-bold">cm</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 font-mono text-xs text-on-surface-variant">
              <span className="text-secondary flex items-center font-bold">
                {stats.delta1Hour >= 0 ? (
                  <>
                    <ArrowDown className="w-3.5 h-3.5 text-secondary mr-0.5" /> -{Math.abs(stats.delta1Hour)} cm
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-3.5 h-3.5 text-error mr-0.5" /> +{Math.abs(stats.delta1Hour)} cm
                  </>
                )}
              </span>
              <span>•</span>
              <span className="text-outline">
                Kondisi:{' '}
                <strong className="text-on-surface font-mono">{stats.currentCondition}</strong>
              </span>
            </div>
          </div>

          {/* Water Cross Section Level Bar */}
          <div className="flex flex-col gap-1.5 pt-2">
            <div className="flex items-center justify-between font-mono text-xs text-on-surface-variant">
              <span>Ambang Batas Siaga Banjir</span>
              <span
                className={`font-bold ${
                  stats.currentStatus === 'BAHAYA'
                    ? 'text-error'
                    : stats.currentStatus === 'WASPADA'
                    ? 'text-primary-container'
                    : 'text-secondary'
                }`}
              >
                {stats.currentStatus === 'BAHAYA'
                  ? 'Siaga 1 (Bahaya)'
                  : stats.currentStatus === 'WASPADA'
                  ? 'Siaga 2 (Waspada)'
                  : stats.currentStatus === 'DI LUAR JANGKAUAN'
                  ? 'Di Luar Jangkauan'
                  : 'Siaga 4 (Normal)'}
              </span>
            </div>

            {/* Bar Track with Visual Level Marker */}
            <div className="w-full h-3.5 bg-surface-container-lowest rounded-full overflow-hidden flex p-0.5 border border-surface-variant/40 relative">
              <div className="h-full bg-error rounded-l-full w-[25%]" title="Bahaya: Jarak < 100 cm" />
              <div className="h-full bg-primary-container w-[25%]" title="Waspada: Jarak 100 - 200 cm" />
              <div className="h-full bg-secondary rounded-r-full w-[50%]" title="Aman: Jarak > 200 cm" />
              
              {/* Dynamic pointer pin */}
              <div
                className="absolute top-0 bottom-0 w-2 bg-on-surface shadow-[0_0_8px_#ffffff] rounded-full transition-all duration-500 transform -translate-x-1"
                style={{
                  left: `${Math.max(2, Math.min(98, 100 - (stats.currentDistance / 400) * 100))}%`,
                }}
                title={`Posisi Saat Ini: ${stats.currentDistance} cm`}
              />
            </div>

            <div className="flex justify-between font-mono text-[10px] text-outline pt-0.5">
              <span>0 cm (Limpas)</span>
              <span>100 cm (Bahaya)</span>
              <span>200 cm (Waspada)</span>
              <span>400 cm (Dasar)</span>
            </div>
          </div>
        </div>

        {/* Secondary Telemetry Array (2x2 Middle Bento) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
          {/* TMA: Tinggi Muka Air */}
          <div className="bg-surface-container rounded-lg p-4 flex flex-col justify-between border border-surface-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-on-surface-variant">TMA DARI DASAR</span>
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div className="my-1.5">
              <span className="font-mono text-2xl lg:text-3xl font-bold text-on-surface">
                {stats.currentWaterLevel.toFixed(2)}
              </span>
              <span className="font-mono text-xs text-on-surface-variant ml-1">cm</span>
            </div>
            <span className="font-mono text-xs text-secondary flex items-center">
              Elevasi: {(stats.currentWaterLevel / 100).toFixed(2)} m
            </span>
          </div>

          {/* Debit Air */}
          <div className="bg-surface-container rounded-lg p-4 flex flex-col justify-between border border-surface-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-on-surface-variant">ESTIMASI DEBIT</span>
              <Droplets className="w-4 h-4 text-secondary" />
            </div>
            <div className="my-1.5">
              <span className="font-mono text-2xl lg:text-3xl font-bold text-on-surface">
                {stats.flowRate.toFixed(2)}
              </span>
              <span className="font-mono text-xs text-on-surface-variant ml-1">m³/detik</span>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">
              Kecepatan: {(0.25 + stats.flowRate * 0.1).toFixed(2)} m/s
            </span>
          </div>

          {/* Curah Hujan */}
          <div className="bg-surface-container rounded-lg p-4 flex flex-col justify-between border border-surface-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-on-surface-variant">CURAH HUJAN HULU</span>
              <CloudRain className="w-4 h-4 text-outline" />
            </div>
            <div className="my-1.5">
              <span className="font-mono text-2xl lg:text-3xl font-bold text-on-surface">
                {stats.rainfall.toFixed(2)}
              </span>
              <span className="font-mono text-xs text-on-surface-variant ml-1">mm/jam</span>
            </div>
            <span className="font-mono text-xs text-secondary">
              {stats.rainfall > 0 ? 'Hujan Sedang' : 'Kering / Cerah'}
            </span>
          </div>

          {/* Fluktuasi 1 Jam */}
          <div className="bg-surface-container rounded-lg p-4 flex flex-col justify-between border border-surface-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-on-surface-variant">FLUKTUASI 1 JAM</span>
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="my-1.5">
              <span
                className={`font-mono text-2xl lg:text-3xl font-bold ${
                  stats.delta1Hour >= 0 ? 'text-secondary' : 'text-error'
                }`}
              >
                {stats.delta1Hour >= 0 ? `+${stats.delta1Hour}` : stats.delta1Hour}
              </span>
              <span className="font-mono text-xs text-on-surface-variant ml-1">cm</span>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">
              Tren: {stats.delta1Hour >= 0 ? 'Surut / Stabil' : 'Muka air naik'}
            </span>
          </div>
        </div>

        {/* Node Hardware & Network Health (3-col right) */}
        <div className="lg:col-span-3 bg-surface-container rounded-lg p-4 flex flex-col justify-between border border-surface-variant/30">
          <div className="flex items-center justify-between pb-2 border-b border-surface-variant/20">
            <span className="font-mono text-xs uppercase text-on-surface font-bold">
              Diagnostik IoT Pos
            </span>
            <span className="font-mono text-xs text-secondary font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              ONLINE
            </span>
          </div>

          <div className="space-y-3 py-2">
            {/* Solar Battery */}
            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-on-surface-variant flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-secondary" /> Solar LiFePO4
                </span>
                <span className="text-on-surface">
                  {stats.batteryLevel}% ({stats.batteryVoltage}V)
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full"
                  style={{ width: `${stats.batteryLevel}%` }}
                />
              </div>
            </div>

            {/* Signal RSSI */}
            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-on-surface-variant flex items-center gap-1">
                  <Signal className="w-3.5 h-3.5 text-primary" /> 4G LTE Cat-M1
                </span>
                <span className="text-on-surface">{stats.signalRssi} dBm (Kuat)</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[82%]" />
              </div>
            </div>

            {/* RTDB Latency */}
            <div className="p-2 rounded bg-surface-container-lowest flex items-center justify-between font-mono text-xs border border-surface-variant/20">
              <span className="text-on-surface-variant">Push Ping:</span>
              <span className="text-secondary font-bold">
                {stats.lastPingTime} ({stats.lastLatencyMs}ms)
              </span>
            </div>
          </div>

          <button
            onClick={onManualSync}
            disabled={isSyncing}
            className="w-full py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface font-mono text-xs rounded flex items-center justify-center gap-1.5 transition-all border border-surface-variant/40 hover:border-primary/50"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-primary ${isSyncing ? 'animate-spin' : ''}`} />
            <span>SYNC ULTRASONIC PING</span>
          </button>
        </div>
      </div>
    </section>
  );
};

