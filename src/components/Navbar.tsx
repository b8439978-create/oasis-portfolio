'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/lib/ThemeContext';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = navLinks.map(l => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'navbar-glass' : 'bg-transparent'
      }`}
      style={{
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}
          className="text-xl md:text-2xl font-bold tracking-tight nav-bubble"
          style={{ letterSpacing: '-0.03em' }}
        >
          OASIS
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className={`nav-bubble px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeSection === link.href.slice(1)
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            data-theme={theme}
            aria-label="Toggle theme"
          >
            <div className="theme-toggle-knob">
              {theme === 'dark' ? '\u263E' : '\u2600'}
            </div>
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-8 h-8 flex items-center justify-center nav-bubble"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-[1.5px] bg-[var(--text-primary)] absolute transition-all duration-300 ${
                mobileOpen ? 'rotate-45' : '-translate-y-1.5'
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-[var(--text-primary)] absolute transition-all duration-300 ${
                mobileOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-[var(--text-primary)] absolute transition-all duration-300 ${
                mobileOpen ? '-rotate-45' : 'translate-y-1.5'
              }`}
            />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 z-40"
          style={{
            background: 'var(--nav-blur)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          <div className="flex flex-col items-center gap-2 pt-8 px-6">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-2xl font-medium py-3 transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                style={{ animation: `fadeInDown 0.3s ${i * 0.05}s both` }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}
