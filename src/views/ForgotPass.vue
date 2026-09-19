<!-- src/views/ForgotPass.vue -->
<template>
  <div class="min-h-screen bg-[#1b4f72] text-white flex justify-center items-center p-0">
    <div class="w-full h-screen .sm:h-[844px] sm:max-w-md bg-[#154360] relative flex flex-col shadow-2xl justify-between p-6 overflow-y-auto no-scrollbar">
      
      <!-- Tombol Kembali / Header -->
      <div class="space-y-2 pt-1">
        <button 
          @click="router.go(-1)" 
          class="w-10 h-10 rounded-2xl bg-[#3498DB]/20 border border-[#3498DB]/40 flex items-center justify-center text-white mb-4 hover:bg-[#3498DB]/30 transition-colors shadow"
        >
          <Icon icon="heroicons:arrow-left-20-solid" class="w-5 h-5" />
        </button>
        <p class="text-[10px] uppercase font-bold tracking-wider text-[#F4D03F]">PEMULIHAN AKUN</p>
        <h1 class="text-2xl font-black tracking-tight text-white">Lupa Kata Sandi?</h1>
        <p class="text-xs text-sky-200">
          {{ step === 1 ? 'Masukkan email akun Anda untuk menerima kode verifikasi PIN.' : 'Masukkan 4 digit PIN yang telah dikirimkan ke:' }}
        </p>
      </div>

      <!-- Alert Error / Success -->
      <div v-if="errorMessage" class="my-3 p-3 bg-[#E74C3C]/20 border-l-4 border-[#E74C3C] rounded-r-xl flex items-center gap-3">
        <Icon icon="heroicons:exclamation-triangle-20-solid" class="w-5 h-5 text-[#E74C3C] shrink-0" />
        <p class="text-xs text-red-200 font-medium">{{ errorMessage }}</p>
      </div>

      <!-- STEP 1: Input Email -->
      <div v-if="step === 1" class="space-y-4 my-auto">
        <form @submit.prevent="handleSendPin" class="space-y-4">
          <div class=".space-y-1">
            <label class="text-xs font-semibold text-sky-200">Email Terdaftar</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-sky-300">
                <Icon icon="heroicons:envelope-20-solid" class="w-4 h-4" />
              </span>
              <input
                v-model="email"
                type="email"
                required
                placeholder="nama@jne.co.id"
                class="w-full pl-10 pr-4 py-3 bg-[#1b4f72] border border-[#3498DB]/40 rounded-xl text-xs text-white placeholder-sky-300/50 focus:outline-none focus:border-[#F4D03F] transition-all shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full mt-4 py-3.5 bg-[#3498DB] hover:bg-[#2980b9] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#3498DB]/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Icon v-if="isLoading" icon="heroicons:arrow-path-20-solid" class="w-4 h-4 animate-spin" />
            <span>{{ isLoading ? 'Mengirim...' : 'Kirim Kode PIN' }}</span>
          </button>
        </form>
      </div>

      <!-- STEP 2: Verifikasi PIN & Reset -->
      <div v-if="step === 2" class="space-y-6 my-auto">
        <div>
          <p class="text-xs text-sky-200">Kode verifikasi dikirim ke:</p>
          <p class="text-sm font-bold text-[#F4D03F] mt-0.5 truncate">{{ email }}</p>
        </div>

        <form @submit.prevent="handleVerifyPin" class="space-y-6">
          <!-- Input 4 Digit PIN -->
          <div class="flex justify-between gap-3">
            <input
              v-for="(digit, index) in pinDigits"
              :key="index"
              :ref="el => pinInputRefs[index] = el as HTMLInputElement"
              v-model="pinDigits[index]"
              type="text"
              maxlength="1"
              inputmode="numeric"
              @input="handlePinInput(index, $event)"
              @keydown.backspace="handlePinBackspace(index)"
              class="w-14 h-14 text-center text-xl font-black bg-[#1b4f72] border border-[#3498DB]/40 rounded-2xl text-white focus:outline-none focus:border-[#F4D03F] shadow-inner transition-all"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading || !isPinComplete"
            class="w-full py-3.5 bg-[#3498DB] hover:bg-[#2980b9] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#3498DB]/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Icon v-if="isLoading" icon="heroicons:arrow-path-20-solid" class="w-4 h-4 animate-spin" />
            <span>{{ isLoading ? 'Memproses...' : 'Verifikasi & Reset' }}</span>
          </button>
        </form>

        <!-- Cooldown & Resend -->
        <div class="text-center text-xs text-sky-200 space-y-1">
          <p v-if="cooldown > 0">
            Kirim ulang kode dalam <span class="font-bold text-[#F4D03F]">{{ cooldown }}s</span>
          </p>
          <button
            @click="handleSendPin"
            :disabled="cooldown > 0"
            :class="[
              'font-bold transition-colors',
              cooldown > 0 ? 'text-sky-400/50 cursor-not-allowed' : 'text-[#F4D03F] hover:underline cursor-pointer'
            ]"
          >
            Kirim Ulang PIN (Resend)
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import AuthService from '../services/AuthService';
import { getErrorMessage } from '../utils/errorHandler'; // Menggunakan helper error handler

const router = useRouter();

const step = ref<number>(1);
const email = ref<string>('');
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>('');
const cooldown = ref<number>(0);
let timer: any = null;

// State untuk 4 digit PIN
const pinDigits = ref<string[]>(['', '', '', '']);
const pinInputRefs = ref<HTMLInputElement[]>([]);

// Cek apakah 4 digit PIN sudah terisi semua
const isPinComplete = computed(() => {
  return pinDigits.value.every(digit => digit.length === 1);
});

// Mulai timer cooldown Resend
const startCooldown = () => {
  cooldown.value = 60;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (cooldown.value > 0) {
      cooldown.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

// Langkah 1: Kirim / Request PIN ke Email
const handleSendPin = async (): Promise<void> => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    // Menggunakan AuthService terpusat
    await AuthService.forgotPassword(email.value);
    step.value = 2;
    startCooldown();
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Gagal mengirim instruksi pemulihan.');
  } finally {
    isLoading.value = false;
  }
};

// Logika PIN: Pindah otomatis ke kotak berikutnya saat diketik
const handlePinInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  if (value && index < 3) {
    pinInputRefs.value[index + 1]?.focus();
  }
};

// Logika PIN: Mundur ke kotak sebelumnya saat tombol Backspace ditekan
const handlePinBackspace = (index: number) => {
  if (!pinDigits.value[index] && index > 0) {
    pinInputRefs.value[index - 1]?.focus();
  }
};

// Langkah 2: Verifikasi PIN
const handleVerifyPin = async (): Promise<void> => {
  const fullPin = pinDigits.value.join('');
  if (fullPin.length < 4) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const pinCode = Number(fullPin);
    await AuthService.verifyPin(email.value, pinCode);
    
    // Jika verifikasi sukses, arahkan ke halaman buat kata sandi baru atau dashboard
    router.push('/reset-password-form'); 
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Kode PIN yang Anda masukkan salah atau sudah kedaluwarsa.');
  } finally {
    isLoading.value = false;
  }
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
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