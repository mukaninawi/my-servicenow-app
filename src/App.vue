<!-- src/App.vue -->
<script setup lang="ts">
import { useRoute } from 'vue-router';
import BottomNavigation from './components/BottomNavigation.vue';

const route = useRoute();
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-100 font-sans antialiased text-gray-900 selection:bg-indigo-500 selection:text-white">
    <!-- View Komponen -->
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>

    <!-- Bottom Navigation Kondisional -->
    <BottomNavigation v-if="route.meta.showBottomNav" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>