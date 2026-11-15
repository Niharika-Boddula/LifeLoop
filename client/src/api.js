import axios from 'axios';
const localHostUrl = value => {
  if (!value || !import.meta.env.DEV) return value;
  try {
    const url = new URL(value, window.location.origin);
    if (['localhost', '127.0.0.1', '::1'].includes(url.hostname)) url.hostname = window.location.hostname;
    return url.toString().replace(/\/$/, '');
  } catch { return value; }
};
const apiBase = localHostUrl(import.meta.env.VITE_API_URL) || '/api';
export const api = axios.create({ baseURL: apiBase, timeout: 12000 });
api.interceptors.request.use(config => { const token = localStorage.getItem('ll_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export const socketUrl = localHostUrl(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL) || window.location.origin;
