import { apiClient } from '../api/client';
import { ProductCatalog, Supplier } from '@domain/models';

export const catalogService = {
  getProducts: () =>
    apiClient.get<{ success: boolean; data: ProductCatalog[] }>('/catalog/products'),
  getProduct: (id: string) =>
    apiClient.get<{ success: boolean; data: ProductCatalog }>(`/catalog/products/${id}`),
  createProduct: (data: Partial<ProductCatalog>) =>
    apiClient.post<{ success: boolean; data: ProductCatalog }>('/catalog/products', data),
  updateProduct: (id: string, data: Partial<ProductCatalog>) =>
    apiClient.put<{ success: boolean; data: ProductCatalog }>(`/catalog/products/${id}`, data),
  deleteProduct: (id: string) =>
    apiClient.delete(`/catalog/products/${id}`),

  getSuppliers: () =>
    apiClient.get<{ success: boolean; data: Supplier[] }>('/catalog/suppliers'),
  getSupplier: (id: string) =>
    apiClient.get<{ success: boolean; data: Supplier }>(`/catalog/suppliers/${id}`),
  createSupplier: (data: Partial<Supplier>) =>
    apiClient.post<{ success: boolean; data: Supplier }>('/catalog/suppliers', data),
  updateSupplier: (id: string, data: Partial<Supplier>) =>
    apiClient.put<{ success: boolean; data: Supplier }>(`/catalog/suppliers/${id}`, data),
  deleteSupplier: (id: string) =>
    apiClient.delete(`/catalog/suppliers/${id}`)
};
