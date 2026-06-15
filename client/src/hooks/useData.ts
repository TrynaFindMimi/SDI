import { useState, useEffect, useCallback } from 'react';
import { ImportFolder, ImportProduct, ImportCost, Supplier, ProductCatalog } from '../lib/entities';
import type { ImportFolder as IF, ImportProduct as IP, ImportCost as IC, Supplier as S, ProductCatalog as PC } from '../lib/types';

export function useFolders() {
  const [folders, setFolders] = useState<IF[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await ImportFolder.list<IF>('-created_date');
    setFolders(data);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { folders, loading, refresh };
}

export function useFolderProducts(folderId: string | null) {
  const [products, setProducts] = useState<IP[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!folderId) { setProducts([]); return; }
    setLoading(true);
    const data = await ImportProduct.filter<IP>({ folder_id: folderId });
    setProducts(data);
    setLoading(false);
  }, [folderId]);

  useEffect(() => { refresh(); }, [refresh]);

  return { products, loading, refresh };
}

export function useFolderCosts(folderId: string | null) {
  const [costs, setCosts] = useState<IC[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!folderId) { setCosts([]); return; }
    setLoading(true);
    const data = await ImportCost.filter<IC>({ folder_id: folderId });
    setCosts(data);
    setLoading(false);
  }, [folderId]);

  useEffect(() => { refresh(); }, [refresh]);

  return { costs, loading, refresh };
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<S[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await Supplier.list<S>();
    setSuppliers(data);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { suppliers, loading, refresh };
}

export function useCatalog() {
  const [catalog, setCatalog] = useState<PC[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await ProductCatalog.list<PC>();
    setCatalog(data);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { catalog, loading, refresh };
}
