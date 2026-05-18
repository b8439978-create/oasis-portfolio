import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'OASIS — Full-Stack Developer Portfolio',
  description:
    'Premium full-stack developer portfolio. Crafting modern digital experiences with cutting-edge technology.',
  keywords: [
    'OASIS',
    'full-stack developer',
    'portfolio',
    'React',
    'Next.js',
    'Three.js',
    'web development',
  ],
  openGraph: {
    title: 'OASIS — Full-Stack Developer Portfolio',
    description:
      'Premium full-stack developer portfolio. Crafting modern digital experiences.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>O</text></svg>" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>O</text></svg>" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
