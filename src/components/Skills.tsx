'use client';

import { useEffect, useRef, useState } from 'react';

const defaultSkills = [
  { name: 'Python', icon: 'py' },
  { name: 'JavaScript', icon: 'js' },
  { name: 'React', icon: 'react' },
  { name: 'Three.js', icon: 'three' },
  { name: 'Node.js', icon: 'node' },
  { name: 'Full-stack', icon: 'stack' },
  { name: 'Admin Panel', icon: 'admin' },
];

const iconMap: Record<string, string> = {
  py: '\u2328',
  js: '{ }',
  react: '\u269B',
  three: '\u25B2',
  node: '\u26A1',
  stack: '\u2B1C',
  admin: '\u2699',
};

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [skills, setSkills] = useState(defaultSkills);

  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(d => { if (d?.length) setSkills(d); })
      .catch(() => {});

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" ref={ref} className="section-padding">
      <div className="container-premium">
        <div className={`fade-up ${visible ? 'visible' : ''} text-center mb-16`}>
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
            &mdash; Skills & Expertise &mdash;
          </p>
          <h2 className="section-title">Technologies I Work With</h2>
          <p className="section-subtitle mx-auto">
            A curated set of tools and technologies I use to bring ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {skills.map((skill, i) => (
            <div
              key={skill.name}
              className={`fade-up ${visible ? 'visible' : ''} delay-${Math.min(i + 1, 6)} flex flex-col items-center text-center`}
            >
              <div className="skill-icon liquid-bubble">
                <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                  {iconMap[skill.icon] || '\u2B50'}
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {skill.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
