'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';

const ParticleBackground = dynamic(
  () => import('@/components/ParticleBackground'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </div>
    </div>
  );
}
