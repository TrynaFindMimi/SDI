import { create } from 'zustand';
import { ProductCatalog, Supplier } from '@domain/models';
import { catalogService } from '@infrastructure/api/catalogService';

interface CatalogState {
  products: ProductCatalog[];
  suppliers: Supplier[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchSuppliers: () => Promise<void>;
  createProduct: (data: Partial<ProductCatalog>) => Promise<void>;
  updateProduct: (id: string, data: Partial<ProductCatalog>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  createSupplier: (data: Partial<Supplier>) => Promise<void>;
  updateSupplier: (id: string, data: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  products: [],
  suppliers: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await catalogService.getProducts();
      set({ products: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSuppliers: async () => {
    set({ isLoading: true });
    try {
      const response = await catalogService.getSuppliers();
      set({ suppliers: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createProduct: async (data) => {
    const response = await catalogService.createProduct(data);
    set((state) => ({ products: [...state.products, response.data] }));
  },

  updateProduct: async (id, data) => {
    const response = await catalogService.updateProduct(id, data);
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? response.data : p))
    }));
  },

  deleteProduct: async (id) => {
    await catalogService.deleteProduct(id);
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
  },

  createSupplier: async (data) => {
    const response = await catalogService.createSupplier(data);
    set((state) => ({ suppliers: [...state.suppliers, response.data] }));
  },

  updateSupplier: async (id, data) => {
    const response = await catalogService.updateSupplier(id, data);
    set((state) => ({
      suppliers: state.suppliers.map((s) => (s.id === id ? response.data : s))
    }));
  },

  deleteSupplier: async (id) => {
    await catalogService.deleteSupplier(id);
    set((state) => ({ suppliers: state.suppliers.filter((s) => s.id !== id) }));
  }
}));
