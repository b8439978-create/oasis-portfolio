'use client';

import { useEffect, useRef, useState } from 'react';

const defaultExperience = [
  {
    role: 'Senior Full-Stack Developer',
    company: 'Tech Corp',
    period: '2023 - Present',
    description: 'Leading development of scalable web applications serving millions of users.',
  },
  {
    role: 'Full-Stack Developer',
    company: 'Digital Agency',
    period: '2021 - 2023',
    description: 'Built premium websites and admin panels for Fortune 500 clients.',
  },
  {
    role: 'Frontend Developer',
    company: 'StartupXYZ',
    period: '2019 - 2021',
    description: 'Developed React-based SaaS platform with real-time collaboration features.',
  },
];

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [exp, setExp] = useState(defaultExperience);

  useEffect(() => {
    fetch('/api/experience')
      .then(r => r.json())
      .then(d => { if (d?.length) setExp(d); })
      .catch(() => {});

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" ref={ref} className="section-padding">
      <div className="container-premium">
        <div className={`fade-up ${visible ? 'visible' : ''} text-center mb-16`}>
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
            &mdash; Experience &mdash;
          </p>
          <h2 className="section-title">Where I&apos;ve Worked</h2>
          <p className="section-subtitle mx-auto">
            My professional journey building products and leading teams.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {exp.map((item, i) => (
            <div
              key={i}
              className={`fade-up ${visible ? 'visible' : ''} delay-${Math.min(i + 1, 6)} relative pl-8 pb-12 last:pb-0`}
            >
              <div className="timeline-line" />
              <div className="timeline-dot" style={{ top: '6px' }} />
              <div>
                <div
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2"
                >
                  <h3 className="text-lg font-bold">{item.role}</h3>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    &mdash; {item.company}
                  </span>
                </div>
                <p
                  className="text-xs font-medium tracking-wider uppercase mb-3"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {item.period}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
