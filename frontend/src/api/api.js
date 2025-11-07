import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: false
});

client.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401 && window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function signup(data) { return client.post('/auth/register', data); }
export async function login(data) { return client.post('/auth/login', data); }
export async function uploadFile(formData) { return client.post('/files/upload', formData, { headers: {'Content-Type':'multipart/form-data'} }); }
export async function listFiles() { return client.get('/files'); }
export async function downloadFile(id) { return client.get(`/files/download/${id}`, { responseType: 'blob' }); }
export async function deleteFile(id) { return client.delete(`/files/${id}`); }
export async function getAnalytics() { return client.get('/files/analytics'); }
export async function previewFile(id) { return client.get(`/files/preview/${id}`, { responseType: 'blob' }); }
export async function renameFile(id, newName) { return client.patch(`/files/${id}/rename`, { newName }); }
export async function moveFile(id, folder) { return client.patch(`/files/${id}/move`, { folder }); }

export default client;
