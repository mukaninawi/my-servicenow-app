// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import AuthService from '../services/AuthService';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/onboarding' },
  { 
    path: '/onboarding', 
    name: 'Welcome', 
    component: () => import('../views/Onboarding.vue'),
    meta: { showBottomNav: false }
  },
  { 
    path: '/login', 
    name: 'SignIn', 
    component: () => import('../views/SignIn.vue'),
    meta: { showBottomNav: false }
  },
  { 
    path: '/signup', 
    name: 'SignUp', 
    component: () => import('../views/SignUp.vue'),
    meta: { showBottomNav: false }
  },
  { 
    path: '/forgot-password', 
    name: 'ForgotPass', 
    component: () => import('../views/ForgotPass.vue'),
    meta: { showBottomNav: false }
  },

  // Rute dengan Auth
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true, showBottomNav: true }
  },
  { 
    path: '/myticket', 
    name: 'MyTicket', 
    component: () => import('../views/MyTicket.vue'),
    meta: { requiresAuth: true, showBottomNav: true }
  },
  { 
    path: '/ticket/create', 
    name: 'TicketCreate', 
    component: () => import('../views/TicketForm.vue'),
    meta: { requiresAuth: true, showBottomNav: false }
  },
  { 
    path: '/profile', 
    name: 'Profile', 
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true, showBottomNav: true }
  },
  { 
    path: '/ticket/detail/:ticketID', 
    name: 'TicketDetail', 
    component: () => import('../views/TicketDetail.vue'),
    meta: { requiresAuth: true, showBottomNav: false }
  },
  { 
    path: '/scan/:code', 
    name: 'ScanLocation', 
    component: () => import('../views/ScanLocation.vue'),
    meta: { requiresAuth: true, showBottomNav: false }
  }
];

const router = createRouter({
  history: createWebHistory('/servicenow/'),
  routes
});

// Navigation Guard Modern (Tanpa parameter next())
router.beforeEach((to) => {
  const isAuthenticated = AuthService.isAuthenticated();

  // 1. Jika butuh login tapi pengguna belum terotentikasi
  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login';
  }

  // 2. Jika sudah terotentikasi, cegah akses kembali ke seluruh halaman publik
  const publicPages = ['/login', '/signup', '/onboarding', '/forgot-pass'];
  if (publicPages.includes(to.path) && isAuthenticated) {
    return '/dashboard';
  }
});

// Handling Error Navigasi Global
router.onError((error, to) => {
  console.error('Terjadi kesalahan saat navigasi ke:', to.path, error);
  if (error.message?.includes('Failed to fetch dynamically imported module')) {
    window.location.href = to.fullPath;
  }
});

export default router;