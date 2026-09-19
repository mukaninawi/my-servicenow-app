<!-- src/components/Sidebar.vue -->
<template>
  <!-- Overlay Backdrop -->
  <transition name="fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      @click="$emit('close')"
    ></div>
  </transition>

  <!-- Sidebar Container -->
  <transition name="slide">
    <div 
      v-if="isOpen" 
      class="fixed inset-y-0 left-0 w-72 bg-[#154360] border-r border-[#3498DB]/30 shadow-2xl z-50 flex flex-col justify-between p-6 text-white"
    >
      <!-- Header Sidebar -->
      <div class="space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-[#3498DB]/30">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-[#F4D03F] text-[#154360] flex items-center justify-center font-black text-lg shadow">
              {{ userAvatarLetter }}
            </div>
            <div>
              <h2 class="text-sm font-bold text-white truncate max-w-[130px]">
                {{ user?.name || 'Staff Engineering' }}
              </h2>
              <p class="text-[10px] text-[#F4D03F] uppercase tracking-wider font-semibold">
                Surabaya Cabang
              </p>
            </div>
          </div>
          <button 
            @click="$emit('close')"
            class="w-8 h-8 rounded-full bg-[#1b4f72] border border-[#3498DB]/30 flex items-center justify-center text-sky-200 hover:text-white transition-colors"
          >
            <Icon icon="heroicons:x-mark-20-solid" class="w-5 h-5" />
          </button>
        </div>

        <!-- Navigation Menu Links -->
        <nav class="space-y-2">
          <router-link 
            to="/dashboard" 
            @click="$emit('close')"
            class="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors"
            :class="route.path === '/dashboard' ? 'bg-[#3498DB] text-white shadow' : 'text-sky-200 hover:bg-[#1b4f72] hover:text-white'"
          >
            <Icon icon="heroicons:home-20-solid" class="w-5 h-5 text-[#F4D03F]" />
            <span>Dashboard</span>
          </router-link>

          <router-link 
            to="/myticket" 
            @click="$emit('close')"
            class="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors"
            :class="route.path === '/myticket' ? 'bg-[#3498DB] text-white shadow' : 'text-sky-200 hover:bg-[#1b4f72] hover:text-white'"
          >
            <Icon icon="heroicons:ticket-20-solid" class="w-5 h-5 text-[#F39C12]" />
            <span>Daftar Tiket</span>
          </router-link>

          <router-link 
            to="/ticket/create" 
            @click="$emit('close')"
            class="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors"
            :class="route.path === '/ticket/create' ? 'bg-[#3498DB] text-white shadow' : 'text-sky-200 hover:bg-[#1b4f72] hover:text-white'"
          >
            <Icon icon="heroicons:plus-circle-20-solid" class="w-5 h-5 text-[#2ECC71]" />
            <span>Buat Tiket Baru</span>
          </router-link>

          <router-link 
            to="/profile" 
            @click="$emit('close')"
            class="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors"
            :class="route.path === '/profile' ? 'bg-[#3498DB] text-white shadow' : 'text-sky-200 hover:bg-[#1b4f72] hover:text-white'"
          >
            <Icon icon="heroicons:user-20-solid" class="w-5 h-5 text-[#3498DB]" />
            <span>Profil Saya</span>
          </router-link>
        </nav>
      </div>

      <!-- Footer Sidebar: Logout Button -->
      <div class="pt-4 border-t border-[#3498DB]/30">
        <button 
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 bg-[#E74C3C] text-white py-3 rounded-2xl text-xs font-bold shadow-md hover:bg-red-600 transition-colors uppercase tracking-wider"
        >
          <Icon icon="heroicons:arrow-left-on-rectangle-20-solid" class="w-5 h-5" />
          <span>Keluar Aplikasi</span>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import AuthService from '../services/AuthService';
import type { User } from '../types';

defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

const route = useRoute();
const router = useRouter();

const user = refSafeUser();

function refSafeUser(): User | null {
  return AuthService.getUser();
}

const userAvatarLetter = computed(() => {
  if (user?.name) {
    return user.name.charAt(0).toUpperCase();
  }
  return 'J';
});

const handleLogout = () => {
  AuthService.logout();
  router.push('/login');
};
</script>

<style scoped>
/* Animasi Transisi Sidebar */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>