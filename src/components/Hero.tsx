'use client';

import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Bobur Abdurasulov',
    title: 'Full-Stack Developer',
    bio: 'Crafting premium digital experiences with modern web technologies. Passionate about building scalable, performant, and beautiful applications.',
  });

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(d => { if (d?.name) setProfile(d); })
      .catch(() => {});

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, var(--text-muted) 0%, transparent 70%)',
          opacity: 0.03,
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className={`fade-up ${visible ? 'visible' : ''}`}>
          <p
            className="text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-6"
            style={{ color: 'var(--text-muted)' }}
          >
            <img src="/images/logo.png" alt="OASIS" className="h-10 md:h-14 w-auto mx-auto opacity-80" />
          </p>
        </div>

        <h1
          className={`fade-up ${visible ? 'visible' : ''} delay-1 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]`}
          style={{ letterSpacing: '-0.03em' }}
        >
          {profile.name}
        </h1>

        <div className={`fade-up ${visible ? 'visible' : ''} delay-2 mb-8`}>
          <span
            className="inline-block text-lg md:text-xl font-medium tracking-[0.15em] uppercase px-6 py-2 rounded-full"
            style={{
              border: '1px solid var(--border-color)',
              background: 'var(--glass-bg)',
              color: 'var(--text-secondary)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {profile.title}
          </span>
        </div>

        <p
          className={`fade-up ${visible ? 'visible' : ''} delay-3 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed`}
          style={{ color: 'var(--text-secondary)' }}
        >
          {profile.bio}
        </p>

        <div className={`fade-up ${visible ? 'visible' : ''} delay-4 flex flex-col sm:flex-row items-center justify-center gap-4`}>
          <a href="#projects" className="btn btn-primary text-base">
            View My Work
          </a>
          <a href="#contact" className="btn btn-outline text-base">
            Get In Touch
          </a>
        </div>
      </div>

      <div
        className={`fade-up ${visible ? 'visible' : ''} delay-5 absolute bottom-8 left-1/2 -translate-x-1/2`}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>
            Scroll
          </span>
          <div
            className="w-[1px] h-10"
            style={{
              background: 'linear-gradient(to bottom, var(--text-muted), transparent)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
