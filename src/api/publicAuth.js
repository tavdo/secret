import { authApi } from '../admin/api/adminApi';

const TOKEN_KEY = 'secret-user-access';
const REFRESH_KEY = 'secret-user-refresh';
const META_KEY = 'secret-user-meta';

export function getStoredUserSession() {
  try {
    const accessToken = localStorage.getItem(TOKEN_KEY);
    if (!accessToken) return null;
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    const meta = JSON.parse(localStorage.getItem(META_KEY) || 'null');
    return { accessToken, refreshToken, ...meta };
  } catch {
    return null;
  }
}

export function storeUserSession(payload) {
  localStorage.setItem(TOKEN_KEY, payload.accessToken);
  if (payload.refreshToken) localStorage.setItem(REFRESH_KEY, payload.refreshToken);
  localStorage.setItem(
    META_KEY,
    JSON.stringify({
      userId: payload.userId,
      role: payload.role,
      email: payload.email ?? null,
    })
  );
}

export function clearUserSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(META_KEY);
}

export async function loginUser(email, password) {
  const { data } = await authApi.post('/login', { email, password });
  storeUserSession({ ...data, email });
  return data;
}

export async function requestPasswordReset(email) {
  await authApi.post('/forgot-password', { email });
}
