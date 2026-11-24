export interface FirebaseSensorJarak {
  condition: string;
  value: number;
}

export type AlertLevel = 'AMAN' | 'WASPADA' | 'BAHAYA' | 'DI LUAR JANGKAUAN';

export interface TelemetryRecord {
  key: string;
  timestamp: Date;
  timeStr: string;
  dateStr: string;
  isoStr: string;
  distance: number;
  condition: string;
  status: AlertLevel;
  waterLevel: number; // calculated: Math.max(0, 400 - distance)
  raw: any;
}

export interface SystemStats {
  currentDistance: number;
  currentCondition: string;
  currentStatus: AlertLevel;
  currentWaterLevel: number;
  minDistance: number;
  maxDistance: number;
  avgDistance: number;
  flowRate: number; // m3/s estimation
  rainfall: number; // mm/h
  delta1Hour: number; // cm
  batteryLevel: number; // %
  batteryVoltage: number; // V
  signalRssi: number; // dBm
  connectionStatus: 'CONNECTED' | 'STREAMING' | 'POLLING' | 'CONNECTING' | 'ERROR';
  lastPingTime: string;
  lastLatencyMs: number;
}

