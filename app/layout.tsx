import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OmniMesh Capital | Autonomous Edge-First Liquidity Engine',
  description: 'Deterministic Cryptographic Liquidity Gatekeeper & ZK-Solvency Protocol for SMEs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200 min-h-screen">
        {children}
      </body>
    </html>
  );
}
