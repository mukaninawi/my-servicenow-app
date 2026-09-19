<!-- src/views/ScanLocation.vue -->
<template>
  <div class="min-h-screen bg-gray-900 text-white max-w-md mx-auto flex flex-col justify-between relative overflow-hidden">
    <!-- Header App Bar -->
    <header class="p-4 flex items-center justify-between bg-gray-900/80 backdrop-blur-md z-10 border-b border-gray-800">
      <button 
        @click="goBack" 
        class="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors"
      >
        <Icon icon="heroicons:chevron-left-20-solid" class="w-5 h-5" />
      </button>
      <h1 class="text-sm font-bold tracking-wide">Pindai QR Lokasi</h1>
      <div class="w-9"></div> <!-- Placeholder penyeimbang layout -->
    </header>

    <!-- Scanner Viewport Container -->
    <main class="flex-1 flex flex-col items-center justify-center p-6 relative">
      <!-- Status Pesan Error Kamera -->
      <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl text-center max-w-xs mb-6">
        <Icon icon="heroicons:exclamation-triangle-20-solid" class="w-8 h-8 text-red-400 mx-auto mb-2" />
        <p class="text-xs text-red-200 font-medium">{{ errorMessage }}</p>
        <button 
          @click="startScanner" 
          class="mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Kamera Video Preview & Framing Area -->
      <div v-show="!errorMessage" class="relative w-64 h-64 rounded-3xl overflow-hidden border-2 border-indigo-500/50 shadow-2xl bg-black">
        <video ref="videoRef" class="w-full h-full object-cover"></video>

        <!-- QR Overlay Scanner Animation -->
        <div class="absolute inset-0 border-2 border-indigo-400 rounded-3xl pointer-events-none flex flex-col justify-between p-2">
          <!-- Laser Animation Line -->
          <div class="w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-scan shadow-[0_0_15px_#818cf8]"></div>
        </div>
      </div>

      <p class="text-xs text-gray-400 text-center mt-6 max-w-xs">
        Arahkan kamera ke kode QR lokasi perangkat atau ruangan untuk mendaftarkan tiket secara otomatis.
      </p>

      <!-- Informasi Hasil Scan Sementara -->
      <div v-if="scannedCode" class="mt-4 p-3 bg-indigo-950/80 border border-indigo-500/30 rounded-xl flex items-center gap-3">
        <Icon icon="heroicons:check-circle-20-solid" class="w-5 h-5 text-indigo-400 shrink-0" />
        <div class="min-w-0">
          <p class="text-[10px] text-indigo-300 font-medium uppercase tracking-wider">Lokasi Terdeteksi</p>
          <p class="text-xs font-bold text-white truncate">{{ scannedCode }}</p>
        </div>
      </div>
    </main>

    <!-- Bottom Actions -->
    <footer class="p-6 bg-gray-900/90 border-t border-gray-800 z-10 flex flex-col gap-3">
      <button 
        @click="confirmScan"
        :disabled="!scannedCode"
        :class="[
          'w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg',
          scannedCode 
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30' 
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        ]"
      >
        <span>Gunakan Lokasi Ini</span>
        <Icon icon="heroicons:arrow-right-20-solid" class="w-4 h-4" />
      </button>

      <button 
        @click="goBack" 
        class="w-full py-3 text-xs font-semibold text-gray-400 hover:text-white transition-colors text-center"
      >
        Batal
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

const route = useRoute();
const router = useRouter();

const videoRef = ref<HTMLVideoElement | null>(null);
const scannedCode = ref<string>((route.params.code as string) || '');
const errorMessage = ref<string>('');
const isScanning = ref<boolean>(false);
let codeReader: BrowserMultiFormatReader | null = null;

const startScanner = async (): Promise<void> => {
  errorMessage.value = '';
  isScanning.value = true;
  codeReader = new BrowserMultiFormatReader();

  try {
    const videoInputDevices = await codeReader.listVideoInputDevices();
    if (!videoInputDevices || videoInputDevices.length === 0) {
      alert('Kamera tidak ditemukan.');
      isScanning.value = false;
      return;
    }

    const backCamera = videoInputDevices.find(d => 
      d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear')
    );

    // Gunakan optional chaining (?.) dan fallback agar tidak error TS2532
    const selectedDeviceId = backCamera?.deviceId || videoInputDevices[0]?.deviceId;

    if (!selectedDeviceId) {
      alert('ID Perangkat kamera tidak valid.');
      isScanning.value = false;
      return;
    }

    if (videoRef.value) {
      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.value,
        (result, error) => {
          if (result) {
            scannedCode.value = result.getText();
          }
          if (error && !(error instanceof NotFoundException)) {
            console.error('QR Scan Error:', error);
          }
        }
      );
    }
  } catch (err) {
    errorMessage.value = 'Izin akses kamera ditolak atau kamera tidak dapat diakses.';
    isScanning.value = false;
    console.error('Camera Init Error:', err);
  }
};

const stopScanner = (): void => {
  if (codeReader) {
    codeReader.reset();
    codeReader = null;
  }
  isScanning.value = false;
};

const confirmScan = (): void => {
  if (!scannedCode.value) return;

  // Kembali ke form buat tiket dengan membawa parameter lokasi hasil scan
  router.push({
    path: '/ticket/create',
    query: { location: scannedCode.value }
  });
};

const goBack = (): void => {
  router.back();
};

onMounted(() => {
  startScanner();
});

onUnmounted(() => {
  stopScanner();
});
</script>

<style scoped>
@keyframes scan {
  0% {
    top: 0%;
  }
  50% {
    top: 100%;
  }
  100% {
    top: 0%;
  }
}

.animate-scan {
  position: absolute;
  animation: scan 2.5s ease-in-out infinite;
}
</style>