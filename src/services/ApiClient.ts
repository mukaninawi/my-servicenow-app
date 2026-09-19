// src/services/ApiClient.ts
import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor Request: Menyertakan Bearer Token secara otomatis
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('jwt_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor Response: Menangani Error Global seperti Token Expired (401 / Pesan Khusus)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const data = error.response.data as { status?: string; message?: string };

      // Ambil base path dari Vite env, atau default ke '/servicenow/'
      const baseUrl = '/servicenow/';

      // Cek jika status error dan pesan menunjukkan token expired atau unauthorized (401)
      if (
        (data && data.message && typeof data.message === 'string' && data.message.toLowerCase().includes('token expired')) ||
        (error.response && error.response.status === 401)
      ) {
        // 1. Hapus sesi lokal yang invalid
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');

        // 2. Buat target path login yang sudah menggunakan base path
        // Menggabungkan base path (misal: '/servicenow/') dengan 'login'
        const loginPath = `${baseUrl.replace(/\/$/, '')}/login`; // Hasil: /servicenow/login

        // 3. Redirect ke halaman login jika saat ini belum di halaman login
        if (!window.location.pathname.endsWith('/login')) {
          window.location.href = `${loginPath}?expired=true`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;