import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HYDRO-EWS • Sistem Monitoring Banjir Telemetri Ultrasonic',
  description: 'Website Monitoring Banjir Realtime berbasis IoT Ultrasonic & Firebase Realtime Database.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-surface text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
        {children}
      </body>
    </html>
  );
}

