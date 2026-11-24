'use client';

import React from 'react';
import { Waves, CloudCheck, Bell, RefreshCw, User, Radio, Cpu } from 'lucide-react';
import { AlertLevel } from '@/lib/types';

interface HeaderProps {
  connectionStatus: 'STREAMING' | 'POLLING' | 'CONNECTING' | 'ERROR';
  status: AlertLevel;
  selectedPos: string;
  onSelectPos: (pos: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  connectionStatus,
  status,
  selectedPos,
  onSelectPos,
  onRefresh,
  isRefreshing,
}) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'BAHAYA':
        return {
          label: 'SIAGA 1 / BAHAYA',
          bg: 'bg-error-container/40',
          text: 'text-error',
          dot: 'bg-error',
          ring: 'shadow-[0_0_16px_rgba(239,68,68,0.35)]',
        };
      case 'WASPADA':
        return {
          label: 'SIAGA 2 / WASPADA',
          bg: 'bg-primary-container/20',
          text: 'text-primary-container',
          dot: 'bg-primary-container',
          ring: 'shadow-[0_0_16px_rgba(249,115,22,0.3)]',
        };
      case 'DI LUAR JANGKAUAN':
        return {
          label: 'DI LUAR JANGKAUAN',
          bg: 'bg-surface-container-high',
          text: 'text-on-surface-variant',
          dot: 'bg-outline',
          ring: '',
        };
      case 'AMAN':
      default:
        return {
          label: 'SIAGA 4 / AMAN',
          bg: 'bg-[#064E3B]/60',
          text: 'text-secondary',
          dot: 'bg-secondary',
          ring: 'shadow-[0_0_16px_-4px_rgba(16,185,129,0.25)]',
        };
    }
  };

  const statusConfig = getStatusDisplay();

  return (
    <header className="sticky top-0 right-0 left-0 h-16 bg-surface/85 backdrop-blur-xl z-40 flex items-center justify-between px-4 lg:px-6 border-b border-surface-variant/30 shadow-md">
      {/* Brand & Connection Info */}
      <div className="flex items-center gap-3 lg:gap-4 flex-wrap">
        <div className="flex items-center gap-2 pr-3 border-r border-surface-variant/40">
          <div className="w-9 h-9 rounded bg-primary-container flex items-center justify-center text-on-primary-container font-headline font-bold shadow-[0_0_16px_-4px_rgba(249,115,22,0.4)]">
            <Waves className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-sm lg:text-base font-bold tracking-tight text-on-surface leading-tight">
              HYDRO-EWS
            </span>
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
              Ultrasonic Telemetry
            </span>
          </div>
        </div>

        {/* Live Firebase RTDB Badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-surface-container border border-surface-variant/30">
          <CloudCheck className={`w-4 h-4 ${connectionStatus === 'ERROR' ? 'text-error' : 'text-secondary'}`} />
          <span className="font-mono text-[11px] uppercase text-on-surface-variant">RTDB:</span>
          <span
            className={`font-mono text-[11px] font-bold tracking-wide flex items-center gap-1.5 ${
              connectionStatus === 'STREAMING'
                ? 'text-secondary'
                : connectionStatus === 'POLLING'
                ? 'text-primary'
                : connectionStatus === 'ERROR'
                ? 'text-error'
                : 'text-outline'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                connectionStatus === 'STREAMING' || connectionStatus === 'POLLING'
                  ? 'bg-secondary animate-pulse'
                  : 'bg-outline'
              }`}
            />
            {connectionStatus}
          </span>
        </div>

        {/* Pos Pantau Selector */}
        <div className="flex items-center gap-1 bg-surface-container-high rounded px-2.5 py-1 border border-surface-variant/30">
          <Radio className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-[11px] text-on-surface-variant hidden md:inline">POS:</span>
          <select
            value={selectedPos}
            onChange={(e) => onSelectPos(e.target.value)}
            className="bg-transparent text-on-surface font-mono text-xs outline-none cursor-pointer pr-1"
          >
            <option className="bg-surface-container-high text-on-surface" value="POS-01">
              POS-01 - Bendung Katulampa
            </option>
            <option className="bg-surface-container-high text-on-surface" value="POS-02">
              POS-02 - Pintu Air Manggarai
            </option>
            <option className="bg-surface-container-high text-on-surface" value="POS-03">
              POS-03 - Jembatan Ciliwung Depok
            </option>
            <option className="bg-surface-container-high text-on-surface" value="POS-04">
              POS-04 - Kali Angke Pesing
            </option>
          </select>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Siren EWS Status Pill */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded ${statusConfig.bg} ${statusConfig.ring} transition-all`}
        >
          <div className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`} />
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider leading-none">
              Status Sirene EWS
            </span>
            <span className={`font-mono text-xs font-bold ${statusConfig.text} leading-tight`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Sync / Refresh Button */}
        <button
          onClick={onRefresh}
          title="Sinkronisasi Telemetri RTDB"
          className="w-9 h-9 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border border-surface-variant/30 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
        </button>

        {/* User avatar indicator */}
        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-mono text-xs font-bold">
          E7
        </div>
      </div>
    </header>
  );
};

