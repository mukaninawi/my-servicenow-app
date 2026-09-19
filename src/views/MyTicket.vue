<!-- src/views/MyTicket.vue -->
<template>
  <div class="min-h-screen bg-[#1b4f72] text-white flex justify-center items-center p-0">
    <!-- Kontainer Aplikasi dengan Background Utama Biru Sky & Dongker -->
    <div class="w-full h-screen sm:h-[844px] sm:max-w-md bg-[#154360] relative flex flex-col shadow-2xl overflow-hidden">
      
      <!-- Sidebar Component -->
      <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto no-scrollbar pb-24 px-5 pt-6 space-y-6">
        
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- Tombol diganti Icon Ticket -->
            <div class="w-10 h-10 rounded-2xl bg-[#3498DB]/20 border border-[#3498DB]/40 flex items-center justify-center text-[#F4D03F] shadow-md">
              <Icon icon="heroicons:ticket-20-solid" class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[10px] uppercase font-bold tracking-wider text-[#F4D03F] flex items-center gap-1">
                DAFTAR TIKET
              </p>
              <h1 class="text-xl font-bold tracking-tight text-white">
                Riwayat & Progres
              </h1>
            </div>
          </div>

          <!-- Bagian kanan diganti Tombol Create Ticket -->
          <button 
            @click="router.push('/ticket/create')" 
            class="bg-[#F4D03F] text-[#154360] font-bold text-xs px-3.5 py-2.5 rounded-full shadow-md hover:bg-[#F39C12] hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1.5"
          >
            <Icon icon="heroicons:plus-20-solid" class="w-4 h-4 font-bold" />
            <span>Buat Tiket</span>
          </button>
        </div>

        <!-- Filter Tab Status Tiket -->
        <div class="flex items-center justify-between bg-[#1b4f72] border border-[#3498DB]/30 p-1.5 rounded-2xl">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="[
              'flex-1 py-2 text-xs font-bold rounded-xl transition-all',
              currentTab === tab.id
                ? 'bg-[#3498DB] text-white shadow'
                : 'text-sky-200 hover:text-white'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>

        <!-- Daftar Tiket Section -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-widest text-sky-200">
              ARSIP TIKET ({{ filteredTickets.length }})
            </h3>
            <button 
              @click="fetchTickets" 
              class="text-[11px] text-[#F4D03F] hover:underline flex items-center gap-1 font-medium"
            >
              <Icon icon="heroicons:arrow-path" class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
              Perbarui
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="py-12 text-center text-sky-200">
            <Icon icon="heroicons:arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-[#F4D03F]" />
            <p class="text-xs font-medium">Memuat data tiket...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredTickets.length === 0" class="bg-[#1b4f72] border border-[#3498DB]/30 rounded-3xl p-8 text-center space-y-3 shadow-md">
            <div class="w-12 h-12 bg-[#3498DB]/20 text-[#3498DB] rounded-2xl flex items-center justify-center mx-auto">
              <Icon icon="heroicons:ticket" class="w-6 h-6" />
            </div>
            <p class="text-sm font-bold text-white">Tidak ada tiket ditemukan</p>
            <p class="text-xs text-sky-200">Belum ada riwayat tiket untuk kategori status ini.</p>
          </div>

          <!-- List Kartu Tiket -->
          <div v-else class="space-y-3">
            <div 
              v-for="ticket in filteredTickets" 
              :key="ticket.id"
              class="bg-[#1b4f72] border border-[#3498DB]/30 rounded-3xl p-4 space-y-3 shadow-md hover:border-[#3498DB] transition-all"
            >
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-[#F4D03F] bg-[#154360] px-2.5 py-1 rounded-full border border-[#3498DB]/20">
                  #{{ ticket.ticket_code || ticket.id }}
                </span>
                <span :class="['text-[10px] font-bold uppercase px-2.5 py-1 rounded-full', getStatusBadgeClass(ticket.status)]">
                  {{ ticket.status }}
                </span>
              </div>

              <div>
                <h4 class="text-sm font-bold text-white tracking-tight">{{ ticket.title || ticket.subject }}</h4>
                <p class="text-xs text-sky-200 line-clamp-2 mt-1">{{ ticket.description }}</p>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-[#3498DB]/20 text-[11px] text-sky-300">
                <div class="flex items-center gap-1">
                  <Icon icon="heroicons:calendar" class="w-3.5 h-3.5" />
                  <span>{{ formatDate(ticket.created_at) }}</span>
                </div>
                <button 
                  @click="viewDetail(ticket.id)"
                  class="text-xs font-bold text-[#3498DB] hover:text-white transition-colors"
                >
                  Detail &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Navigation -->
      <BottomNavigation />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import Sidebar from '../components/Sidebar.vue';
import BottomNavigation from '../components/BottomNavigation.vue';
import AuthService from '../services/AuthService';
import ApiService from '../services/ApiService';
import type { User } from '../types';

const router = useRouter();

// State
const user = ref<User | null>(AuthService.getUser());
const isSidebarOpen = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const currentTab = ref<string>('all');

interface Ticket {
  id: number | string;
  ticket_code?: string;
  title?: string;
  subject?: string;
  description: string;
  status: string; // 'applied', 'progress', 'completed'
  created_at: string;
}

const tickets = ref<Ticket[]>([]);

const tabs = [
  { id: 'all', name: 'Semua' },
  { id: 'Open', name: 'Diajukan' },
  { id: 'On Progress', name: 'Proses' },
  { id: 'Closed', name: 'Selesai' }
];

const filteredTickets = computed(() => {
  if (currentTab.value === 'all') return tickets.value;
  return tickets.value.filter(t => t.status === currentTab.value);
});

const fetchTickets = async () => {
  isLoading.value = true;
  try {
    const res = await ApiService.getTicketData({});
    // Mengambil data array tiket dari respons API
    tickets.value = res.data.data || res.data || [];
  } catch (error) {
    console.error('Gagal mengambil data tiket', error);
  } finally {
    isLoading.value = false;
  }
};

const getStatusBadgeClass = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'open' || s === 'pending') return 'bg-[#3498DB]/20 text-[#3498DB] border border-[#3498DB]/30';
  if (s === 'on progress' || s === 'processing') return 'bg-[#F39C12]/20 text-[#F39C12] border border-[#F39C12]/30';
  if (s === 'completed' || s === 'closed') return 'bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/30';
  return 'bg-neutral-700 text-neutral-300';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const viewDetail = (id: number | string) => {
  router.push(`/ticket/detail/${id}`);
};

onMounted(() => {
  fetchTickets();
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>