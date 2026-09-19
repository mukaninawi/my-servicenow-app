// src/services/ApiService.ts
import apiClient from './ApiClient';

export default {
  getTicketStats() {
    return apiClient.get('/ticket/statistics');
  },
  getTicketData(params: Record<string, unknown>) {
    return apiClient.get('/ticket/data', { params });
  },
  getTicketDetail(ticketId: string | number) {
    return apiClient.get(`/ticket/detail?ticketId=${ticketId}`);
  },
  getTicketLogs(ticketId: string | number) {
    return apiClient.get('/ticket/logs', { params: { ticketId } });
  },
  getCategories() { 
    return apiClient.get('/categories'); 
  },
  getLocations() { 
    return apiClient.get('/locations'); 
  },
  createTicket(formData: FormData) {
    return apiClient.post('/ticket/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  decryptLocation(encryptedTxt: string) {
    return apiClient.post('/decrypt', { encrypted_txt: encryptedTxt });
  }
};