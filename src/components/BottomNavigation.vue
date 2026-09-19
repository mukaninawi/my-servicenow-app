<!-- src/components/BottomNavigation.vue -->
<template>
  <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#154360] border-t border-[#3498DB]/30 px-3 py-2 z-30 shadow-2xl">
    <div class="flex items-center justify-around">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200',
          isActive(item.path)
            ? 'text-[#F4D03F] font-bold scale-105'
            : 'text-sky-200 hover:text-white font-medium'
        ]"
      >
        <div class="relative">
          <Icon
            :icon="isActive(item.path) ? item.activeIcon : item.icon"
            class="w-6 h-6 mb-0.5 transition-transform"
          />
          <!-- Indicator Badge -->
          <span
            v-if="item.badge && item.badge > 0"
            class="absolute -top-1 -right-2 bg-[#E74C3C] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border-2 border-[#154360]"
          >
            {{ item.badge > 99 ? '99+' : item.badge }}
          </span>
        </div>
        <span class="text-[10px] tracking-tight">{{ item.name }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';

interface NavItem {
  name: string;
  path: string;
  icon: string;
  activeIcon: string;
  badge?: number;
}

const route = useRoute();

const navItems: NavItem[] = [
  {
    name: 'Beranda',
    path: '/dashboard',
    icon: 'heroicons:home-20-solid',
    activeIcon: 'heroicons:home-20-solid'
  },
  {
    name: 'Tiket Saya',
    path: '/myticket',
    icon: 'heroicons:ticket-20-solid',
    activeIcon: 'heroicons:ticket-20-solid'
  },
  {
    name: 'Buat Tiket',
    path: '/ticket/create',
    icon: 'heroicons:plus-circle-20-solid',
    activeIcon: 'heroicons:plus-circle-20-solid'
  },
  {
    name: 'Profil',
    path: '/profile',
    icon: 'heroicons:user-20-solid',
    activeIcon: 'heroicons:user-20-solid'
  }
];

const isActive = (path: string): boolean => {
  return route.path === path || route.path.startsWith(`${path}/`);
};
</script>