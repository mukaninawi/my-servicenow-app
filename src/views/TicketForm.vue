<!-- src/views/TicketForm.vue -->
<template>
  <div class="min-h-screen bg-[#1b4f72] text-white flex justify-center items-center p-0">
    <div class="w-full h-screen sm:h-[844px] sm:max-w-md bg-[#154360] relative flex flex-col justify-between shadow-2xl overflow-y-auto px-6 py-6 no-scrollbar">
      
      <!-- Header Fixed/Top -->
      <div class="flex items-center justify-between pb-4 border-b border-[#3498DB]/20 sticky top-0 bg-[#154360] z-20">
        <div class="flex items-center gap-3">
          <router-link 
            to="/dashboard" 
            class="w-10 h-10 rounded-2xl bg-[#3498DB]/20 border border-[#3498DB]/40 flex items-center justify-center text-white hover:bg-[#3498DB]/35 transition-colors shadow-md"
          >
            <Icon icon="heroicons:home-20-solid" class="w-5 h-5 text-[#F4D03F]" />
          </router-link>
          <h3 class="text-base font-black tracking-tight text-white">{{ isArmada ? 'Servis Armada' : 'Perbaikan Fasilitas' }}</h3>
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-[#F4D03F] bg-[#1b4f72] px-3 py-1.5 rounded-full border border-[#3498DB]/30 shadow-inner">
          {{ isArmada ? 'Modul Armada' : 'Modul Fasilitas' }}
        </span>
      </div>

      <!-- Modal / Overlay Scanner QR Code Lokasi -->
      <div v-if="isScanning" class="absolute inset-0 bg-black/90 z-50 flex flex-col justify-between p-6">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-white">Arahkan Kamera ke QR Lokasi</h4>
          <button @click="stopScanner" class="p-2 rounded-xl bg-gray-800 text-white">
            <Icon icon="heroicons:x-mark-20-solid" class="w-6 h-6" />
          </button>
        </div>

        <div class="relative w-64 h-64 mx-auto rounded-3xl overflow-hidden border-2 border-indigo-500 shadow-2xl bg-black">
          <video ref="scannerVideoRef" class="w-full h-full object-cover"></video>
          <div class="absolute inset-0 border-2 border-indigo-400 rounded-3xl pointer-events-none flex flex-col justify-between p-2">
            <div class="w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-scan shadow-[0_0_15px_#818cf8]"></div>
          </div>
        </div>

        <p class="text-xs text-center text-sky-200">Pindai kode QR pada ruangan atau kendaraan untuk mengisi lokasi otomatis.</p>
      </div>

      <!-- Modal Pilih Lokasi Manual -->
      <div v-if="showLocationModal" class="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
        <div class="bg-[#154360] border border-[#3498DB]/40 rounded-3xl w-full max-h-[80vh] flex flex-col p-5 shadow-2xl">
          <div class="flex items-center justify-between pb-3 border-b border-[#3498DB]/20">
            <h4 class="text-sm font-bold text-white">Pilih Lokasi Cabang</h4>
            <button @click="showLocationModal = false" class="text-sky-300 hover:text-white">✕</button>
          </div>
          
          <div class="overflow-y-auto flex-1 my-3 space-y-2 no-scrollbar">
            <div 
              v-for="loc in locationList" 
              :key="loc.code"
              @click="selectLocation(loc)"
              class="p-3 bg-[#1b4f72] border border-[#3498DB]/20 hover:border-[#F4D03F] rounded-2xl cursor-pointer transition-all"
            >
              <div class="text-xs font-bold text-white">{{ loc.name }}</div>
              <div class="text-[10px] text-sky-300/80">{{ loc.address }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 py-4 space-y-5 pb-24">
        
        <!-- Card User & Lokasi -->
        <div class="bg-[#1b4f72] border border-[#3498DB]/30 rounded-3xl p-4 shadow-lg flex items-center gap-4 relative overflow-hidden">
          <div class="w-12 h-12 bg-[#3498DB]/20 border border-[#3498DB]/40 rounded-2xl flex items-center justify-center text-[#F4D03F] shrink-0">
            <Icon icon="heroicons:user-circle-20-solid" class="w-7 h-7" />
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-sm font-bold text-white truncate">{{ currentUser?.name || 'Karyawan' }}</h4>
            <div class="flex items-center justify-between mt-1">
              <div class="flex items-center gap-1.5 text-sky-200 text-xs truncate pr-2">
                <Icon icon="heroicons:map-pin-20-solid" class="w-4 h-4 text-[#3498DB] shrink-0" />
                <span class="truncate font-medium">{{ ticket.location }}</span>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <button 
                  type="button" 
                  @click="openLocationModal" 
                  class="px-2 py-1 bg-[#1b4f72] border border-[#3498DB]/50 hover:bg-[#3498DB]/30 text-white text-[10px] font-bold rounded-xl shadow transition-all"
                >
                  Manual
                </button>
                <button 
                  type="button" 
                  @click="startScanner" 
                  class="px-2 py-1 bg-[#3498DB] hover:bg-[#2980b9] text-white text-[10px] font-bold rounded-xl flex items-center gap-1 shadow transition-all"
                >
                  <Icon icon="heroicons:qr-code-20-solid" class="w-3.5 h-3.5" />
                  Scan
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Alert Pesan Error / Sukses -->
        <div v-if="errorMessage" class="p-3 bg-[#E74C3C]/10 border-l-4 border-[#E74C3C] rounded-r-xl flex items-center gap-2">
          <Icon icon="heroicons:exclamation-triangle-20-solid" class="w-5 h-5 text-[#E74C3C] shrink-0" />
          <p class="text-xs text-red-200 font-medium">{{ errorMessage }}</p>
        </div>

        <div v-if="successMessage" class="p-3 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r-xl flex items-center gap-2">
          <Icon icon="heroicons:check-circle-20-solid" class="w-5 h-5 text-emerald-400 shrink-0" />
          <p class="text-xs text-emerald-200 font-medium">{{ successMessage }}</p>
        </div>

        <!-- Form Pembuatan Tiket -->
        <form @submit.prevent="submitTicket" class="space-y-4">
          
          <!-- Kategori Layanan -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-sky-200">Kategori Layanan</label>
            <div class="relative">
              <select 
                v-model="selectedCategory" 
                @change="onCategoryChange" 
                required
                class="w-full px-4 py-3 bg-[#1b4f72] border border-[#3498DB]/40 rounded-2xl text-xs text-white focus:outline-none focus:border-[#F4D03F] shadow-inner transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled selected>Pilih Kategori Fasilitas</option>
                <option v-for="cat in categories" :key="cat.CATEGORY_ID" :value="cat.CATEGORY_NAME">
                  {{ cat.CATEGORY_NAME }}
                </option>
              </select>
              <span class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-sky-300">
                <Icon icon="heroicons:chevron-down-20-solid" class="w-4 h-4" />
              </span>
            </div>
          </div>

          <!-- Input Khusus NOPOL (Hanya tampil jika kategori == 'Armada') -->
          <div v-if="isArmada" class="space-y-1.5 animate-fadeIn">
            <label class="text-xs font-bold uppercase tracking-wider text-[#F4D03F]">NOPOL (Nomor Polisi Kendaraan)</label>
            <input 
              v-model="ticket.nopol" 
              type="text" 
              required
              placeholder="Contoh: L 1234 BZ" 
              maxlength="10"
              @input="ticket.nopol = ticket.nopol.toUpperCase()"
              class="w-full px-4 py-3 bg-[#1b4f72] border border-[#F4D03F]/50 rounded-2xl text-xs text-white uppercase tracking-wider font-bold placeholder-sky-300/50 focus:outline-none focus:border-[#F4D03F] shadow-inner transition-all"
            />
          </div>

          <!-- Judul Tiket -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-sky-200">Judul Tiket</label>
            <input 
              v-model="ticket.title" 
              type="text" 
              required 
              :placeholder="isArmada ? 'Contoh: Servis Rutin / Ganti Ban' : 'Contoh: AC Bocor di Ruang Meeting'" 
              class="w-full px-4 py-3 bg-[#1b4f72] border border-[#3498DB]/40 rounded-2xl text-xs text-white placeholder-sky-300/50 focus:outline-none focus:border-[#F4D03F] shadow-inner transition-all"
            />
          </div>

          <!-- Deskripsi Kendala -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-sky-200">Deskripsi Kendala</label>
            <textarea 
              v-model="ticket.description" 
              rows="3" 
              required
              :placeholder="isArmada ? 'Jelaskan keluhan mesin, servis, atau kondisi armada...' : 'Jelaskan kerusakan dan detail yang perlu diperbaiki...'"
              class="w-full px-4 py-3 bg-[#1b4f72] border border-[#3498DB]/40 rounded-2xl text-xs text-white placeholder-sky-300/50 focus:outline-none focus:border-[#F4D03F] shadow-inner transition-all resize-none"
            ></textarea>
          </div>

          <!-- Detail Lokasi Ruangan / Pool -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-sky-200">Detail Lokasi / Ruangan</label>
            <input 
              v-model="ticket.location_detail" 
              type="text" 
              placeholder="Contoh: Lantai 2, Pool Kendaraan Utama" 
              class="w-full px-4 py-3 bg-[#1b4f72] border border-[#3498DB]/40 rounded-2xl text-xs text-white placeholder-sky-300/50 focus:outline-none focus:border-[#F4D03F] shadow-inner transition-all"
            />
          </div>

          <!-- Upload Foto -->
          <div class="space-y-2 pt-1">
            <label class="text-xs font-bold uppercase tracking-wider text-sky-200">Lampiran Foto Bukti</label>
            
            <!-- Tombol Pemicu Utama -->
            <button
              type="button"
              @click="showPhotoOptionsModal = true"
              class="w-full p-4 bg-[#1b4f72] border border-dashed border-[#3498DB]/60 hover:border-[#F4D03F] rounded-2xl flex items-center justify-between transition-all group shadow-sm"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#3498DB]/20 text-[#3498DB] group-hover:text-[#F4D03F] flex items-center justify-center transition-colors">
                  <Icon icon="heroicons:camera-20-solid" class="w-5 h-5" />
                </div>
                <div class="text-left">
                  <span class="block text-xs font-bold text-white">Ambil Foto / Galeri</span>
                  <span class="text-[10px] text-sky-300/70">Kamera perangkat atau unggah file</span>
                </div>
              </div>
              <Icon icon="heroicons:chevron-right-20-solid" class="w-4 h-4 text-sky-300 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <!-- Hidden Inputs -->
            <!-- 1. Input Khusus Kamera -->
            <input
              ref="cameraInputRef"
              type="file"
              accept="image/*"
              capture="environment"
              class="hidden"
              @change="onFileSelected"
            />

            <!-- 2. Input Khusus Galeri -->
            <input
              ref="galleryInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onFileSelected"
            />

            <!-- Modal Action Sheet Opsi Foto -->
            <Transition name="fade">
              <div
                v-if="showPhotoOptionsModal"
                class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-4 sm:items-center"
                @click.self="showPhotoOptionsModal = false"
              >
                <div class="bg-[#153e5c] border border-[#3498DB]/30 w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
                  <div class="text-center pb-2 border-b border-sky-800/50">
                    <h3 class="text-sm font-bold text-white">Pilih Sumber Foto</h3>
                    <p class="text-[11px] text-sky-300/70">Pilih bagaimana Anda ingin mengunggah foto</p>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <!-- Opsi Kamera -->
                    <button
                      type="button"
                      @click="openCamera"
                      class="p-4 bg-[#1b4f72] hover:bg-[#21618c] border border-sky-500/30 rounded-2xl flex flex-col items-center gap-2 text-white transition-all active:scale-95"
                    >
                      <div class="w-10 h-10 rounded-full bg-sky-500/20 text-[#F4D03F] flex items-center justify-center">
                        <Icon icon="heroicons:camera-20-solid" class="w-6 h-6" />
                      </div>
                      <span class="text-xs font-semibold">Ambil Foto</span>
                    </button>

                    <!-- Opsi Galeri -->
                    <button
                      type="button"
                      @click="openGallery"
                      class="p-4 bg-[#1b4f72] hover:bg-[#21618c] border border-sky-500/30 rounded-2xl flex flex-col items-center gap-2 text-white transition-all active:scale-95"
                    >
                      <div class="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                        <Icon icon="heroicons:photo-20-solid" class="w-6 h-6" />
                      </div>
                      <span class="text-xs font-semibold">Buka Galeri</span>
                    </button>
                  </div>

                  <!-- Tombol Batal -->
                  <button
                    type="button"
                    @click="showPhotoOptionsModal = false"
                    class="w-full py-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-xs font-semibold hover:bg-red-500/30 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </Transition>

            <!-- Preview Foto -->
            <div v-if="ticket.photoPreview" class="relative mt-3 inline-block">
              <img 
                :src="ticket.photoPreview" 
                alt="Preview Foto" 
                class="w-24 h-24 object-cover rounded-2xl border-2 border-[#3498DB]/50 shadow-md" 
              />
              <button 
                type="button" 
                @click="removePhoto"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow hover:bg-red-700"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Fixed Bottom Submit Button -->
          <div class="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-[#154360]/90 backdrop-blur border-t border-[#3498DB]/20 z-30">
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3.5 px-4 bg-[#3498DB] text-white rounded-2xl font-bold shadow-lg shadow-indigo-900/50 hover:bg-[#2980b9] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center uppercase tracking-wider text-xs"
            >
              <Icon v-if="loading" icon="heroicons:arrow-path-20-solid" class="w-5 h-5 animate-spin mr-2" />
              <span>{{ loading ? 'Mengirim Tiket...' : (isArmada ? 'Kirim Servis Armada' : 'Kirim Tiket Perbaikan') }}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import ApiService from '../services/ApiService';
import AuthService from '../services/AuthService';

const router = useRouter();
const currentUser = ref<any>(AuthService.getUser());

const categories = ref<any[]>([]);
const selectedCategory = ref<string>('');
const locationList = ref<any[]>([]);
const showLocationModal = ref<boolean>(false);

const ticket = ref({
  title: '',
  nopol: '',
  category: '',
  description: '',
  location: 'Kantor Utama / Area Operasional',
  location_detail: '',
  photoFile: null as File | null,
  photoPreview: '' as string
});

const isArmada = computed(() => {
  return ticket.value.category.toLowerCase() === 'armada';
});

const fileInputRef = ref<HTMLInputElement | null>(null);
const loading = ref<boolean>(false);
const errorMessage = ref<string>('');
const successMessage = ref<string>('');

//Unggah Photo (camera / galeri)
const cameraInputRef = ref<HTMLInputElement | null>(null);
const galleryInputRef = ref<HTMLInputElement | null>(null);
const showPhotoOptionsModal = ref<boolean>(false);

const openCamera = () => {
  showPhotoOptionsModal.value = false;
  cameraInputRef.value?.click();
};

const openGallery = () => {
  showPhotoOptionsModal.value = false;
  galleryInputRef.value?.click();
};

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    ticket.value.photoFile = file;
    ticket.value.photoPreview = URL.createObjectURL(file);
  }
  // Reset value agar pengguna bisa memilih kembali file yang sama jika perlu
  target.value = '';
};

const removePhoto = () => {
  ticket.value.photoFile = null;
  ticket.value.photoPreview = '';
};

// QR Code Scanner State & Logic
const isScanning = ref<boolean>(false);
const scannerVideoRef = ref<HTMLVideoElement | null>(null);
let codeReader: BrowserMultiFormatReader | null = null;

// Fungsi untuk memproses hasil scan QR code dan mendekripsinya via ApiService
const processScannedCode = async (qrText: string) => {
  try {
    let encryptedCode = qrText;
    if (qrText.includes('/scan/')) {
      const scanPart = qrText.split('/scan/')[1];
      encryptedCode = scanPart?.trim() ?? '';
    }

    if (!encryptedCode) {
      alert('Format QR Code tidak valid.');
      return;
    }

    // Memanggil endpoint /decrypt melalui ApiService
    const res = await ApiService.decryptLocation(encryptedCode);

    if (res.data.status === 'success') {
      const decryptedLocationName = String(res.data.decrypted_txt ?? '').trim();

      const matchedLoc = locationList.value.find(loc => {
        const locCode = String(loc?.code ?? '').toLowerCase();
        const locName = String(loc?.name ?? '').toLowerCase();
        const decryptedName = decryptedLocationName.toLowerCase();

        return locCode === decryptedName || locName === decryptedName;
      });

      if (matchedLoc) {
        const matchedName = String(matchedLoc.name ?? '');
        const matchedAddress = String(matchedLoc.address ?? '');

        ticket.value.location = matchedName || decryptedLocationName;
        ticket.value.location_detail = matchedName
          ? `${matchedName} - ${matchedAddress}`.trim().replace(/\s+-\s+$/, '')
          : decryptedLocationName;
      } else {
        ticket.value.location = decryptedLocationName || 'Lokasi tidak terdeteksi';
        ticket.value.location_detail = decryptedLocationName || 'Lokasi tidak terdeteksi';
      }
      
      successMessage.value = `Lokasi berhasil dipindai: ${decryptedLocationName}`;
      setTimeout(() => { successMessage.value = ''; }, 3000);
    }
  } catch (err) {
    console.error('Gagal mendekripsi QR Code:', err);
    errorMessage.value = 'Gagal mendekripsi kode lokasi dari QR.';
  }
};

const startScanner = async () => {
  isScanning.value = true;
  errorMessage.value = '';
  
  // Inisialisasi codeReader jika belum ada
  if (!codeReader) {
    codeReader = new BrowserMultiFormatReader();
  }

  try {
    // 1. Dapatkan daftar perangkat video
    const videoInputDevices = await codeReader.listVideoInputDevices();
    
    if (!videoInputDevices || videoInputDevices.length === 0) {
      alert('Kamera tidak ditemukan pada perangkat Anda.');
      isScanning.value = false;
      return;
    }

    // 2. Cari kamera belakang (Rear/Back)
    const backCamera = videoInputDevices.find(d => {
      const label = d.label.toLowerCase();
      return label.includes('back') || label.includes('rear') || label.includes('environment');
    });

    // 3. Tentukan deviceId yang valid (tidak null/undefined/string kosong)
    // Jika tidak menemukan kamera belakang khusus, pilih kamera pertama dalam list
    let selectedDeviceId: string | undefined = backCamera?.deviceId || videoInputDevices[0]?.deviceId;

    // Jika deviceId bernilai string kosong atau undefined, atur ke undefined
    // (ZXing akan otomatis menggunakan kamera bawaan utama/default)
    if (!selectedDeviceId || selectedDeviceId.trim() === '') {
      selectedDeviceId = undefined;
    }

    // Give DOM time to render <video ref="scannerVideoRef">
    setTimeout(() => {
      if (scannerVideoRef.value && codeReader) {
        // Pemanggilan decodeFromVideoDevice dengan deviceId (bisa undefined/null/string ID)
        codeReader.decodeFromVideoDevice(
          selectedDeviceId ?? null,
          scannerVideoRef.value,
          (result, error) => {
            if (result) {
              const scannedText = result.getText();
              stopScanner();
              processScannedCode(scannedText);
            }
            if (error && !(error instanceof NotFoundException)) {
              console.error('Scan Error:', error);
            }
          }
        );
      } else {
        isScanning.value = false;
      }
    }, 300);
  } catch (err: any) {
    console.error('Gagal mengakses kamera:', err);
    errorMessage.value = 'Izin kamera ditolak atau kamera tidak dapat dibuka.';
    isScanning.value = false;
  }
};

const stopScanner = () => {
  if (codeReader) {
    try {
      codeReader.reset();
    } catch (e) {
      console.warn('Reset scanner error:', e);
    }
    codeReader = null;
  }
  isScanning.value = false;
};

// Ambil kategori dari API via ApiService
const fetchCategories = async () => {
  try {
    const res = await ApiService.getCategories();
    if (res.data.status === 'success') {
      categories.value = res.data.data;
    }
  } catch (error) {
    console.error('Gagal memuat kategori fasilitas', error);
  }
};

// Ambil daftar lokasi via ApiService
const fetchLocations = async () => {
  try {
    const res = await ApiService.getLocations();
    if (res.data.status) {
      locationList.value = res.data.data;
    }
  } catch (error) {
    console.error('Gagal memuat lokasi', error);
  }
};

const openLocationModal = () => {
  showLocationModal.value = true;
};

const selectLocation = (loc: any) => {
  ticket.value.location = loc.name;
  ticket.value.location_detail = `${loc.name} - ${loc.address}`;
  showLocationModal.value = false;
};

const onCategoryChange = () => {
  ticket.value.category = selectedCategory.value;
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const submitTicket = async () => {
  if (!ticket.value.title || !ticket.value.description || !ticket.value.category) {
    errorMessage.value = 'Judul, kategori, dan deskripsi wajib diisi.';
    return;
  }

  if (isArmada.value && !ticket.value.nopol) {
    errorMessage.value = 'Nomor Polisi (NOPOL) wajib diisi untuk servis armada.';
    return;
  }

  if (!ticket.value.photoFile) {
    errorMessage.value = 'Foto bukti kendala wajib diunggah.';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const formData = new FormData();
    formData.append('user_id', currentUser.value?.id || '1');
    
    const finalTitle = isArmada.value ? `[${ticket.value.nopol}] ${ticket.value.title}` : ticket.value.title;
    const finalDescription = isArmada.value ? `NOPOL: ${ticket.value.nopol}\n${ticket.value.description}` : ticket.value.description;

    formData.append('title', finalTitle);
    formData.append('category', ticket.value.category);
    formData.append('description', finalDescription);
    formData.append('location', ticket.value.location);
    formData.append('location_detail', ticket.value.location_detail || '-');
    formData.append('photo', ticket.value.photoFile);

    await ApiService.createTicket(formData);

    successMessage.value = 'Tiket berhasil dikirim!';
    setTimeout(() => {
      router.push('/myticket');
    }, 1500);
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || error.response?.data?.message || 'Gagal mengirim tiket ke server.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCategories();
  fetchLocations();
});

onUnmounted(() => {
  stopScanner();
});
</script>

<style scoped>
@keyframes scan {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}

.animate-scan {
  position: absolute;
  animation: scan 2.5s ease-in-out infinite;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>