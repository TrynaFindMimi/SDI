import { create } from 'zustand';
import { Import, ImportStatus } from '@domain/models';
import { importService } from '@infrastructure/api/importService';

interface ImportState {
  imports: Import[];
  currentImport: Import | null;
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  create: (data: { importNumber: string; estimatedArrival?: string }) => Promise<Import>;
  update: (id: string, data: Partial<Import>) => Promise<void>;
  updateStatus: (id: string, status: ImportStatus) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useImportStore = create<ImportState>((set) => ({
  imports: [],
  currentImport: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await importService.getAll();
      set({ imports: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await importService.getById(id);
      set({ currentImport: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  create: async (data) => {
    const response = await importService.create(data);
    set((state) => ({ imports: [response.data, ...state.imports] }));
    return response.data;
  },

  update: async (id, data) => {
    const response = await importService.update(id, data);
    set((state) => ({
      imports: state.imports.map((i) => (i.id === id ? response.data : i)),
      currentImport: state.currentImport?.id === id ? response.data : state.currentImport
    }));
  },

  updateStatus: async (id, status) => {
    const response = await importService.updateStatus(id, status);
    set((state) => ({
      imports: state.imports.map((i) => (i.id === id ? response.data : i)),
      currentImport: state.currentImport?.id === id ? response.data : state.currentImport
    }));
  },

  remove: async (id) => {
    await importService.delete(id);
    set((state) => ({
      imports: state.imports.filter((i) => i.id !== id),
      currentImport: state.currentImport?.id === id ? null : state.currentImport
    }));
  },

  clearError: () => set({ error: null })
}));
