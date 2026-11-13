import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'PingME Lifeline — A QR that speaks for you when you can\'t',
  description: 'Emergency lifeline card powered by PingME QR tags. Instant medical data, 108 calling, and live family GPS alerts without exposing phone numbers.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ef4444',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
