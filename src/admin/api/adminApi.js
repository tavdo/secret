/**
 * Axios client prepped for REST replacement. Swap `baseURL` to your `/v1/admin` gateway.
 */
import axios from 'axios';

export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL ?? '',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 25_000,
});

adminApi.interceptors.response.use(
  (r) => r,
  (err) => {
    if (!import.meta.env.VITE_ADMIN_API_URL) return Promise.reject(err);
    console.warn('[adminApi]', err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);

/** Example thin resources — uncomment when endpoints exist */
export async function fetchProfilesRemote() {
  const { data } = await adminApi.get('/profiles');
  return data;
}

export async function persistProfileRemote(id, patch) {
  await adminApi.patch(`/profiles/${id}`, patch);
}
