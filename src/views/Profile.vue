<!-- src/views/Profile.vue -->
<template>
  <div class="min-h-screen bg-[#1b4f72] text-white flex justify-center items-center p-0">
    <!-- Kontainer Aplikasi -->
    <div class="w-full h-screen sm:h-[844px] sm:max-w-md bg-[#154360] relative flex flex-col shadow-2xl overflow-hidden">
      
      <!-- Sidebar Component -->
      <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto no-scrollbar pb-24 px-5 pt-6 space-y-6">
        
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- Avatar / Icon Profile (Tanpa Button & Non-klik) -->
            <div class="w-10 h-10 rounded-full bg-[#3498DB] text-white flex items-center justify-center font-bold text-sm shadow-md">
              {{ userAvatarLetter }}
            </div>
            <div>
              <p class="text-[10px] uppercase font-bold tracking-wider text-[#F4D03F] flex items-center gap-1">
                PENGATURAN AKUN
              </p>
              <h1 class="text-xl font-bold tracking-tight text-white">
                Profil Saya
              </h1>
            </div>
          </div>

          <!-- Branch Badge -->
          <div class="flex items-center gap-2 bg-[#1b4f72] border border-[#3498DB]/40 px-3 py-2 rounded-full text-xs font-medium text-[#F4D03F]">
            <span class="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse"></span>
            <span>Surabaya Cabang</span>
          </div>
        </div>

        <!-- User Info Card -->
        <div class="bg-[#1b4f72] border border-[#3498DB]/30 rounded-3xl p-5 shadow-md flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-[#F4D03F] text-[#154360] flex items-center justify-center font-black text-xl shadow">
            {{ userAvatarLetter }}
          </div>
          <div class="overflow-hidden">
            <h4 class="text-sm font-bold text-white truncate">
              {{ user?.name || 'Memuat...' }}
            </h4>
            <p class="text-[11px] text-sky-200 truncate">
              {{ user?.email || 'Memuat...' }}
            </p>
            <span class="inline-block mt-1 bg-[#3498DB]/20 text-[#3498DB] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#3498DB]/40">
              {{ user?.role || 'General Affair / Engineering' }}
            </span>
          </div>
        </div>

        <!-- Menu Pilihan Profil -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-widest text-sky-200">MENU AKUN</h3>
          
          <div class="bg-[#1b4f72] border border-[#3498DB]/30 rounded-3xl overflow-hidden shadow-md divide-y divide-[#3498DB]/20">
            
            <!-- 1. Personal Information -->
            <button 
              @click="activeMenu = 'info'"
              class="w-full flex items-center justify-between p-4 hover:bg-[#2471a3]/40 transition-colors text-left"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#3498DB]/20 text-[#3498DB] flex items-center justify-center">
                  <Icon icon="heroicons:user-20-solid" class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-xs font-bold text-white">Informasi Pribadi</div>
                  <div class="text-[10px] text-sky-200">Lihat data akun & informasi cabang</div>
                </div>
              </div>
              <Icon icon="heroicons:chevron-right-20-solid" class="w-4 h-4 text-sky-300" />
            </button>

            <!-- 2. Change Password -->
            <button 
              @click="activeMenu = 'password'"
              class="w-full flex items-center justify-between p-4 hover:bg-[#2471a3]/40 transition-colors text-left"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#F39C12]/20 text-[#F39C12] flex items-center justify-center">
                  <Icon icon="heroicons:key-20-solid" class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-xs font-bold text-white">Ubah Password</div>
                  <div class="text-[10px] text-sky-200">Perbarui kata sandi akun Anda</div>
                </div>
              </div>
              <Icon icon="heroicons:chevron-right-20-solid" class="w-4 h-4 text-sky-300" />
            </button>

            <!-- 3. Logout -->
            <button 
              @click="handleLogout"
              class="w-full flex items-center justify-between p-4 hover:bg-[#E74C3C]/20 transition-colors text-left text-red-400"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#E74C3C]/20 text-[#E74C3C] flex items-center justify-center">
                  <Icon icon="heroicons:arrow-left-on-rectangle-20-solid" class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-xs font-bold text-white">Keluar (Logout)</div>
                  <div class="text-[10px] text-sky-200">Keluar dari sesi aplikasi saat ini</div>
                </div>
              </div>
              <Icon icon="heroicons:chevron-right-20-solid" class="w-4 h-4 text-sky-300" />
            </button>

          </div>
        </div>

        <!-- Dynamic Content Modal / Expand Section based on selected menu -->
        <div v-if="activeMenu" class="bg-[#1b4f72] border border-[#3498DB]/30 rounded-3xl p-5 space-y-4 shadow-md animate-fadeIn">
          
          <!-- View: Informasi Pribadi -->
          <div v-if="activeMenu === 'info'" class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-[#F4D03F] uppercase tracking-wider">Detail Informasi Pribadi</h4>
              <button @click="activeMenu = null" class="text-xs text-sky-300 hover:text-white">Tutup ✕</button>
            </div>
            <div class="space-y-3 text-xs">
              <div>
                <span class="text-[10px] text-sky-300 uppercase block">Nama Lengkap</span>
                <span class="font-medium text-white">{{ user?.name || '-' }}</span>
              </div>
              <div>
                <span class="text-[10px] text-sky-300 uppercase block">Email Cabang</span>
                <span class="font-medium text-white">{{ user?.email || '-' }}</span>
              </div>
              <div>
                <span class="text-[10px] text-sky-300 uppercase block">Kantor Cabang</span>
                <span class="font-medium text-white">JNE Express Cabang Utama Surabaya</span>
              </div>
              <div>
                <span class="text-[10px] text-sky-300 uppercase block">Role / Divisi</span>
                <span class="font-medium text-white">{{ user?.role || 'General Affair & Ticketing Support' }}</span>
              </div>
            </div>
          </div>

          <!-- View: Ubah Password -->
          <div v-if="activeMenu === 'password'" class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-[#F4D03F] uppercase tracking-wider">Form Ubah Password</h4>
              <button @click="activeMenu = null" class="text-xs text-sky-300 hover:text-white">Tutup ✕</button>
            </div>
            
            <form @submit.prevent="submitPasswordChange" class="space-y-3">
              <div>
                <label class="block text-[10px] uppercase text-sky-300 mb-1 font-semibold">Password Lama</label>
                <input 
                  type="password" 
                  v-model="passwordForm.old_password" 
                  placeholder="Masukkan password lama"
                  class="w-full bg-[#154360] border border-[#3498DB]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F4D03F]"
                  required
                />
              </div>
              <div>
                <label class="block text-[10px] uppercase text-sky-300 mb-1 font-semibold">Password Baru</label>
                <input 
                  type="password" 
                  v-model="passwordForm.new_password" 
                  placeholder="Masukkan password baru"
                  class="w-full bg-[#154360] border border-[#3498DB]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F4D03F]"
                  required
                />
              </div>
              <div>
                <label class="block text-[10px] uppercase text-sky-300 mb-1 font-semibold">Konfirmasi Password Baru</label>
                <input 
                  type="password" 
                  v-model="passwordForm.confirm_password" 
                  placeholder="Ulangi password baru"
                  class="w-full bg-[#154360] border border-[#3498DB]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F4D03F]"
                  required
                />
              </div>
              <div class="pt-2">
                <button 
                  type="submit" 
                  :disabled="isLoading"
                  class="w-full bg-[#F4D03F] text-[#154360] font-bold text-xs py-2.5 rounded-xl shadow-md hover:bg-[#F39C12] hover:text-white transition-colors uppercase tracking-wider disabled:opacity-50"
                >
                  {{ isLoading ? 'MENYIMPAN...' : 'SIMPAN PASSWORD BARU' }}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import apiClient from '../services/ApiClient';
import AuthService from '../services/AuthService';
import type { User } from '../types';

const router = useRouter();
const isSidebarOpen = ref<boolean>(false);
const activeMenu = ref<'info' | 'password' | null>(null);
const isLoading = ref<boolean>(false);

// State data user langsung diambil dari session/localStorage via AuthService
const user = ref<User | null>(AuthService.getUser());

// Inisial untuk avatar huruf pertama
const userAvatarLetter = computed(() => {
  return user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'S';
});

// Form state untuk endpoint /changePassword (old_password & new_password)
const passwordForm = ref({
  old_password: '',
  new_password: '',
  confirm_password: ''
});

// Mengirim request ke endpoint POST /changePassword
const submitPasswordChange = async () => {
  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    alert('Password baru dan konfirmasi password tidak cocok!');
    return;
  }

  isLoading.value = true;
  try {
    const response = await apiClient.post('/changePassword', {
      old_password: passwordForm.value.old_password,
      new_password: passwordForm.value.new_password
    });

    if (response.data && response.data.status === 'success') {
      alert(response.data.message || 'Password berhasil diperbarui!');
      passwordForm.value = { old_password: '', new_password: '', confirm_password: '' };
      activeMenu.value = null;
    }
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui password.';
    alert(errorMsg);
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin keluar dari aplikasi?')) {
    AuthService.logout(); // Menggunakan fungsi logout dari AuthService agar penyimpanan session bersih
    router.push('/login');
  }
};
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