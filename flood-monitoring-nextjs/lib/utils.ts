import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertLevel, TelemetryRecord } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

/**
 * Decodes the exact milliseconds timestamp from a Firebase Push ID (e.g. -P65Ghy_Z0-YND8kwOdC)
 */
export function decodePushIdTimestamp(id: string): Date {
  if (!id || typeof id !== 'string' || id.length < 8) {
    return new Date();
  }
  let time = 0;
  for (let i = 0; i < 8; i++) {
    const c = id.charAt(i);
    const val = PUSH_CHARS.indexOf(c);
    if (val === -1) return new Date();
    time = time * 64 + val;
  }
  const date = new Date(time);
  if (isNaN(date.getTime()) || time < 1577836800000 || time > 2000000000000) {
    return new Date();
  }
  return date;
}

/**
 * Evaluates water alert status based on distance and condition
 */
export function evaluateAlertStatus(distance: number, conditionText?: string): AlertLevel {
  const cond = (conditionText || '').toLowerCase().trim();
  if (cond.includes('luar jangkauan') || cond.includes('out of range') || distance > 400 || distance <= 0) {
    return 'DI LUAR JANGKAUAN';
  }
  if (cond.includes('bahaya') || distance < 100) {
    return 'BAHAYA';
  }
  if (cond.includes('waspada') || (distance >= 100 && distance <= 200)) {
    return 'WASPADA';
  }
  return 'AMAN';
}

/**
 * Formats a Date object into WIB Indonesian locale
 */
export function formatTimeWIB(date: Date): string {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function formatDateWIB(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Parses raw history data item from Firebase RTDB
 */
export function parseHistoryEntry(key: string, rawVal: any): TelemetryRecord {
  let distance = 0;
  let condition = '';

  if (typeof rawVal === 'number') {
    distance = rawVal;
  } else if (typeof rawVal === 'string') {
    const parsed = parseFloat(rawVal);
    if (!isNaN(parsed)) {
      distance = parsed;
    } else {
      condition = rawVal;
    }
  } else if (typeof rawVal === 'object' && rawVal !== null) {
    distance = Number(rawVal.value ?? rawVal.jarak ?? rawVal.distance ?? rawVal.data ?? 0);
    condition = String(rawVal.condition ?? rawVal.kondisi ?? rawVal.status ?? '');
  }

  const timestamp = decodePushIdTimestamp(key);
  const status = evaluateAlertStatus(distance, condition);
  if (!condition) {
    condition = status === 'DI LUAR JANGKAUAN' ? 'Di Luar Jangkauan' : status === 'BAHAYA' ? 'Bahaya' : status === 'WASPADA' ? 'Waspada' : 'Aman';
  }

  // Baseline sensor height is 400cm
  const waterLevel = distance > 400 ? 0 : Math.max(0, 400 - distance);

  return {
    key,
    timestamp,
    timeStr: formatTimeWIB(timestamp),
    dateStr: formatDateWIB(timestamp),
    isoStr: timestamp.toISOString(),
    distance: Number(distance.toFixed(2)),
    condition,
    status,
    waterLevel: Number(waterLevel.toFixed(2)),
    raw: rawVal,
  };
}

