<!-- src/views/Dashboard.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import Sidebar from '../components/Sidebar.vue';
import AuthService from '../services/AuthService';
import ApiService from '../services/ApiService';
import type { User, TicketStats, ApiResponse } from '../types';

const router = useRouter();

const isSidebarOpen = ref<boolean>(false);
const user = ref<User | null>(AuthService.getUser());
const isLoadingStats = ref<boolean>(false);
const activeTab = ref<'desc' | 'company' | 'review'>('desc');

const stats = ref<TicketStats>({
  applied: 0,
  progress: 0,
  completed: 0
});

const userAvatarLetter = computed(() => {
  if (user.value?.name) {
    return user.value.name.charAt(0).toUpperCase();
  }
  return 'J';
});

const fetchStats = async (): Promise<void> => {
  isLoadingStats.value = true;
  try {
    const res = await ApiService.getTicketStats();
    const apiData = res.data as ApiResponse<TicketStats>;      
    if (apiData.status === 'success') {
      stats.value = apiData.data;
    }
  } catch (error) {
    console.error('Gagal mengambil data statistik:', error);
  } finally {
    isLoadingStats.value = false;
  }
};

onMounted(() => {
  fetchStats();
});
</script>

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
            <button 
              @click="isSidebarOpen = true"
              class="w-10 h-10 rounded-full bg-[#3498DB] text-white flex items-center justify-center hover:bg-[#2980b9] transition-colors shadow-md"
            >
              <Icon icon="heroicons:bars-3-20-solid" class="w-5 h-5" />
            </button>
            <div>
              <p class="text-[10px] uppercase font-bold tracking-wider text-[#F4D03F] flex items-center gap-1">
                SERVICEDESK GA <span class="text-sm">⚡</span>
              </p>
              <h1 class="text-xl font-bold tracking-tight text-white">
                {{ user?.name ? user.name.split(' ')[0] : 'Engineer' }}!
              </h1>
            </div>
          </div>

          <!-- Location Selector / Branch info -->
          <div class="flex items-center gap-2 bg-[#1b4f72] border border-[#3498DB]/40 px-3 py-2 rounded-full text-xs font-medium text-[#F4D03F]">
            <span class="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse"></span>
            <span>Surabaya Cabang</span>
          </div>
        </div>

        <!-- Banner Card -->
        <div class="relative rounded-3xl bg-gradient-to-br from-[#F39C12] via-[#E74C3C] to-[#3498DB] p-6 overflow-hidden shadow-lg">
          <div class="absolute -right-6 -bottom-6 text-white/10 pointer-events-none">
            <Icon icon="heroicons:wrench-screwdriver-20-solid" class="w-40 h-40" />
          </div>

          <div class="relative z-10 space-y-3">
            <span class="inline-block bg-[#154360]/60 backdrop-blur-md text-[#F4D03F] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider border border-[#F4D03F]/30">
              PORTAL OPERASIONAL
            </span>
            <h2 class="text-2xl font-black tracking-tight leading-snug text-white">
              Sistem Penanganan Tiket & Fasilitas Cabang
            </h2>
            <p class="text-xs text-white/90 leading-relaxed font-medium">
              Pantau progres perbaikan, kelola aset, dan selesaikan kendala teknis dengan cepat.
            </p>
            <div class="pt-2">
              <button @click="router.push('/ticket/create')" class="bg-[#F4D03F] text-[#154360] font-bold text-xs px-5 py-3 rounded-full shadow-md hover:bg-[#F39C12] hover:text-white transition-colors uppercase tracking-wider">
                + BUAT TIKET BARU
              </button>
            </div>
          </div>
        </div>

        <!-- Ticket Stats Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-widest text-sky-200">STATISTIK TIKET</h3>
            
            <div class="bg-[#1b4f72] border border-[#3498DB]/40 p-1 rounded-full flex items-center gap-1">
              <span class="px-4 py-1.5 rounded-full text-xs font-bold bg-[#3498DB] text-white shadow">
                AKTIF
              </span>
            </div>
          </div>

          <!-- Stats Card Item -->
          <div class="bg-[#1b4f72] border border-[#3498DB]/30 rounded-3xl p-5 space-y-3 shadow-md">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-[#F4D03F] text-[#154360] flex items-center justify-center font-bold text-lg shadow">
                  {{ userAvatarLetter }}
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white">
                    {{ user?.name || 'Staff Engineering' }}
                  </h4>
                  <p class="text-[11px] text-sky-200">
                    {{ user?.email || 'surabaya@jne.co.id' }}
                  </p>
                </div>
              </div>
              <span v-if="isLoadingStats" class="text-xs text-[#F4D03F] animate-pulse">Memuat...</span>
            </div>

            <!-- Grid Statistik -->
            <div class="grid grid-cols-3 gap-2 pt-3 border-t border-[#3498DB]/30 text-center">
              <div class="bg-[#154360] p-2.5 rounded-2xl border border-[#3498DB]/20">
                <p class="text-[10px] text-sky-200 uppercase tracking-wider">Diajukan</p>
                <p class="text-lg font-black text-white mt-0.5">{{ stats.applied }}</p>
              </div>
              <div class="bg-[#154360] p-2.5 rounded-2xl border border-[#F39C12]/30">
                <p class="text-[10px] text-sky-200 uppercase tracking-wider">Proses</p>
                <p class="text-lg font-black text-[#F39C12] mt-0.5">{{ stats.progress }}</p>
              </div>
              <div class="bg-[#154360] p-2.5 rounded-2xl border border-[#2ECC71]/30">
                <p class="text-[10px] text-sky-200 uppercase tracking-wider">Selesai</p>
                <p class="text-lg font-black text-[#2ECC71] mt-0.5">{{ stats.completed }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Our Services Section -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-widest text-sky-200">LAYANAN UTAMA</h3>
          <div class="grid grid-cols-2 gap-3">
            <div @click="router.push('/ticket/create')" class="bg-[#1b4f72] border border-[#3498DB]/30 p-4 rounded-3xl space-y-3 hover:bg-[#2471a3] transition-colors cursor-pointer shadow-md">
              <div class="w-10 h-10 rounded-xl bg-[#3498DB] text-white flex items-center justify-center shadow">
                <Icon icon="heroicons:wrench-screwdriver-20-solid" class="w-5 h-5" />
              </div>
              <div>
                <h5 class="text-xs font-bold text-white tracking-wider">PERBAIKAN</h5>
                <p class="text-[10px] text-sky-200 mt-0.5">Fasilitas & AC Kantor</p>
              </div>
            </div>

            <div @click="router.push('/myticket')" class="bg-[#1b4f72] border border-[#3498DB]/30 p-4 rounded-3xl space-y-3 hover:bg-[#2471a3] transition-colors cursor-pointer shadow-md">
              <div class="w-10 h-10 rounded-xl bg-[#E74C3C] text-white flex items-center justify-center shadow">
                <Icon icon="heroicons:ticket-20-solid" class="w-5 h-5" />
              </div>
              <div>
                <h5 class="text-xs font-bold text-white tracking-wider">DAFTAR TIKET</h5>
                <p class="text-[10px] text-sky-200 mt-0.5">Monitoring status</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Informasi & Bantuan (Tab Section) -->
        <div class="space-y-3 pt-2">
          <h3 class="text-xs font-bold uppercase tracking-widest text-sky-200">INFORMASI & PANDUAN</h3>
          
          <!-- Tab Navigation -->
          <div class="bg-[#1b4f72] p-1.5 rounded-2xl border border-[#3498DB]/30 grid grid-cols-3 gap-1">
            <button
              @click="activeTab = 'desc'"
              :class="activeTab === 'desc' ? 'bg-[#3498DB] text-white shadow' : 'text-sky-300 hover:text-white'"
              class="py-2 text-[10px] font-bold rounded-xl transition-all uppercase tracking-wider text-center"
            >
              Tentang
            </button>
            <button
              @click="activeTab = 'company'"
              :class="activeTab === 'company' ? 'bg-[#3498DB] text-white shadow' : 'text-sky-300 hover:text-white'"
              class="py-2 text-[10px] font-bold rounded-xl transition-all uppercase tracking-wider text-center"
            >
              Alur
            </button>
            <button
              @click="activeTab = 'review'"
              :class="activeTab === 'review' ? 'bg-[#3498DB] text-white shadow' : 'text-sky-300 hover:text-white'"
              class="py-2 text-[10px] font-bold rounded-xl transition-all uppercase tracking-wider text-center"
            >
              FAQ & Bantuan
            </button>
          </div>

          <!-- Tab Content Container -->
          <div class="bg-[#1b4f72] border border-[#3498DB]/30 rounded-3xl p-4 shadow-md">
            
            <!-- Tab 1: Tentang Aplikasi -->
            <div v-show="activeTab === 'desc'" class="space-y-4">
              <div>
                <h6 class="text-xs font-bold text-[#F4D03F] uppercase tracking-wider mb-1">Tentang Aplikasi</h6>
                <p class="text-xs text-sky-100 leading-relaxed">
                  Aplikasi ini adalah sistem ticketing permintaan perbaikan fasilitas yang digunakan oleh karyawan untuk mengajukan permintaan perbaikan kepada General Affair (GA). Setiap permintaan tercatat sebagai ticket sehingga proses penanganan lebih terkontrol, transparan, dan terukur.
                </p>
              </div>
              <div class="pt-3 border-t border-[#3498DB]/30">
                <h6 class="text-xs font-bold text-[#F4D03F] uppercase tracking-wider mb-2">Tujuan</h6>
                <ul class="space-y-1.5 text-xs text-sky-100">
                  <li class="flex items-start gap-2">
                    <span class="text-[#F4D03F] font-bold">•</span>
                    <span>Mempermudah karyawan mengajukan permintaan perbaikan fasilitas</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-[#F4D03F] font-bold">•</span>
                    <span>Membantu GA mengelola, memprioritaskan, dan memonitor pekerjaan</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-[#F4D03F] font-bold">•</span>
                    <span>Menyediakan histori kerusakan & perbaikan fasilitas</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-[#F4D03F] font-bold">•</span>
                    <span>Meningkatkan kecepatan respon dan kualitas layanan GA</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Tab 2: Alur Pengajuan -->
            <div v-show="activeTab === 'company'" class="space-y-4">
              <div>
                <h6 class="text-xs font-bold text-[#F4D03F] uppercase tracking-wider mb-1">Alur Pengajuan Permintaan</h6>
                <p class="text-xs text-sky-100 leading-relaxed">
                  <strong class="text-white">Karyawan</strong> → mengajukan permintaan perbaikan fasilitas<br/>
                  <strong class="text-white">General Affair</strong> → menerima, memverifikasi, mengelola, dan memonitor ticket dalam sistem.
                </p>
              </div>
              <div class="pt-3 border-t border-[#3498DB]/30">
                <h6 class="text-xs font-bold text-[#F4D03F] uppercase tracking-wider mb-2">Tahapan Proses</h6>
                <ul class="space-y-1.5 text-xs text-sky-100">
                  <li class="flex items-start gap-2">
                    <span class="text-[#3498DB] font-bold">1.</span>
                    <span>Karyawan mengisi form permintaan perbaikan</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-[#3498DB] font-bold">2.</span>
                    <span>Sistem membuat nomor ticket otomatis</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-[#3498DB] font-bold">3.</span>
                    <span>GA memverifikasi dan menentukan prioritas</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-[#3498DB] font-bold">4.</span>
                    <span>Ticket di-assign ke teknisi / vendor</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-[#3498DB] font-bold">5.</span>
                    <span>Perbaikan dilakukan & progres di-update</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-[#3498DB] font-bold">6.</span>
                    <span>Karyawan konfirmasi selesai & ticket ditutup</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Tab 3: Bantuan & FAQ -->
            <div v-show="activeTab === 'review'" class="space-y-4">
              <!-- Bantuan Kontak -->
              <div>
                <h6 class="text-xs font-bold text-[#F4D03F] uppercase tracking-wider mb-2">Bantuan Kontak</h6>
                <div class="space-y-2 text-xs">
                  <div class="flex items-center gap-2 text-sky-100">
                    <Icon icon="heroicons:phone-20-solid" class="w-4 h-4 text-[#F4D03F] shrink-0" />
                    <span>WhatsApp/Ext: <a href="https://wa.me/" class="text-white font-medium hover:underline">08xxxxxxxxxx</a></span>
                  </div>
                  <div class="flex items-center gap-2 text-sky-100">
                    <Icon icon="heroicons:envelope-20-solid" class="w-4 h-4 text-[#F4D03F] shrink-0" />
                    <span>Email: <a href="mailto:ga.sub@jne.co.id" class="text-white font-medium hover:underline">ga.sub@jne.co.id</a></span>
                  </div>
                  <div class="flex items-center gap-2 text-sky-100">
                    <Icon icon="heroicons:clock-20-solid" class="w-4 h-4 text-[#F4D03F] shrink-0" />
                    <span>Jam Layanan: Senin–Jumat, 08.00–17.00</span>
                  </div>
                </div>
              </div>

              <!-- FAQ Section -->
              <div class="pt-3 border-t border-[#3498DB]/30 space-y-3">
                <h6 class="text-xs font-bold text-[#F4D03F] uppercase tracking-wider">FAQ (Pertanyaan Umum)</h6>
                
                <div class="space-y-1">
                  <div class="text-xs font-bold text-white">Cara Mengajukan Perbaikan</div>
                  <p class="text-[11px] text-sky-200">Masuk ke menu Perbaikan, pilih lokasi & jenis fasilitas, isi deskripsi kerusakan, lalu klik Kirim.</p>
                </div>

                <div class="space-y-1">
                  <div class="text-xs font-bold text-white">Cara Melihat Status Ticket</div>
                  <p class="text-[11px] text-sky-200">Buka menu Daftar Tiket untuk memantau progres penanganan secara real-time.</p>
                </div>

                <div class="space-y-1">
                  <div class="text-xs font-bold text-white">Tips Pelaporan</div>
                  <p class="text-[11px] text-sky-200">Sertakan foto yang jelas dan jelaskan lokasi kerusakan seakurat mungkin.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>