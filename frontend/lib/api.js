const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('pavoire_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  async get(path) {
    const res = await fetch(`${API_BASE}${path}`, { headers: getHeaders(), cache: 'no-store' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async post(path, body) {
    const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async patch(path, body) {
    const res = await fetch(`${API_BASE}${path}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(body) });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async delete(path) {
    const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers: getHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};
