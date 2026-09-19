<template>
  <div class="min-h-screen bg-[#1b4f72] text-white flex justify-center items-center p-0">
    <div class="w-full h-screen sm:h-[844px] sm:max-w-md bg-[#154360] relative flex flex-col justify-between shadow-2xl overflow-y-auto px-6 py-8 no-scrollbar">
      
      <!-- Header Navigasi -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <button 
            @click="router.back()" 
            class="w-10 h-10 rounded-2xl bg-[#3498DB]/20 border border-[#3498DB]/40 flex items-center justify-center text-white hover:bg-[#3498DB]/35 transition-colors shadow-md"
          >
            <Icon icon="heroicons:arrow-left-20-solid" class="w-5 h-5" />
          </button>
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#F4D03F] bg-[#1b4f72] px-3 py-1.5 rounded-full border border-[#3498DB]/30 shadow-inner">
            Detail Tiket #{{ ticketId }}
          </span>
        </div>

        <!-- Alert Error -->
        <div v-if="errorMessage" class="p-4 bg-[#E74C3C]/10 border-l-4 border-[#E74C3C] rounded-r-2xl flex items-center gap-3">
          <Icon icon="heroicons:exclamation-triangle-20-solid" class="w-5 h-5 text-[#E74C3C] shrink-0" />
          <p class="text-xs text-red-200 font-medium">{{ errorMessage }}</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 space-y-3">
          <Icon icon="heroicons:arrow-path-20-solid" class="w-8 h-8 animate-spin text-[#3498DB]" />
          <p class="text-xs text-sky-200">Memuat informasi tiket...</p>
        </div>

        <!-- Konten Utama Detail Tiket -->
        <div v-else-if="ticket" class="space-y-5 pb-6">
          
          <!-- Card Utama Info -->
          <div class="bg-[#1b4f72] border border-[#3498DB]/30 rounded-3xl p-5 shadow-lg space-y-4">
            
            <!-- Status & Prioritas Badge -->
            <div class="flex items-center justify-between">
              <span :class="getStatusBadgeClass(ticket.status)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border">
                {{ ticket.status }}
              </span>
              <span :class="getPriorityBadgeClass(ticket.priority)" class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                Prioritas: {{ ticket.priority }}
              </span>
            </div>

            <!-- Title & Kategori -->
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#F4D03F] bg-[#154360] px-2 py-0.5 rounded-md border border-[#3498DB]/30">
                {{ ticket.category }}
              </span>
              <h2 class="text-lg font-black text-white mt-2 leading-snug">{{ ticket.title }}</h2>
            </div>

            <!-- Lokasi & Waktu -->
            <div class="grid grid-cols-2 gap-3 pt-2 border-t border-[#3498DB]/20 text-xs text-sky-200">
              <div class="flex items-center gap-2">
                <Icon icon="heroicons:map-pin-20-solid" class="w-4 h-4 text-[#3498DB] shrink-0" />
                <span class="truncate">{{ ticket.location || '-' }}</span>
              </div>
              <div class="flex items-center gap-2 justify-end">
                <Icon icon="heroicons:calendar-20-solid" class="w-4 h-4 text-[#3498DB] shrink-0" />
                <span>{{ ticket.createdAt_date }} {{ ticket.createdAt_time }}</span>
              </div>
            </div>
          </div>

          <!-- Deskripsi Tiket -->
          <div class="bg-[#1b4f72]/60 border border-[#3498DB]/20 rounded-2xl p-4 space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
              <Icon icon="heroicons:document-text-20-solid" class="w-4 h-4" />
              Deskripsi Masalah
            </h3>
            <p class="text-xs text-sky-100 leading-relaxed whitespace-pre-line">{{ ticket.description }}</p>
            <p class="text-[11px] text-sky-300/80 pt-1 border-t border-[#3498DB]/20">
              Pelapor: <strong class="text-white">{{ ticket.name || 'Karyawan' }}</strong>
            </p>
          </div>

          <!-- Lampiran Foto -->
          <div v-if="ticket.photo" class="space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
              <Icon icon="heroicons:photo-20-solid" class="w-4 h-4" />
              Lampiran Foto
            </h3>
            <div class="rounded-2xl overflow-hidden border border-[#3498DB]/30 bg-[#1b4f72] max-h-56 shadow-md">
              <img :src="ticket.photo" alt="Lampiran Tiket" class="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" @click="openImageModal(ticket.photo)" />
            </div>
          </div>

          <!-- Riwayat Aktivitas / Logs -->
          <div class="space-y-3 pt-2">
            <h3 class="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
              <Icon icon="heroicons:clock-20-solid" class="w-4 h-4" />
              Riwayat Aktivitas (Logs)
            </h3>

            <div v-if="logs.length === 0" class="text-center py-4 bg-[#1b4f72]/40 rounded-xl text-xs text-sky-300/60">
              Belum ada riwayat aktivitas untuk tiket ini.
            </div>

            <div class="space-y-2.5">
              <div 
                v-for="(log, index) in logs" 
                :key="log.id || index" 
                class="p-3.5 bg-[#1b4f72]/40 border border-[#3498DB]/20 rounded-2xl space-y-1.5 shadow-sm relative overflow-hidden"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-[#3498DB]"></span>
                    Status: {{ log.status }}
                  </span>
                  <span class="text-[10px] text-sky-300/80">{{ log.createdAt_date }} {{ log.createdAt_time }}</span>
                </div>
                <p v-if="log.note" class="text-xs text-sky-100 pl-3.5 border-l-2 border-[#3498DB]/40 my-1">
                  {{ log.note }}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-6 text-center pt-3 border-t border-[#3498DB]/20 text-[11px] text-sky-300/60">
        <p>My ServiceNow App &copy; 2026</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import ApiService from '../services/ApiService';
import { getErrorMessage } from '../utils/errorHandler';

const route = useRoute();
const router = useRouter();

const ticketId = route.params.ticketID || route.query.ticketId;
const ticket = ref<any>(null);
const logs = ref<any[]>([]);
const isLoading = ref<boolean>(true);
const errorMessage = ref<string>('');

// Format badge warna berdasarkan status tiket
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
    case 'Verified': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    case 'On Progress': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    case 'Completed': return 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40';
    case 'Closed': return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    default: return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
  }
};

// Format badge warna berdasarkan prioritas tiket
const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case 'Urgent': return 'bg-red-500 text-white shadow-sm shadow-red-900';
    case 'High': return 'bg-orange-500 text-white';
    case 'Medium': return 'bg-amber-500 text-slate-900 font-bold';
    case 'Low': return 'bg-[#3498DB]/30 text-sky-200';
    default: return 'bg-slate-700 text-slate-200';
  }
};

const openImageModal = (url: string) => {
  window.open(url, '_blank');
};

const fetchTicketData = async () => {
  if (!ticketId) {
    errorMessage.value = 'ID Tiket tidak ditemukan.';
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    // Memanggil parallel API detail dan log tiket
    const [resDetail, resLogs] = await Promise.all([
      ApiService.getTicketDetail(ticketId as string),
      ApiService.getTicketLogs(ticketId as string)
    ]);

    if (resDetail.data.status === 'success') {
      ticket.value = resDetail.data.data;
    }

    if (resLogs.data.status === 'success') {
      logs.value = resLogs.data.data;
    }
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Gagal memuat detail tiket.');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchTicketData();
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