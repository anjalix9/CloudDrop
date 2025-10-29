// src/api/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// Automatically add token to all requests if logged in
client.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// ==================== AUTH ====================
export async function signup(data) {
  return client.post('/auth/signup', data);
}

export async function login(data) {
  return client.post('/auth/login', data);
}

// ==================== FILES ====================
export async function uploadFile(formData) {
  return client.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function listFiles() {
  return client.get('/files');
}

export async function downloadFile(id) {
  return client.get(`/files/download/${id}`, { responseType: 'blob' });
}

export async function deleteFile(id) {
  return client.delete(`/files/${id}`);
}

export async function previewFile(id) {
  return client.get(`/files/preview/${id}`, { responseType: 'blob' });
}

export async function getStats() {
  return client.get('/files/stats');
}

export default client;
