/**
 * Admin REST client → `/v1/admin` (+ auth helpers under `/v1/auth`).
 */
import axios from 'axios';

const TOKEN_KEY = 'secret-admin-access';
const REFRESH_KEY = 'secret-admin-refresh';
const META_KEY = 'secret-admin-meta';

export function getStoredAdminSession() {
  try {
    const accessToken = localStorage.getItem(TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    const meta = JSON.parse(localStorage.getItem(META_KEY) || 'null');
    if (!accessToken) return null;
    return { accessToken, refreshToken, ...meta };
  } catch {
    return null;
  }
}

export function storeAdminSession(payload) {
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

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(META_KEY);
}

const API_BASE =
  import.meta.env.VITE_API_BASE ??
  (import.meta.env.PROD ? '/api/v1' : '/v1');

export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL ?? `${API_BASE}/admin`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 25_000,
});

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL ?? `${API_BASE}/auth`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 25_000,
});

adminApi.interceptors.request.use((config) => {
  const session = getStoredAdminSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      clearAdminSession();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('admin:session-cleared'));
      }
    }
    return Promise.reject(err);
  }
);

export async function loginAdmin(email, password) {
  const { data } = await authApi.post('/login', { email, password });
  if (data.role !== 'ADMIN') {
    const err = new Error('Admin role required');
    err.code = 'NOT_ADMIN';
    throw err;
  }
  storeAdminSession({ ...data, email });
  return data;
}

export async function bootstrapAdmin({ email, password, displayName }) {
  const { data } = await authApi.post('/bootstrap-admin', {
    email,
    password,
    displayName,
  });
  storeAdminSession({ ...data, email });
  return data;
}

export async function fetchProfilesRemote(params = {}) {
  const { data } = await adminApi.get('/profiles', { params: { take: 200, ...params } });
  return data;
}

export async function createProfileRemote(payload) {
  const { data } = await adminApi.post('/profiles', payload);
  return data;
}

export async function persistProfileRemote(id, patch) {
  const { data } = await adminApi.patch(`/profiles/${id}`, patch);
  return data;
}

export async function deleteProfileRemote(id) {
  const { data } = await adminApi.delete(`/profiles/${id}`);
  return data;
}

export async function fetchUsersRemote(params = {}) {
  const { data } = await adminApi.get('/users', { params: { take: 100, ...params } });
  return data;
}

export async function setUserStatusRemote(id, status) {
  const { data } = await adminApi.patch(`/users/${id}/status`, { status });
  return data;
}

export async function fetchBookingsRemote(params = {}) {
  const { data } = await adminApi.get('/bookings', { params: { take: 200, ...params } });
  return data;
}

export async function setBookingStatusRemote(id, status) {
  const { data } = await adminApi.patch(`/bookings/${id}/status`, { status });
  return data;
}

export async function fetchVipSubscriptionsRemote(params = {}) {
  const { data } = await adminApi.get('/vip-subscriptions', { params: { take: 200, ...params } });
  return data;
}

export async function updateVipSubscriptionRemote(id, patch) {
  const { data } = await adminApi.patch(`/vip-subscriptions/${id}`, patch);
  return data;
}

export async function createVipSubscriptionRemote(profileId, body) {
  const { data } = await adminApi.post(`/profiles/${profileId}/vip`, body);
  return data;
}

export async function fetchReportsRemote(params = {}) {
  const { data } = await adminApi.get('/reports', { params: { take: 100, ...params } });
  return data;
}

export async function updateReportRemote(id, patch) {
  const { data } = await adminApi.patch(`/reports/${id}`, patch);
  return data;
}

export async function fetchAnalyticsRemote() {
  const { data } = await adminApi.get('/analytics');
  return data;
}
