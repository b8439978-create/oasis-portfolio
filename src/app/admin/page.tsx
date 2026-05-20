'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Tab = 'profile' | 'skills' | 'projects' | 'experience';

const API = '';

function useAuth() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('oasis-admin-token') : null;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const logout = () => {
    localStorage.removeItem('oasis-admin-token');
    router.push('/admin/login');
  };

  return { token, headers, logout };
}

export default function AdminDashboard() {
  const { token, headers, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<any>({});
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch(`${API}/api/profile`).then(r => r.json()),
      fetch(`${API}/api/skills`).then(r => r.json()),
      fetch(`${API}/api/projects`).then(r => r.json()),
      fetch(`${API}/api/experience`).then(r => r.json()),
    ]).then(([p, s, pr, e]) => {
      setProfile(p);
      setSkills(s);
      setProjects(pr);
      setExperience(e);
      setLoading(false);
    });
  }, [token]);

  if (!token) return null;

  const showMsg = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(''), 2000);
  };

  const saveProfile = async () => {
    setSaving(true);
    await fetch(`${API}/api/admin/profile`, { method: 'PUT', headers, body: JSON.stringify(profile) });
    setSaving(false);
    showMsg('Profile saved!');
  };

  const addSkill = () => {
    setSkills([...skills, { name: '', icon: '', date: '' }]);
  };

  const updateSkill = (i: number, field: string, value: string) => {
    const s = [...skills];
    s[i] = { ...s[i], [field]: value };
    setSkills(s);
  };

  const removeSkill = (i: number) => {
    setSkills(skills.filter((_, idx) => idx !== i));
  };

  const saveSkills = async () => {
    setSaving(true);
    await fetch(`${API}/api/admin/skills`, { method: 'PUT', headers, body: JSON.stringify({ skills }) });
    setSaving(false);
    showMsg('Skills saved!');
  };

  const addProject = () => {
    setProjects([...projects, { id: Date.now(), title: '', description: '', tech: [], liveUrl: '', githubUrl: '', date: '', _new: true }]);
  };

  const updateProject = (i: number, field: string, value: any) => {
    const p = [...projects];
    p[i] = { ...p[i], [field]: value };
    setProjects(p);
  };

  const saveProject = async (i: number) => {
    const p = projects[i];
    setSaving(true);
    if (p._new) {
      const res = await fetch(`${API}/api/admin/projects`, { method: 'POST', headers, body: JSON.stringify({ title: p.title, description: p.description, tech: p.tech, liveUrl: p.liveUrl, githubUrl: p.githubUrl, date: p.date }) });
      const data = await res.json();
      if (data.ok) {
        const updated = [...projects];
        updated[i] = { ...data.data, _new: undefined };
        setProjects(updated);
      }
    } else {
      await fetch(`${API}/api/admin/projects/${p.id}`, { method: 'PUT', headers, body: JSON.stringify({ title: p.title, description: p.description, tech: p.tech, liveUrl: p.liveUrl, githubUrl: p.githubUrl, date: p.date }) });
    }
    setSaving(false);
    showMsg('Project saved!');
  };

  const deleteProject = async (i: number) => {
    const p = projects[i];
    if (p._new) {
      setProjects(projects.filter((_, idx) => idx !== i));
      return;
    }
    setSaving(true);
    await fetch(`${API}/api/admin/projects/${p.id}`, { method: 'DELETE', headers });
    setProjects(projects.filter((_, idx) => idx !== i));
    setSaving(false);
    showMsg('Project deleted!');
  };

  const addExperience = () => {
    setExperience([...experience, { role: '', company: '', period: '', description: '', date: '' }]);
  };

  const updateExp = (i: number, field: string, value: string) => {
    const e = [...experience];
    e[i] = { ...e[i], [field]: value };
    setExperience(e);
  };

  const saveExperience = async (i: number) => {
    setSaving(true);
    const e = experience[i];
    if (i >= 3) {
      await fetch(`${API}/api/admin/experience`, { method: 'POST', headers, body: JSON.stringify(e) });
    } else {
      await fetch(`${API}/api/admin/experience/${i}`, { method: 'PUT', headers, body: JSON.stringify(e) });
    }
    setSaving(false);
    showMsg('Experience saved!');
  };

  const deleteExperience = async (i: number) => {
    setSaving(true);
    if (i >= 3) {
      await fetch(`${API}/api/admin/experience/${i}`, { method: 'DELETE', headers });
    }
    setExperience(experience.filter((_, idx) => idx !== i));
    setSaving(false);
    showMsg('Experience deleted!');
  };

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    background: tab === t ? 'var(--text-primary)' : 'transparent',
    color: tab === t ? 'var(--bg-primary)' : 'var(--text-muted)',
    transition: 'all 0.2s',
  });

  const cardStyle: React.CSSProperties = {
    padding: 24,
    borderRadius: 12,
    border: '1px solid var(--border-color)',
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(20px)',
    marginBottom: 16,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: 13,
    outline: 'none',
  };

  const btnStyle = (primary = true): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
    background: primary ? 'var(--text-primary)' : 'transparent',
    color: primary ? 'var(--bg-primary)' : 'var(--text-muted)',
    border: primary ? 'none' : '1px solid var(--border-color)',
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>OASIS Admin</h1>
        <button onClick={logout} style={{ ...btnStyle(false), fontSize: 13 }}>Logout</button>
      </div>

      {msg && (
        <div style={{ padding: '8px 24px', background: '#22c55e', color: '#fff', fontSize: 13, textAlign: 'center' }}>
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
        {(['profile', 'skills', 'projects', 'experience'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={tabStyle(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
        {/* PROFILE */}
        {tab === 'profile' && (
          <div style={cardStyle}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Profile</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['name', 'title', 'bio', 'email', 'github', 'linkedin', 'telegram'].map(f => (
                <div key={f}>
                  <label style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>{f}</label>
                  {f === 'bio' ? (
                    <textarea rows={3} value={profile[f] || ''} onChange={e => setProfile({...profile, [f]: e.target.value})} style={inputStyle} />
                  ) : (
                    <input value={profile[f] || ''} onChange={e => setProfile({...profile, [f]: e.target.value})} style={inputStyle} />
                  )}
                </div>
              ))}
              <div style={{ marginTop: 8 }}>
                <button onClick={saveProfile} style={btnStyle(true)} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
              </div>
            </div>
          </div>
        )}

        {/* SKILLS */}
        {tab === 'skills' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>Skills</h2>
              <button onClick={addSkill} style={btnStyle(false)}>+ Add Skill</button>
            </div>
            {skills.map((skill, i) => (
              <div key={i} style={{ ...cardStyle, display: 'flex', gap: 12, alignItems: 'center' }}>
                <input value={skill.name} onChange={e => updateSkill(i, 'name', e.target.value)} placeholder="Skill name" style={{ ...inputStyle, flex: 1 }} />
                <input value={skill.icon} onChange={e => updateSkill(i, 'icon', e.target.value)} placeholder="Icon key" style={{ ...inputStyle, width: 80 }} />
                <input value={skill.date || ''} onChange={e => updateSkill(i, 'date', e.target.value)} placeholder="Date" style={{ ...inputStyle, width: 100 }} />
                <button onClick={() => removeSkill(i)} style={{ ...btnStyle(false), color: '#ef4444', borderColor: '#ef4444' }}>X</button>
              </div>
            ))}
            {skills.length > 0 && (
              <button onClick={saveSkills} style={btnStyle(true)} disabled={saving}>{saving ? 'Saving...' : 'Save Skills'}</button>
            )}
          </div>
        )}

        {/* PROJECTS */}
        {tab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>Projects</h2>
              <button onClick={addProject} style={btnStyle(false)}>+ Add Project</button>
            </div>
            {projects.map((project, i) => (
              <div key={project.id || i} style={cardStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input value={project.title} onChange={e => updateProject(i, 'title', e.target.value)} placeholder="Project title" style={inputStyle} />
                  <textarea rows={2} value={project.description} onChange={e => updateProject(i, 'description', e.target.value)} placeholder="Description" style={inputStyle} />
                  <input value={project.tech?.join(', ') || ''} onChange={e => updateProject(i, 'tech', e.target.value.split(',').map((t: string) => t.trim()))} placeholder="Tech (comma separated)" style={inputStyle} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input value={project.liveUrl} onChange={e => updateProject(i, 'liveUrl', e.target.value)} placeholder="Live URL" style={{ ...inputStyle, flex: 1 }} />
                    <input value={project.githubUrl} onChange={e => updateProject(i, 'githubUrl', e.target.value)} placeholder="GitHub URL" style={{ ...inputStyle, flex: 1 }} />
                  </div>
                  <input value={project.date || ''} onChange={e => updateProject(i, 'date', e.target.value)} placeholder="Date (e.g. 2024, March 2024)" style={inputStyle} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => saveProject(i)} style={btnStyle(true)} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                    <button onClick={() => deleteProject(i)} style={{ ...btnStyle(false), color: '#ef4444', borderColor: '#ef4444' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EXPERIENCE */}
        {tab === 'experience' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>Experience</h2>
              <button onClick={addExperience} style={btnStyle(false)}>+ Add Experience</button>
            </div>
            {experience.map((exp, i) => (
              <div key={i} style={cardStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input value={exp.role} onChange={e => updateExp(i, 'role', e.target.value)} placeholder="Role" style={inputStyle} />
                  <input value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} placeholder="Company" style={inputStyle} />
                  <input value={exp.period} onChange={e => updateExp(i, 'period', e.target.value)} placeholder="Period (e.g. 2023 - Present)" style={inputStyle} />
                  <input value={exp.date || ''} onChange={e => updateExp(i, 'date', e.target.value)} placeholder="Date (e.g. 2024, March 2024)" style={inputStyle} />
                  <textarea rows={2} value={exp.description} onChange={e => updateExp(i, 'description', e.target.value)} placeholder="Description" style={inputStyle} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => saveExperience(i)} style={btnStyle(true)} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                    <button onClick={() => deleteExperience(i)} style={{ ...btnStyle(false), color: '#ef4444', borderColor: '#ef4444' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
