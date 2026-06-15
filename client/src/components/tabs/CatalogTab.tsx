import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { useSuppliers, useCatalog } from '../../hooks/useData';
import { Supplier, ProductCatalog } from '../../lib/entities';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '../ui';
import { Plus, Trash2, Building2, PackageOpen } from 'lucide-react';
import type { Supplier as S, ProductCatalog as PC } from '../../lib/types';

export function CatalogTab() {
  const { isAdmin } = useAuth();
  const { suppliers, refresh: refreshSuppliers } = useSuppliers();
  const { catalog, refresh: refreshCatalog } = useCatalog();
  const [subtab, setSubtab] = useState<'suppliers' | 'products'>('suppliers');
  const [newSupplier, setNewSupplier] = useState<Partial<S>>({});
  const [newProduct, setNewProduct] = useState<Partial<PC>>({});

  const handleAddSupplier = async () => {
    if (!newSupplier.name) return;
    await Supplier.create(newSupplier as any);
    setNewSupplier({});
    await refreshSuppliers();
  };

  const handleDeleteSupplier = async (id: string) => {
    await Supplier.delete(id);
    await refreshSuppliers();
  };

  const handleAddProduct = async () => {
    if (!newProduct.code || !newProduct.name) return;
    await ProductCatalog.create(newProduct as any);
    setNewProduct({});
    await refreshCatalog();
  };

  const handleDeleteProduct = async (id: string) => {
    await ProductCatalog.delete(id);
    await refreshCatalog();
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <Button variant={subtab === 'suppliers' ? 'default' : 'outline'} size="sm" onClick={() => setSubtab('suppliers')}>
          <Building2 size={15} /> Proveedores
        </Button>
        <Button variant={subtab === 'products' ? 'default' : 'outline'} size="sm" onClick={() => setSubtab('products')}>
          <PackageOpen size={15} /> Productos
        </Button>
      </div>

      {subtab === 'suppliers' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Directorio de Proveedores</CardTitle>
            {isAdmin && (
              <Button size="sm" onClick={() => setNewSupplier({})}>
                <Plus size={15} /> Agregar
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isAdmin && Object.keys(newSupplier).length >= 0 && !newSupplier.id && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-4 rounded-xl border border-border/45 bg-white/[0.03]">
                <Input placeholder="Nombre" value={newSupplier.name || ''} onChange={e => setNewSupplier(s => ({ ...s, name: e.target.value }))} />
                <Input placeholder="País" value={newSupplier.country || ''} onChange={e => setNewSupplier(s => ({ ...s, country: e.target.value }))} />
                <Input placeholder="Contacto" value={newSupplier.contact || ''} onChange={e => setNewSupplier(s => ({ ...s, contact: e.target.value }))} />
                <Input placeholder="Email" value={newSupplier.email || ''} onChange={e => setNewSupplier(s => ({ ...s, email: e.target.value }))} />
                <Input placeholder="Teléfono" value={newSupplier.phone || ''} onChange={e => setNewSupplier(s => ({ ...s, phone: e.target.value }))} />
                <div className="col-span-full flex gap-3 mt-1">
                  <Button size="sm" onClick={handleAddSupplier}>Guardar</Button>
                  <Button size="sm" variant="ghost" onClick={() => setNewSupplier({})}>Cancelar</Button>
                </div>
              </div>
            )}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 text-[11px] text-muted-foreground/65 uppercase tracking-wider font-semibold">
                  <th className="text-left p-3">Nombre</th>
                  <th className="text-left p-3">País</th>
                  <th className="text-left p-3 hidden md:table-cell">Contacto</th>
                  <th className="text-left p-3 hidden md:table-cell">Email</th>
                  <th className="text-left p-3 hidden md:table-cell">Teléfono</th>
                  {isAdmin && <th className="text-right p-3"></th>}
                </tr>
              </thead>
              <tbody>
                {suppliers.map(s => (
                  <tr key={s.id} className="border-b border-border/20 last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className="p-3 font-semibold text-foreground/90">{s.name}</td>
                    <td className="p-3 text-foreground/75 text-sm">{s.country}</td>
                    <td className="p-3 text-muted-foreground/65 hidden md:table-cell text-sm">{s.contact || '—'}</td>
                    <td className="p-3 text-muted-foreground/65 hidden md:table-cell text-sm">{s.email || '—'}</td>
                    <td className="p-3 text-muted-foreground/65 hidden md:table-cell text-sm">{s.phone || '—'}</td>
                    {isAdmin && (
                      <td className="p-3 text-right">
                        <Button size="sm" variant="ghost" className="text-red-400/65 hover:text-red-400" onClick={() => handleDeleteSupplier(s.id!)}>
                          <Trash2 size={15} />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {subtab === 'products' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Catálogo de Productos</CardTitle>
            {isAdmin && (
              <Button size="sm" onClick={() => setNewProduct({})}>
                <Plus size={15} /> Agregar
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isAdmin && Object.keys(newProduct).length >= 0 && !newProduct.id && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-4 rounded-xl border border-border/45 bg-white/[0.03]">
                <Input placeholder="Código" value={newProduct.code || ''} onChange={e => setNewProduct(p => ({ ...p, code: e.target.value }))} />
                <Input placeholder="Nombre" value={newProduct.name || ''} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} />
                <Input placeholder="Categoría" value={newProduct.category || ''} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} />
                <Input placeholder="Unidad" value={newProduct.default_unit || ''} onChange={e => setNewProduct(p => ({ ...p, default_unit: e.target.value }))} />
                <Input type="number" step="0.01" placeholder="Precio Ref. USD" value={newProduct.reference_price || ''} onChange={e => setNewProduct(p => ({ ...p, reference_price: Number(e.target.value) }))} />
                <div className="col-span-full flex gap-3 mt-1">
                  <Button size="sm" onClick={handleAddProduct}>Guardar</Button>
                  <Button size="sm" variant="ghost" onClick={() => setNewProduct({})}>Cancelar</Button>
                </div>
              </div>
            )}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 text-[11px] text-muted-foreground/65 uppercase tracking-wider font-semibold">
                  <th className="text-left p-3">Código</th>
                  <th className="text-left p-3">Nombre</th>
                  <th className="text-left p-3 hidden md:table-cell">Categoría</th>
                  <th className="text-left p-3 hidden md:table-cell">Unidad</th>
                  <th className="text-right p-3 hidden md:table-cell">Precio Ref.</th>
                  {isAdmin && <th className="text-right p-3"></th>}
                </tr>
              </thead>
              <tbody>
                {catalog.map(p => (
                  <tr key={p.id} className="border-b border-border/20 last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className="p-3 font-mono text-sm text-foreground/80 font-medium">{p.code}</td>
                    <td className="p-3 font-semibold text-foreground/90">{p.name}</td>
                    <td className="p-3 text-muted-foreground/65 hidden md:table-cell text-sm">{p.category || '—'}</td>
                    <td className="p-3 text-muted-foreground/65 hidden md:table-cell text-sm">{p.default_unit || '—'}</td>
                    <td className="p-3 text-right text-muted-foreground/65 hidden md:table-cell text-sm">${p.reference_price?.toFixed(2)}</td>
                    {isAdmin && (
                      <td className="p-3 text-right">
                        <Button size="sm" variant="ghost" className="text-red-400/65 hover:text-red-400" onClick={() => handleDeleteProduct(p.id!)}>
                          <Trash2 size={15} />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
