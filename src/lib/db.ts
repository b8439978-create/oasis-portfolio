import { supabase } from './supabase';

function sb() {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase;
}

export const DB = {
  projects: {
    all: async () => {
      try { const { data } = await sb().from('projects').select('*').order('id', { ascending: false }); return data || []; } catch { return []; }
    },
    add: async (item: any) => {
      try { const { data } = await sb().from('projects').insert(item).select().single(); return data || item; } catch { return item; }
    },
    update: async (id: number, data: any) => {
      try { const { data: result } = await sb().from('projects').update(data).eq('id', id).select().single(); return result; } catch { return null; }
    },
    delete: async (id: number) => {
      try { await sb().from('projects').delete().eq('id', id); } catch {}
    },
  },
  testimonials: {
    all: async () => {
      try { const { data } = await sb().from('testimonials').select('*').order('id', { ascending: false }); return data || []; } catch { return []; }
    },
    add: async (item: any) => {
      try { const { data } = await sb().from('testimonials').insert(item).select().single(); return data || item; } catch { return item; }
    },
    delete: async (id: number) => {
      try { await sb().from('testimonials').delete().eq('id', id); } catch {}
    },
  },
  messages: {
    all: async () => {
      try { const { data } = await sb().from('messages').select('*').order('id', { ascending: false }); return data || []; } catch { return []; }
    },
    add: async (item: any) => {
      try { const { data } = await sb().from('messages').insert(item).select().single(); return data || item; } catch { return item; }
    },
    markRead: async (id: number) => {
      try { await sb().from('messages').update({ isRead: true }).eq('id', id); } catch {}
    },
    delete: async (id: number) => {
      try { await sb().from('messages').delete().eq('id', id); } catch {}
    },
  },
  orders: {
    all: async () => {
      try { const { data } = await sb().from('orders').select('*').order('id', { ascending: false }); return data || []; } catch { return []; }
    },
    add: async (item: any) => {
      try { const { data } = await sb().from('orders').insert(item).select().single(); return data || item; } catch { return item; }
    },
    update: async (id: number, data: any) => {
      try { const { data: result } = await sb().from('orders').update(data).eq('id', id).select().single(); return result; } catch { return null; }
    },
    delete: async (id: number) => {
      try { await sb().from('orders').delete().eq('id', id); } catch {}
    },
  },
  settings: {
    get: async () => {
      try {
        if (!supabase) return { siteName: 'OASIS', tagline: 'Crafting futuristic digital experiences.', heroTitle: 'OASIS', primaryColor: '#00f0ff', theme: 'dark', language: 'en' };
        const { data } = await sb().from('settings').select('*').eq('id', 1).single();
        return data || { siteName: 'OASIS', tagline: 'Crafting futuristic digital experiences.', heroTitle: 'OASIS', primaryColor: '#00f0ff', theme: 'dark', language: 'en' };
      } catch { return { siteName: 'OASIS', tagline: 'Crafting futuristic digital experiences.', heroTitle: 'OASIS', primaryColor: '#00f0ff', theme: 'dark', language: 'en' }; }
    },
    update: async (data: any) => {
      try { const { data: result } = await sb().from('settings').update(data).eq('id', 1).select().single(); return result; } catch { return data; }
    },
  },
  visitors: {
    add: async (ip: string) => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data: existing } = await sb().from('visitors').select('id').eq('ip', ip).eq('date', today).maybeSingle();
        if (!existing) await sb().from('visitors').insert({ ip, date: today, timestamp: Date.now() });
      } catch {}
    },
    count: async () => {
      try {
        const { data } = await sb().from('visitors').select('*');
        const items = data || [];
        const today = new Date().toISOString().split('T')[0];
        return { total: items.length, today: items.filter((i: any) => i.date === today).length, unique: [...new Set(items.map((i: any) => i.ip))].length };
      } catch { return { total: 0, today: 0, unique: 0 }; }
    },
  },
};
