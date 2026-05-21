'use client';

import { useEffect, useRef, useState } from 'react';

const defaultProjects: any[] = []

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
                {project.image ? (
                  <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                  }} />
                )}
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
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline text-xs !py-2 !px-5"
                    >
                      {project.githubUrl.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i) ? 'View Image' : 'Download File'}
                    </a>
                  )}
                </div>

                {project.files && project.files.length > 0 && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <p className="text-xs font-medium tracking-wider uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Attachments</p>
                    <div className="flex flex-wrap gap-2">
                      {project.files.map((f: any, fi: number) => (
                        <a
                          key={fi}
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors hover:opacity-70"
                          style={{ border: '1px solid var(--border-color)', background: 'var(--glass-bg)', color: 'var(--text-secondary)' }}
                        >
                          {f.is_image ? (
                            <img src={f.url} alt="" style={{ width: 14, height: 14, objectFit: 'cover', borderRadius: 2 }} />
                          ) : (
                            <span style={{ fontSize: 12 }}>&#x1F4CE;</span>
                          )}
                          <span>{f.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
