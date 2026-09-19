<!-- src/views/Onboarding.vue -->
<template>
  <div class="min-h-screen bg-[#1b4f72] text-white flex justify-center items-center p-0">
    <div class="w-full h-screen sm:h-[844px] sm:max-w-md bg-[#154360] relative flex flex-col justify-between shadow-2xl overflow-hidden px-6 py-8">
      
      <!-- Tombol Lewati -->
      <div class="flex justify-end">
        <button 
          @click="finishOnboarding"
          class="text-xs font-bold text-sky-300 hover:text-white transition-colors uppercase tracking-wider"
        >
          Lewati
        </button>
      </div>

      <!-- Konten Slide -->
      <div class="flex-1 flex flex-col justify-center items-center text-center my-8">
        <div class="w-48 h-48 mb-8 flex items-center justify-center bg-[#3498DB]/20 border border-[#3498DB]/40 rounded-full text-[#F4D03F] shadow-inner">
          <Icon :icon="currentSlideData.icon" class="w-24 h-24" />
        </div>
        
        <h2 class="text-2xl font-black text-white mb-3 tracking-tight">
          {{ currentSlideData.title }}
        </h2>
        <p class="text-sky-200 text-xs leading-relaxed max-w-xs font-medium">
          {{ currentSlideData.description }}
        </p>
      </div>

      <!-- Navigasi & Indikator -->
      <div class="space-y-6">
        <!-- Dots Indicator -->
        <div class="flex justify-center space-x-2">
          <span
            v-for="(_, index) in slides"
            :key="index"
            class="h-2 rounded-full transition-all duration-300"
            :class="index === currentSlide ? 'w-8 bg-[#F4D03F]' : 'w-2 bg-[#3498DB]/40'"
          />
        </div>

        <!-- Tombol Aksi -->
        <div class="space-y-3">
          <button
            @click="nextSlide"
            class="w-full py-3.5 px-4 bg-[#3498DB] text-white rounded-2xl font-bold shadow-lg shadow-indigo-900/50 hover:bg-[#2980b9] active:scale-[0.98] transition-all uppercase tracking-wider text-xs"
          >
            {{ isLastSlide ? 'Mulai Sekarang' : 'Lanjut' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

interface Slide {
  title: string;
  description: string;
  icon: string;
}

const router = useRouter();
const currentSlide = ref<number>(0);

const slides: Slide[] = [
  {
    title: 'Kelola Tiket dengan Mudah',
    description: 'Pantau status permohonan dan kendala Anda secara real-time dalam satu aplikasi.',
    icon: 'heroicons:ticket-20-solid'
  },
  {
    title: 'Proses Cepat & Transparan',
    description: 'Dapatkan notifikasi dan pembaruan langsung dari tim dukungan kami.',
    icon: 'heroicons:bolt-20-solid'
  },
  {
    title: 'Siap Dimulai?',
    description: 'Masuk dengan akun Anda untuk mulai mengelola tiket pekerjaan Anda.',
    icon: 'heroicons:rocket-launch-20-solid'
  }
];

const currentSlideData = computed<Slide>(() => (slides[currentSlide.value] ?? slides[0]) as Slide);

const isLastSlide = computed<boolean>(() => currentSlide.value === slides.length - 1);

const nextSlide = (): void => {
  if (isLastSlide.value) {
    finishOnboarding();
  } else {
    currentSlide.value++;
  }
};

const finishOnboarding = (): void => {
  router.push('/login');
};
</script>