'use client';

import React, { useState } from 'react';
import { TrendingUp, Video, Radar } from 'lucide-react';
import { TelemetryRecord } from '@/lib/types';

interface TelemetryChartProps {
  history: TelemetryRecord[];
  currentDistance: number;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({ history, currentDistance }) => {
  const [timeFilter, setTimeFilter] = useState<'1h' | '6h' | '24h' | 'all'>('24h');
  const [hoveredPoint, setHoveredPoint] = useState<TelemetryRecord | null>(null);

  // Filter history according to time selector
  const getFilteredData = () => {
    if (history.length === 0) return [];
    const now = new Date().getTime();
    if (timeFilter === '1h') {
      const cutoff = now - 60 * 60 * 1000;
      return history.filter((item) => item.timestamp.getTime() >= cutoff);
    }
    if (timeFilter === '6h') {
      const cutoff = now - 6 * 60 * 60 * 1000;
      return history.filter((item) => item.timestamp.getTime() >= cutoff);
    }
    if (timeFilter === '24h') {
      const cutoff = now - 24 * 60 * 60 * 1000;
      return history.filter((item) => item.timestamp.getTime() >= cutoff);
    }
    return history;
  };

  const filtered = getFilteredData();
  // We need chronological ascending for left-to-right chart rendering
  const chartPoints = [...filtered].reverse();

  // If chartPoints is very sparse, ensure we have at least the current reading
  const displayPoints = chartPoints.length > 0 ? chartPoints : [];

  // Summary statistics
  const distances = displayPoints.map((p) => p.distance);
  const minJarak = distances.length ? Math.min(...distances) : currentDistance;
  const maxJarak = distances.length ? Math.max(...distances) : currentDistance;
  const avgJarak = distances.length
    ? Number((distances.reduce((a, b) => a + b, 0) / distances.length).toFixed(2))
    : currentDistance;

  // Chart SVG Coordinates mapping:
  // ViewBox: width 640, height 220
  // X range: 50 to 620
  // Y range: distance from 0 cm (y = 20) to 400 cm (y = 190)
  // Distance smaller means higher water, so distance 0 is top (y=20), distance 400 is bottom (y=190)
  const mapY = (dist: number) => {
    const clamped = Math.max(0, Math.min(400, dist));
    // 0 cm -> y=20 (overflow), 400 cm -> y=190 (dry bed)
    return 20 + (clamped / 400) * 170;
  };

  const svgWidth = 640;
  const svgHeight = 220;
  const xStart = 50;
  const xEnd = 620;

  // Calculate points coordinate string
  const pointCoords = displayPoints.map((item, index) => {
    const x =
      displayPoints.length === 1
        ? (xStart + xEnd) / 2
        : xStart + (index / (displayPoints.length - 1)) * (xEnd - xStart);
    const y = mapY(item.distance);
    return { x, y, item };
  });

  const polylinePoints = pointCoords.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const polygonPoints =
    pointCoords.length > 0
      ? `${pointCoords[0].x.toFixed(1)},195 ${polylinePoints} ${pointCoords[
          pointCoords.length - 1
        ].x.toFixed(1)},195`
      : '';

  return (
    <div className="bg-surface-container-low rounded-xl p-5 lg:p-6 shadow-xl flex flex-col justify-between border border-surface-variant/30">
      {/* Chart Top Bar */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-headline text-lg lg:text-xl font-bold text-on-surface">
                Chart History Data
              </h2>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">
              Firebase Path: /historyDataJarak [Sinkronisasi Realtime]
            </span>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center bg-surface-container rounded p-0.5 font-mono text-xs border border-surface-variant/30">
            <button
              onClick={() => setTimeFilter('1h')}
              className={`px-3 py-1 rounded transition-colors ${
                timeFilter === '1h'
                  ? 'bg-surface-container-high text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              1 Jam
            </button>
            <button
              onClick={() => setTimeFilter('6h')}
              className={`px-3 py-1 rounded transition-colors ${
                timeFilter === '6h'
                  ? 'bg-surface-container-high text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              6 Jam
            </button>
            <button
              onClick={() => setTimeFilter('24h')}
              className={`px-3 py-1 rounded transition-colors ${
                timeFilter === '24h'
                  ? 'bg-surface-container-high text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              24 Jam
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1 rounded transition-colors ${
                timeFilter === 'all'
                  ? 'bg-surface-container-high text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Semua
            </button>
          </div>
        </div>

        {/* Quick Horizon Summary Stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="bg-surface-container p-3 rounded flex flex-col border border-surface-variant/20">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase">
              JARAK TERENDAH (MAX TMA)
            </span>
            <span className="font-mono text-base lg:text-lg font-bold text-error">
              {minJarak > 400 ? '> 400' : `${minJarak.toFixed(1)} cm`}
            </span>
            <span className="font-mono text-[10px] text-outline">
              Muka Air: {Math.max(0, 400 - minJarak).toFixed(1)} cm
            </span>
          </div>

          <div className="bg-surface-container p-3 rounded flex flex-col border border-surface-variant/20">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase">
              JARAK TERTINGGI (SURUT)
            </span>
            <span className="font-mono text-base lg:text-lg font-bold text-secondary">
              {maxJarak > 400 ? '> 400' : `${maxJarak.toFixed(1)} cm`}
            </span>
            <span className="font-mono text-[10px] text-outline">Kondisi Aman</span>
          </div>

          <div className="bg-surface-container p-3 rounded flex flex-col border border-surface-variant/20">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase">
              RATA-RATA HORIZON
            </span>
            <span className="font-mono text-base lg:text-lg font-bold text-on-surface">
              {avgJarak > 400 ? '> 400' : `${avgJarak.toFixed(1)} cm`}
            </span>
            <span className="font-mono text-[10px] text-primary">
              Total {displayPoints.length} Sampel
            </span>
          </div>
        </div>

        {/* Interactive SVG Telemetry Elevation Chart */}
        <div className="w-full bg-surface-container rounded-lg p-3 lg:p-4 relative overflow-hidden flex flex-col border border-surface-variant/30">
          {/* Legend Strip */}
          <div className="flex flex-wrap items-center justify-between font-mono text-[11px] mb-2 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-primary">
                <span className="w-3 h-0.5 bg-primary" /> Ultrasonic (cm)
              </span>
              <span className="flex items-center gap-1.5 text-primary-container">
                <span className="w-3 h-0.5 bg-primary-container border-t border-dashed" /> Waspada (200 cm)
              </span>
              <span className="flex items-center gap-1.5 text-error">
                <span className="w-3 h-0.5 bg-error border-t border-dashed" /> Bahaya (100 cm)
              </span>
            </div>
            <span className="text-secondary flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" /> Realtime Plot
            </span>
          </div>

          {/* SVG Canvas */}
          <div className="w-full h-56 relative">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="telemetryGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffb690" stopOpacity="0.35" />
                  <stop offset="60%" stopColor="#ffb690" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ffb690" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid horizontal reference lines */}
              <line x1={xStart} x2={xEnd} y1="20" y2="20" stroke="#2d3449" strokeDasharray="3,3" strokeWidth="0.8" />
              <line x1={xStart} x2={xEnd} y1="62.5" y2="62.5" stroke="#ff6a64" strokeDasharray="4,4" strokeWidth="1.2" opacity="0.75" />
              <line x1={xStart} x2={xEnd} y1="105" y2="105" stroke="#f97316" strokeDasharray="4,4" strokeWidth="1.2" opacity="0.8" />
              <line x1={xStart} x2={xEnd} y1="147.5" y2="147.5" stroke="#2d3449" strokeDasharray="3,3" strokeWidth="0.8" />
              <line x1={xStart} x2={xEnd} y1="190" y2="190" stroke="#2d3449" strokeDasharray="3,3" strokeWidth="0.8" />

              {/* Y Axis Labels */}
              <text x="8" y="24" fill="#a78b7d" fontFamily="JetBrains Mono" fontSize="10">0 cm</text>
              <text x="8" y="66" fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="10">100cm</text>
              <text x="8" y="109" fill="#f97316" fontFamily="JetBrains Mono" fontSize="10">200cm</text>
              <text x="8" y="151" fill="#a78b7d" fontFamily="JetBrains Mono" fontSize="10">300cm</text>
              <text x="8" y="193" fill="#a78b7d" fontFamily="JetBrains Mono" fontSize="10">400cm</text>

              {/* Polygon Area Fill */}
              {polygonPoints && (
                <polygon points={polygonPoints} fill="url(#telemetryGradient)" />
              )}

              {/* Polyline Curve */}
              {polylinePoints && (
                <polyline
                  points={polylinePoints}
                  fill="none"
                  stroke="#ffb690"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Points */}
              {pointCoords.map((pt, idx) => {
                const isHovered = hoveredPoint?.key === pt.item.key;
                const isCurrent = idx === pointCoords.length - 1;
                const dotColor =
                  pt.item.status === 'BAHAYA'
                    ? '#ff6a64'
                    : pt.item.status === 'WASPADA'
                    ? '#f97316'
                    : '#4edea3';

                return (
                  <circle
                    key={pt.item.key}
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : isCurrent ? 5 : 3.5}
                    fill={dotColor}
                    stroke="#0b1326"
                    strokeWidth={isHovered || isCurrent ? 2 : 1}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredPoint(pt.item)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}

              {/* Time X Axis Labels */}
              {pointCoords.length > 0 && (
                <>
                  <text
                    x={pointCoords[0].x}
                    y="212"
                    fill="#a78b7d"
                    fontFamily="JetBrains Mono"
                    fontSize="10"
                  >
                    {pointCoords[0].item.timeStr}
                  </text>
                  {pointCoords.length > 2 && (
                    <text
                      x={pointCoords[Math.floor(pointCoords.length / 2)].x - 20}
                      y="212"
                      fill="#a78b7d"
                      fontFamily="JetBrains Mono"
                      fontSize="10"
                    >
                      {pointCoords[Math.floor(pointCoords.length / 2)].item.timeStr}
                    </text>
                  )}
                  <text
                    x={pointCoords[pointCoords.length - 1].x - 30}
                    y="212"
                    fill="#4edea3"
                    fontFamily="JetBrains Mono"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {pointCoords[pointCoords.length - 1].item.timeStr}
                  </text>
                </>
              )}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div className="absolute top-2 right-2 bg-surface-container-high/95 backdrop-blur border border-surface-variant px-3 py-1.5 rounded shadow-lg pointer-events-none font-mono text-xs">
                <div className="text-primary font-bold">{hoveredPoint.key}</div>
                <div className="text-on-surface">Jarak: {hoveredPoint.distance} cm</div>
                <div className="text-on-surface-variant text-[10px]">
                  {hoveredPoint.timeStr} • {hoveredPoint.condition}
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-surface-variant/20 flex items-center justify-between font-mono text-[11px] text-outline">
            <span>* Jarak berbanding terbalik: Jarak mengecil = muka air naik ke ambang bahaya.</span>
            <span className="text-primary">Node Push: Active</span>
          </div>
        </div>
      </div>

      {/* Realtime River CCTV & DAS Radar Widgets */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative rounded-lg overflow-hidden bg-surface-container h-32 border border-surface-variant/30">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAdZ37GTTRsnnSe9AVamT-gj6XCdrd6tnTYejm-VmZbmbDasKV-ShqomqytaxQDT2Na9IFORZFXl_XrWI2TqctNucx4fvEB94TmP5u_yeEuqZzfWsy6EV6efArhVYGraouPm_jbtihafwQB31ndR2rEcDJOKG5YfRBQ0Q5RLF5RBSM9a3E2IFmkw7Ss4OClrsraFhRG0bYz2rYS3q11R-BGRkkWoTjaE90dMWAmwJg")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface/85 backdrop-blur font-mono text-[10px] text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <Video className="w-3 h-3 inline mr-1" /> CAM-01 CILIWUNG HILIR
          </div>
          <div className="absolute bottom-2 left-2 font-mono text-[10px] text-on-surface">
            IR Mode Active • Nilai Limpas: Normal
          </div>
        </div>

        <div className="relative rounded-lg overflow-hidden bg-surface-container h-32 border border-surface-variant/30">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBDzhNck-Iqk9WXd8fke1ye2ROqYW351UDH_3Y_Sxs5W_7GfyXW-3YDOuJiUjYEZcxdTHGnK9gChK3rknKi-7GlRSti2X60kGNVN95JyDSmiGwNAuRmPP2rDNa-aFJXOgQqBlCdnovFchiVKCQcbJu_Clv7mLI-YuSHoC1XtLf3iBzfpnfWwoGhWBZdD9aaaTB_3GLeJ8widLWnzppLbow6syr_uHxywAodEjQzgVM")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface/85 backdrop-blur font-mono text-[10px] text-primary">
            <Radar className="w-3 h-3 inline mr-1" /> RADAR DAS CILIWUNG
          </div>
          <div className="absolute bottom-2 left-2 font-mono text-[10px] text-on-surface">
            Aliran Hulu: 0.6 m/s (Katulampa Siaga 4)
          </div>
        </div>
      </div>
    </div>
  );
};

