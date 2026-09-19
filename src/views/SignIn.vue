<!-- src/views/SignIn.vue -->
<template>
  <div class="min-h-screen bg-[#1b4f72] text-white flex justify-center items-center p-0">
    <div class="w-full h-screen sm:max-w-md bg-[#154360] relative flex flex-col justify-between shadow-2xl overflow-y-auto px-6 py-12 no-scrollbar">
      
      <!-- Top Section: Header / Brand Logo -->
      <div class="space-y-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-[#3498DB]/20 border border-[#3498DB]/40 text-[#F4D03F] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <Icon icon="heroicons:lock-closed-20-solid" class="w-8 h-8" />
          </div>
          <h1 class="text-2xl font-black text-white tracking-tight">Service.Now</h1>
          <p class="text-xs text-sky-200 mt-1 font-medium">Sistem Permintaan Perbaikan<br/><span class="text-xs text-[#F4D03F] font-semibold" >Asset dan Armada</span></p>
        </div>

        <!-- Alert Error Banner -->
        <div v-if="errorMessage" class="p-4 bg-[#E74C3C]/10 border-l-4 border-[#E74C3C] rounded-r-2xl flex items-center gap-3">
          <Icon icon="heroicons:exclamation-triangle-20-solid" class="w-5 h-5 text-[#E74C3C] shrink-0" />
          <p class="text-xs text-red-200 font-medium">{{ errorMessage }}</p>
        </div>

        <!-- Form Sign In -->
        <form @submit.prevent="handleSignIn" class="space-y-4">
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
                placeholder="Masukkan kata sandi"
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
            
            <!-- Tautan Lupa Kata Sandi -->
            <div class="flex items-center justify-between pt-2">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  v-model="form.remember_me"
                  type="checkbox"
                  class="w-4 h-4 rounded bg-[#1b4f72] border-[#3498DB]/40 text-[#3498DB] focus:ring-[#3498DB] focus:ring-offset-[#154360] cursor-pointer"
                />
                <span class="text-xs text-sky-200 font-medium">Ingat Saya</span>
              </label>
              <router-link to="/forgot-password" class="text-xs text-[#F4D03F] font-semibold hover:underline">
                Lupa kata sandi?
              </router-link>
            </div>
          </div>

          <!-- Tombol Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3.5 px-4 bg-[#3498DB] text-white rounded-2xl font-bold shadow-lg shadow-indigo-900/50 hover:bg-[#2980b9] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center mt-2 uppercase tracking-wider text-xs"
          >
            <Icon v-if="isLoading" icon="heroicons:arrow-path-20-solid" class="w-5 h-5 animate-spin mr-2" />
            <span>{{ isLoading ? 'Memproses...' : 'Masuk' }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-[#3498DB]/30"></div>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-[#154360] px-3 text-sky-300 font-bold tracking-wider text-[10px]">Atau masuk dengan</span>
          </div>
        </div>

        <!-- Google Sign In Button -->
        <div class="flex justify-center">
          <GoogleLogin :callback="handleGoogleLogin" />
        </div>
      </div>

      <!-- Bottom Section: Link Registrasi Akun Baru -->
      <div class="mt-8 text-center">
        <p class="text-xs text-sky-300">
          Belum punya akun?
          <router-link to="/signup" class="text-[#F4D03F] font-bold hover:underline ml-1">
            Daftar di sini
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
import { getErrorMessage } from '../utils/errorHandler';
import AuthService from '../services/AuthService';

const router = useRouter();

const form = ref({
  email: '',
  password: '',
  remember_me: false
});

const showPassword = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>('');

const handleSignIn = async (): Promise<void> => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await AuthService.login(form.value.email, form.value.password, form.value.remember_me);
    AuthService.setSession(response.token, response.user);
    router.push('/dashboard');
  } catch (error) {
   errorMessage.value = getErrorMessage(error, 'Gagal masuk. Periksa kembali email dan sandi Anda.');
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin: CallbackTypes.CredentialCallback = async (response) => {
  if (!response.credential) {
    errorMessage.value = 'Gagal mengambil kredensial Google.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const res = await AuthService.googleLogin(response.credential);
    AuthService.setSession(res.token, res.user);
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Terjadi kesalahan saat masuk dengan Google.');
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