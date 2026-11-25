export const FIREBASE_CONFIG = {
  host: process.env.NEXT_PUBLIC_FIREBASE_HOST ?? 'https://project-despro-2-default-rtdb.asia-southeast1.firebasedatabase.app/',
  auth: process.env.NEXT_PUBLIC_FIREBASE_AUTH ?? 'stZoWOUZBi8XcGGwSW2HfY6KYxPGWAy7iqrHHLkr',
};

export function getFirebaseUrl(path: string = ''): string {
  const cleanPath = path.replace(/^\/+/, '');
  const base = FIREBASE_CONFIG.host.endsWith('/') ? FIREBASE_CONFIG.host : `${FIREBASE_CONFIG.host}/`;
  return `${base}${cleanPath}.json?auth=${FIREBASE_CONFIG.auth}`;
}

export async function fetchFirebaseRoot(): Promise<any> {
  const startTime = performance.now();
  const url = getFirebaseUrl('');
  const res = await fetch(url, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Firebase RTDB Error ${res.status}: ${res.statusText}`);
  }
  const data = await res.json();
  const latency = Math.round(performance.now() - startTime);
  return { data, latency };
}

