import axios from 'axios';
import { getStoredUserSession } from './publicAuth';

// Always hit the Vercel / local `/api` rewrite (never bare `/v1` — SPA catches that).
const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1';

export const publicApi = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: 'application/json',
  },
  timeout: 25_000,
});

publicApi.interceptors.request.use((config) => {
  const session = getStoredUserSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

/** Discover active provider profiles (women offering services). */
export async function fetchProfiles({
  city = 'Batumi',
  sort = 'trending',
  take = 48,
  vip = false,
  featured = false,
  cursor,
} = {}) {
  const { data } = await publicApi.get('/search/profiles', {
    params: {
      city,
      sort,
      take,
      ...(vip ? { vip: '1' } : {}),
      ...(featured ? { featured: '1' } : {}),
      ...(cursor ? { cursor } : {}),
    },
  });
  return data;
}

/** Public profile by slug. */
export async function fetchPublicProfile(slug) {
  const { data } = await publicApi.get(`/profiles/${encodeURIComponent(slug)}/public`);
  return data;
}
