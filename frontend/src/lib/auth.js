const API = import.meta.env.VITE_API_URL || "http://localhost:3050";

const r = (k) => localStorage.getItem(k) || "";
const w = (k, v) => localStorage.setItem(k, v);
const d = (k) => localStorage.removeItem(k);

export function setTokens({ access, refresh }) {
  if (access) w("access", access);
  if (refresh) w("refresh", refresh);
}
export function clearTokens() {
  d("access");
  d("refresh");
}

async function refreshAccess() {
  const refresh = r("refresh");
  if (!refresh) return null;
  const res = await fetch(`${API}/auth/refresh`, {
    method: "POST",
    headers: { Authorization: `Bearer ${refresh}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  setTokens({ access: data.access });
  return data.access;
}

export async function apiFetch(path, options = {}) {
  const access = r("access");
  const headers = {
    ...(options.headers || {}),
    ...(options.body && !("Content-Type" in (options.headers || {}))
      ? { "Content-Type": "application/json" }
      : {}),
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
  };
  const url = `${API}${path}`;
  let res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    const newAcc = await refreshAccess();
    if (newAcc) {
      const headers2 = { ...headers, Authorization: `Bearer ${newAcc}` };
      res = await fetch(url, { ...options, headers: headers2 });
    }
  }
  return res;
}

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}
export async function register(email, password) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return { ok: res.ok, data: await res.json() };
}
