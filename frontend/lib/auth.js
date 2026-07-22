'use client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

function tokenExpiresSoon(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return !payload.exp || payload.exp * 1000 <= Date.now() + 30_000;
  } catch {
    return true;
  }
}

export function clearAuthState() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  // Cleanup for sessions created by older versions; refresh tokens are httpOnly cookies.
  window.localStorage.removeItem('refreshToken');
  window.localStorage.removeItem(USER_KEY);
}

export function storeAuthSession({ accessToken, user }) {
  if (!accessToken) throw new Error('The server did not return an access token.');
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

let refreshRequest = null;

export async function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = fetch(`${BACKEND_URL}/api/auth/refresh`, { method: 'POST', credentials: 'include' })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.accessToken) throw new Error(payload.message || 'Your session has expired.');
        storeAuthSession(payload);
        return payload.accessToken;
      })
      .finally(() => { refreshRequest = null; });
  }
  return refreshRequest;
}

export async function getValidAccessToken() {
  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token && !tokenExpiresSoon(token)) return token;
  try { return await refreshAccessToken(); } catch (error) { clearAuthState(); throw error; }
}

export async function authenticatedFetch(path, options = {}) {
  const request = async (token) => fetch(`${BACKEND_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
  });
  let response = await request(await getValidAccessToken());
  if (response.status !== 401) return response;
  try { response = await request(await refreshAccessToken()); } catch (error) { clearAuthState(); throw error; }
  if (response.status === 401) clearAuthState();
  return response;
}

export async function logout() {
  try { await fetch(`${BACKEND_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' }); }
  finally { clearAuthState(); }
}
