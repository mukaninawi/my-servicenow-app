// src/main.ts
import { createApp } from 'vue';
import vue3GoogleLogin from 'vue3-google-login';
import App from './App.vue';
import router from './router';
import './assets/style.css';

const app = createApp(App);

// Registrasi Plugin Google Login
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
});

// Registrasi Router
app.use(router);

app.mount('#app');