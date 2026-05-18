'use client';

import { ThemeProvider } from '@/lib/ThemeContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
