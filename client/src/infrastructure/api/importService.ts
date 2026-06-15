import { apiClient } from '../api/client';
import { Import, LogisticsData, ImportedProduct, Cost, FinancialSummary } from '@domain/models';

export const importService = {
  getAll: () => apiClient.get<{ success: boolean; data: Import[] }>('/imports'),
  getById: (id: string) => apiClient.get<{ success: boolean; data: Import }>(`/imports/${id}`),
  create: (data: { importNumber: string; estimatedArrival?: string }) =>
    apiClient.post<{ success: boolean; data: Import }>('/imports', data),
  update: (id: string, data: Partial<Import>) =>
    apiClient.put<{ success: boolean; data: Import }>(`/imports/${id}`, data),
  updateStatus: (id: string, status: string) =>
    apiClient.patch<{ success: boolean; data: Import }>(`/imports/${id}/status`, { status }),
  delete: (id: string) => apiClient.delete(`/imports/${id}`),

  getLogistics: (importId: string) =>
    apiClient.get<{ success: boolean; data: LogisticsData | null }>(`/imports/${importId}/logistics`),
  saveLogistics: (importId: string, data: Partial<LogisticsData>) =>
    apiClient.post<{ success: boolean; data: LogisticsData }>(`/imports/${importId}/logistics`, data),

  getProducts: (importId: string) =>
    apiClient.get<{ success: boolean; data: ImportedProduct[] }>(`/imports/${importId}/products`),
  addProduct: (importId: string, data: any) =>
    apiClient.post<{ success: boolean; data: ImportedProduct }>(`/imports/${importId}/products`, data),
  updateProduct: (importId: string, productId: string, data: any) =>
    apiClient.put<{ success: boolean; data: ImportedProduct }>(`/imports/${importId}/products/${productId}`, data),
  removeProduct: (importId: string, productId: string) =>
    apiClient.delete(`/imports/${importId}/products/${productId}`),

  getCosts: (importId: string) =>
    apiClient.get<{ success: boolean; data: Cost[] }>(`/imports/${importId}/costs`),
  addCost: (importId: string, data: any) =>
    apiClient.post<{ success: boolean; data: Cost }>(`/imports/${importId}/costs`, data),
  updateCost: (importId: string, costId: string, data: any) =>
    apiClient.put<{ success: boolean; data: Cost }>(`/imports/${importId}/costs/${costId}`, data),
  removeCost: (importId: string, costId: string) =>
    apiClient.delete(`/imports/${importId}/costs/${costId}`),
  allocateCosts: (importId: string) =>
    apiClient.post<{ success: boolean }>(`/imports/${importId}/costs/allocate`, {}),

  getFinancialSummary: (importId: string) =>
    apiClient.get<{ success: boolean; data: FinancialSummary }>(`/imports/${importId}/financial-summary`)
};
