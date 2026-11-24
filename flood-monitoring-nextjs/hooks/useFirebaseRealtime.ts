'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FIREBASE_CONFIG, getFirebaseUrl, fetchFirebaseRoot } from '@/lib/firebase';
import { AlertLevel, SystemStats, TelemetryRecord } from '@/lib/types';
import { evaluateAlertStatus, formatTimeWIB, parseHistoryEntry } from '@/lib/utils';

export function useFirebaseRealtime() {
  const [history, setHistory] = useState<TelemetryRecord[]>([]);
  const [currentDistance, setCurrentDistance] = useState<number>(403.56);
  const [currentCondition, setCurrentCondition] = useState<string>('Di Luar Jangkauan');
  const [currentStatus, setCurrentStatus] = useState<AlertLevel>('DI LUAR JANGKAUAN');
  const [rawDb, setRawDb] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'STREAMING' | 'POLLING' | 'CONNECTING' | 'ERROR'>('CONNECTING');
  const [lastLatency, setLastLatency] = useState<number>(85);
  const [lastPingTime, setLastPingTime] = useState<string>('--:--:--');

  const eventSourceRef = useRef<EventSource | null>(null);
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const processData = useCallback((data: any, latency: number = 75) => {
    if (!data) return;
    setRawDb(data);
    setLastLatency(latency);
    setLastPingTime(formatTimeWIB(new Date()));

    // 1. Process sensor_jarak
    if (data.sensor_jarak) {
      const val = Number(data.sensor_jarak.value ?? data.sensor_jarak.jarak ?? 0);
      const cond = String(data.sensor_jarak.condition ?? data.sensor_jarak.kondisi ?? 'Aman');
      setCurrentDistance(Number(val.toFixed(2)));
      setCurrentCondition(cond);
      setCurrentStatus(evaluateAlertStatus(val, cond));
    }

    // 2. Process historyDataJarak
    if (data.historyDataJarak && typeof data.historyDataJarak === 'object') {
      const entries: TelemetryRecord[] = Object.entries(data.historyDataJarak).map(([key, val]) =>
        parseHistoryEntry(key, val)
      );

      // Sort chronological descending (latest first)
      entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setHistory(entries);

      // If sensor_jarak wasn't explicitly populated or has default values, we can also sync from latest history
      if (!data.sensor_jarak && entries.length > 0) {
        const latest = entries[0];
        setCurrentDistance(latest.distance);
        setCurrentCondition(latest.condition);
        setCurrentStatus(latest.status);
      }
    }
  }, []);

  const manualRefresh = useCallback(async () => {
    try {
      const { data, latency } = await fetchFirebaseRoot();
      processData(data, latency);
      setError(null);
    } catch (err: any) {
      console.warn('Manual refresh failed:', err);
      setError(err.message || 'Gagal menyinkronkan data.');
    }
  }, [processData]);

  useEffect(() => {
    let isMounted = true;

    // Initial manual fetch first to get data instantly
    fetchFirebaseRoot()
      .then(({ data, latency }) => {
        if (!isMounted) return;
        processData(data, latency);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Initial fetch error:', err);
        setError(err.message);
        setLoading(false);
      });

    // Attempt EventSource SSE for Realtime Streaming
    try {
      const sseUrl = getFirebaseUrl('');
      const es = new EventSource(sseUrl);
      eventSourceRef.current = es;

      es.addEventListener('put', (event: MessageEvent) => {
        if (!isMounted) return;
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && parsed.data) {
            processData(parsed.data, 45);
            setConnectionStatus('STREAMING');
            setError(null);
          }
        } catch (e) {
          console.debug('SSE parse put event:', e);
        }
      });

      es.addEventListener('patch', (event: MessageEvent) => {
        if (!isMounted) return;
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && parsed.data) {
            // Re-fetch clean state
            manualRefresh();
            setConnectionStatus('STREAMING');
          }
        } catch (e) {
          console.debug('SSE parse patch event:', e);
        }
      });

      es.onopen = () => {
        if (!isMounted) return;
        setConnectionStatus('STREAMING');
        setError(null);
      };

      es.onerror = () => {
        if (!isMounted) return;
        // Firebase SSE may disconnect or reject CORS in some browser environments
        setConnectionStatus('POLLING');
        es.close();
      };
    } catch (e) {
      setConnectionStatus('POLLING');
    }

    // Polling backup every 2500ms to guarantee persistent updates
    pollingTimerRef.current = setInterval(() => {
      manualRefresh();
    }, 2500);

    return () => {
      isMounted = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, [manualRefresh, processData]);

  // Derived statistics
  const validDistances = history.map((h) => h.distance).filter((d) => d > 0 && d <= 500);
  const minDistance = validDistances.length ? Math.min(...validDistances) : currentDistance;
  const maxDistance = validDistances.length ? Math.max(...validDistances) : currentDistance;
  const avgDistance = validDistances.length
    ? Number((validDistances.reduce((a, b) => a + b, 0) / validDistances.length).toFixed(2))
    : currentDistance;

  // Water level: 400 - distance (or 0 if out of range)
  const currentWaterLevel =
    currentDistance > 400 ? 0 : Math.max(0, Number((400 - currentDistance).toFixed(2)));

  // Simulated hydrological values that scale sensibly with current water level
  const flowRate = currentWaterLevel > 0 ? Number((0.5 + currentWaterLevel * 0.015).toFixed(2)) : 0.0;
  const delta1Hour = history.length >= 2 ? Number((history[0].distance - history[history.length - 1].distance).toFixed(2)) : 0.0;

  const stats: SystemStats = {
    currentDistance,
    currentCondition,
    currentStatus,
    currentWaterLevel,
    minDistance,
    maxDistance,
    avgDistance,
    flowRate,
    rainfall: currentWaterLevel > 150 ? 12.5 : 0.0,
    delta1Hour,
    batteryLevel: 98,
    batteryVoltage: 13.9,
    signalRssi: -74,
    connectionStatus,
    lastPingTime,
    lastLatencyMs: lastLatency,
  };

  return {
    history,
    stats,
    rawDb,
    loading,
    error,
    manualRefresh,
  };
}

