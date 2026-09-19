// src/utils/errorHandler.ts
import axios from 'axios';

export function getErrorMessage(error: unknown, defaultMsg: string = 'Terjadi kesalahan sistem.'): string {
  if (axios.isAxiosError(error)) {
    // Ambil pesan dari respons backend jika tersedia
    const data = error.response?.data as { message?: string };
    if (data?.message) {
      return data.message;
    }
  }
  
  // Jika error bawaan JavaScript/Error objek biasa
  if (error instanceof Error) {
    return error.message;
  }

  return defaultMsg;
}