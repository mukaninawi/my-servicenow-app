<!-- src/views/SignUp.vue -->
<template>
  <div class="min-h-screen bg-[#1b4f72] text-white flex justify-center items-center p-0">
    <div class="w-full h-screen sm:h-[844px] sm:max-w-md bg-[#154360] relative flex flex-col justify-between shadow-2xl overflow-y-auto px-6 py-10 no-scrollbar">
      
      <!-- Top Section: Header -->
      <div class="space-y-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-[#3498DB]/20 border border-[#3498DB]/40 text-[#F4D03F] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <Icon icon="heroicons:user-plus-20-solid" class="w-8 h-8" />
          </div>
          <h1 class="text-2xl font-black text-white tracking-tight">Buat Akun Baru</h1>
          <p class="text-xs text-sky-200 mt-1 font-medium">Lengkapi data diri Anda untuk mendaftar</p>
        </div>

        <!-- Alert Error -->
        <div v-if="errorMessage" class="p-4 bg-[#E74C3C]/10 border-l-4 border-[#E74C3C] rounded-r-2xl flex items-center gap-3">
          <Icon icon="heroicons:exclamation-triangle-20-solid" class="w-5 h-5 text-[#E74C3C] shrink-0" />
          <p class="text-xs text-red-200 font-medium">{{ errorMessage }}</p>
        </div>

        <!-- Form Signup -->
        <form @submit.prevent="handleSignUp" class="space-y-4">
          <!-- Nama Lengkap -->
          <div>
            <label for="name" class="block text-xs font-bold text-sky-200 uppercase tracking-wider mb-2">Nama Lengkap</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-300">
                <Icon icon="heroicons:user-20-solid" class="w-5 h-5" />
              </span>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                placeholder="Nama Lengkap"
                class="w-full pl-10 pr-4 py-3 bg-[#1b4f72] border border-[#3498DB]/40 rounded-2xl text-sm text-white placeholder-sky-300/60 focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] transition-all"
              />
            </div>
          </div>

          <!-- Email Input -->
          <div>
            <label for="email" class="block text-xs font-bold text-sky-200 uppercase tracking-wider mb-2">Email</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-300">
                <Icon icon="heroicons:envelope-20-solid" class="w-5 h-5" />
              </span>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="nama@email.com"
                class="w-full pl-10 pr-4 py-3 bg-[#1b4f72] border border-[#3498DB]/40 rounded-2xl text-sm text-white placeholder-sky-300/60 focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] transition-all"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-xs font-bold text-sky-200 uppercase tracking-wider mb-2">Kata Sandi</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-300">
                <Icon icon="heroicons:key-20-solid" class="w-5 h-5" />
              </span>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Minimal 8 karakter"
                class="w-full pl-10 pr-10 py-3 bg-[#1b4f72] border border-[#3498DB]/40 rounded-2xl text-sm text-white placeholder-sky-300/60 focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] transition-all"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-sky-300 hover:text-white"
              >
                <Icon :icon="showPassword ? 'heroicons:eye-slash-20-solid' : 'heroicons:eye-20-solid'" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Konfirmasi Password Input -->
          <div>
            <label for="confirmPassword" class="block text-xs font-bold text-sky-200 uppercase tracking-wider mb-2">Konfirmasi Kata Sandi</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-300">
                <Icon icon="heroicons:shield-check-20-solid" class="w-5 h-5" />
              </span>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Ulangi kata sandi"
                class="w-full pl-10 pr-4 py-3 bg-[#1b4f72] border border-[#3498DB]/40 rounded-2xl text-sm text-white placeholder-sky-300/60 focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] transition-all"
              />
            </div>
          </div>

          <!-- Tombol Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3.5 px-4 bg-[#3498DB] text-white rounded-2xl font-bold shadow-lg shadow-indigo-900/50 hover:bg-[#2980b9] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center mt-2 uppercase tracking-wider text-xs"
          >
            <Icon v-if="isLoading" icon="heroicons:arrow-path-20-solid" class="w-5 h-5 animate-spin mr-2" />
            <span>{{ isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang' }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-[#3498DB]/30"></div>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-[#154360] px-3 text-sky-300 font-bold tracking-wider text-[10px]">Atau daftar dengan</span>
          </div>
        </div>

        <!-- Google Sign Up -->
        <div class="flex justify-center">
          <GoogleLogin :callback="handleGoogleLogin" />
        </div>
      </div>

      <!-- Link ke Login -->
      <div class="mt-8 text-center">
        <p class="text-xs text-sky-300">
          Sudah memiliki akun?
          <router-link to="/login" class="text-[#F4D03F] font-bold hover:underline ml-1">
            Masuk di sini
          </router-link>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { GoogleLogin, type CallbackTypes } from 'vue3-google-login';
import AuthService from '../services/AuthService';
import { getErrorMessage } from '../utils/errorHandler';

const router = useRouter();

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const showPassword = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>('');

const handleSignUp = async (): Promise<void> => {
  errorMessage.value = '';

  if (!form.value.name || !form.value.email || !form.value.password) {
    errorMessage.value = 'Semua bidang wajib diisi.';
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = 'Konfirmasi kata sandi tidak cocok.';
    return;
  }

  if (form.value.password.length < 8) {
    errorMessage.value = 'Kata sandi minimal harus 8 karakter.';
    return;
  }

  isLoading.value = true;

  try {
    const data = await AuthService.signUp(
      form.value.name,
      form.value.email,
      form.value.password
    );

    AuthService.setSession(data.token, data.user);
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin: CallbackTypes.CredentialCallback = async (response) => {
  if (!response.credential) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const res = await AuthService.googleLogin(response.credential);
    AuthService.setSession(res.token, res.user);
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = 'Gagal mendaftar dengan akun Google.';
  } finally {
    isLoading.value = false;
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