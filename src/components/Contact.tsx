'use client';

import { useEffect, useRef, useState } from 'react';

const socialLinks = [
  {
    label: 'Email',
    href: 'mailto:hello@oasis.dev',
    icon: '\u2709',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/bobur',
    icon: '\u2B24',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/bobur',
    icon: '\u2B23',
  },
  {
    label: 'Telegram',
    href: 'https://t.me/Bobur_abdurasulov',
    icon: '\u2712',
  },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" ref={ref} className="section-padding">
      <div className="container-premium">
        <div className={`fade-up ${visible ? 'visible' : ''} text-center mb-16`}>
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
            &mdash; Contact &mdash;
          </p>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle mx-auto">
            I&apos;m always open to new opportunities and collaborations.
          </p>
        </div>

        <div className={`fade-up ${visible ? 'visible' : ''} delay-2 flex items-center justify-center gap-4 sm:gap-6`}>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-bubble liquid-bubble group"
              aria-label={link.label}
            >
              <span className="text-lg">{link.icon}</span>
            </a>
          ))}
        </div>

        <div className={`fade-up ${visible ? 'visible' : ''} delay-3 text-center mt-12`}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} OASIS. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
