"use client";

type StoredUser = { _id: string; name?: string; email?: string; role?: string };

export function setAuth(token: string, user?: StoredUser) {
  try {
    localStorage.setItem('tp_token', token);
    if (user) localStorage.setItem('tp_user', JSON.stringify(user));
    window.dispatchEvent(new Event('tp_auth_change'));
  } catch {}
}

export function setToken(token: string) { setAuth(token); }

export function getToken(): string | null {
  try { return localStorage.getItem('tp_token'); } catch { return null; }
}

export function getUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem('tp_user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearAuth() {
  try {
    localStorage.removeItem('tp_token');
    localStorage.removeItem('tp_user');
    window.dispatchEvent(new Event('tp_auth_change'));
  } catch {}
}

export function authHeader(): HeadersInit {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
