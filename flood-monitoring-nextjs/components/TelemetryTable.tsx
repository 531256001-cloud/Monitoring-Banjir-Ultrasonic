'use client';

import React, { useState, useMemo } from 'react';
import { Table, Search, Download, Copy, Code, Check } from 'lucide-react';
import { TelemetryRecord } from '@/lib/types';
import { FIREBASE_CONFIG } from '@/lib/firebase';

interface TelemetryTableProps {
  history: TelemetryRecord[];
  onToggleRawJson: () => void;
  isRawJsonOpen: boolean;
}

export const TelemetryTable: React.FC<TelemetryTableProps> = ({
  history,
  onToggleRawJson,
  isRawJsonOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [copied, setCopied] = useState<boolean>(false);

  // Filter rows
  const filteredRows = useMemo(() => {
    return history.filter((item) => {
      const matchSearch =
        item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.timeStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dateStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.distance.toString().includes(searchTerm);

      const matchStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'AMAN'
          ? item.status === 'AMAN'
          : statusFilter === 'WASPADA'
          ? item.status === 'WASPADA'
          : statusFilter === 'BAHAYA'
          ? item.status === 'BAHAYA'
          : statusFilter === 'DI_LUAR'
          ? item.status === 'DI LUAR JANGKAUAN'
          : true;

      return matchSearch && matchStatus;
    });
  }, [history, searchTerm, statusFilter]);

  // Copy Firebase Endpoint
  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(FIREBASE_CONFIG.host);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ['PushKey', 'Timestamp_ISO', 'Waktu_WIB', 'Tanggal_WIB', 'Jarak_cm', 'Kondisi', 'Status_EWS'];
    const rows = history.map((item) => [
      item.key,
      item.isoStr,
      item.timeStr,
      item.dateStr,
      item.distance,
      `"${item.condition}"`,
      item.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `telemetri_banjir_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-5 lg:p-6 shadow-xl flex flex-col justify-between border border-surface-variant/30">
      <div>
        {/* Table Header & Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-variant/30">
          <div>
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-secondary" />
              <h2 className="font-headline text-lg lg:text-xl font-bold text-on-surface">
                Table History Data
              </h2>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">
              Mapping Push Keys: <code className="text-primary font-mono">-P65...</code> (RTDB)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEndpoint}
              title="Salin URL Firebase RTDB"
              className="p-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-surface-variant/30 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-secondary" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleExportCSV}
              title="Ekspor CSV Telemetri"
              className="px-3 py-1.5 rounded bg-surface-container-high text-on-surface hover:bg-surface-bright font-mono text-xs flex items-center gap-1.5 border border-surface-variant/40 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-4 mb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-outline" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari Push Key RTDB / Waktu..."
              className="w-full bg-surface-container text-on-surface placeholder:text-outline font-mono text-xs pl-8 pr-3 py-2 rounded outline-none focus:ring-1 focus:ring-primary border border-surface-variant/30"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container text-on-surface font-mono text-xs px-2.5 py-2 rounded outline-none border border-surface-variant/30 cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="AMAN">Aman</option>
            <option value="WASPADA">Waspada</option>
            <option value="BAHAYA">Bahaya</option>
            <option value="DI_LUAR">Di Luar Jangkauan</option>
          </select>
        </div>

        {/* High-Density Telemetry Table */}
        <div className="w-full overflow-x-auto rounded bg-surface-container-lowest border border-surface-variant/30 max-h-[380px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-surface-container font-mono text-[11px] text-outline border-b border-surface-variant/30">
                <th className="py-2.5 px-3 font-normal">FIREBASE KEY / TIMESTAMP</th>
                <th className="py-2.5 px-3 font-normal text-right">JARAK SENSOR</th>
                <th className="py-2.5 px-3 font-normal text-center">KONDISI</th>
                <th className="py-2.5 px-3 font-normal text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/10 font-mono text-xs">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-on-surface-variant font-mono">
                    Tidak ada data yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, index) => {
                  const isBahaya = row.status === 'BAHAYA';
                  const isWaspada = row.status === 'WASPADA';
                  const isOutOfRange = row.status === 'DI LUAR JANGKAUAN';

                  return (
                    <tr
                      key={row.key}
                      className={`hover:bg-surface-container transition-colors group ${
                        index % 2 === 1 ? 'bg-surface-container/20' : ''
                      }`}
                    >
                      {/* Push Key & Decoded Timestamp */}
                      <td className="py-2.5 px-3">
                        <div className="flex flex-col">
                          <span
                            className="text-primary font-bold tracking-tight truncate max-w-[140px] group-hover:text-primary-fixed"
                            title={row.key}
                          >
                            {row.key}
                          </span>
                          <span className="text-outline text-[10px]">
                            {row.dateStr} • {row.timeStr} WIB
                          </span>
                        </div>
                      </td>

                      {/* Distance */}
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-bold text-on-surface">
                          {row.distance > 400 ? '> 400' : row.distance.toFixed(2)}
                        </span>
                        <span className="text-outline text-[11px] ml-1">cm</span>
                      </td>

                      {/* Condition Chip */}
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            isBahaya
                              ? 'bg-[#7F1D1D] text-[#F87171]'
                              : isWaspada
                              ? 'bg-[#7C2D12] text-[#FB923C]'
                              : isOutOfRange
                              ? 'bg-surface-container-high text-on-surface-variant'
                              : 'bg-[#064E3B] text-[#34D399]'
                          }`}
                        >
                          {row.condition}
                        </span>
                      </td>

                      {/* Status indicator */}
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`text-xs font-mono flex items-center justify-end gap-1 ${
                            isBahaya
                              ? 'text-error font-bold'
                              : isWaspada
                              ? 'text-primary-container font-bold'
                              : isOutOfRange
                              ? 'text-outline'
                              : 'text-secondary'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isBahaya
                                ? 'bg-error animate-pulse'
                                : isWaspada
                                ? 'bg-primary-container'
                                : isOutOfRange
                                ? 'bg-outline'
                                : 'bg-secondary'
                            }`}
                          />
                          {isBahaya
                            ? 'ALERT'
                            : isWaspada
                            ? 'WASPADA'
                            : isOutOfRange
                            ? 'RANGE'
                            : 'OK'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Footer & Raw JSON Toggle */}
      <div className="mt-4 pt-3 border-t border-surface-variant/20 flex flex-col gap-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-outline">
            Total Entri RTDB: {history.length} push events
          </span>
          <button
            onClick={onToggleRawJson}
            className="text-primary hover:underline flex items-center gap-1"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{isRawJsonOpen ? 'Tutup Raw JSON RTDB' : 'Buka Raw JSON RTDB'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

