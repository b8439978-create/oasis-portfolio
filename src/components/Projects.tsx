'use client';

import { useEffect, useRef, useState } from 'react';

const defaultProjects = [
  {
    id: 1,
    title: 'Neon Dashboard',
    description: 'Real-time analytics platform with AI-powered insights and stunning data visualization.',
    tech: ['React', 'Python', 'AI'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
  },
  {
    id: 2,
    title: 'Stream Verse',
    description: 'Cinematic streaming platform with immersive 3D interactions and adaptive streaming.',
    tech: ['Next.js', 'Three.js', 'FastAPI'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
  },
  {
    id: 3,
    title: 'Crypto Vault',
    description: 'Secure cryptocurrency wallet with biometric authentication and real-time market data.',
    tech: ['React Native', 'Node.js', 'Web3'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
  },
  {
    id: 4,
    title: 'AI Assistant',
    description: 'Intelligent automation platform with natural language processing and workflow automation.',
    tech: ['Python', 'AI', 'FastAPI'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
  },
];

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [projects, setProjects] = useState(defaultProjects);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(d => { if (d?.length) setProjects(d); })
      .catch(() => {});

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={ref} className="section-padding">
      <div className="container-premium">
        <div className={`fade-up ${visible ? 'visible' : ''} text-center mb-16`}>
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
            &mdash; Projects &mdash;
          </p>
          <h2 className="section-title">Featured Work</h2>
          <p className="section-subtitle mx-auto">
            A selection of projects that showcase my skills and passion for building great products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`fade-up ${visible ? 'visible' : ''} delay-${Math.min(i + 1, 6)} glass-card rounded-2xl overflow-hidden`}
            >
              <div
                className="h-48 sm:h-56 flex items-center justify-center relative overflow-hidden"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `
                      linear-gradient(var(--text-primary) 1px, transparent 1px),
                      linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                  }}
                />
                <div className="text-center relative z-10">
                  <p className="text-sm font-medium tracking-[0.15em] uppercase" style={{ color: 'var(--text-muted)' }}>
                    {project.date || `Project #${project.id}`}
                  </p>
                  <p className="text-lg font-bold tracking-tight mt-2" style={{ color: 'var(--text-secondary)' }}>
                    {project.title}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-bold mb-3 tracking-tight">{project.title}</h3>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        border: '1px solid var(--border-color)',
                        background: 'var(--glass-bg)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary text-xs !py-2 !px-5"
                  >
                    Live Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline text-xs !py-2 !px-5"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
