import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { useFolderProducts } from '../../hooks/useData';
import { ImportProduct, ImportFolder } from '../../lib/entities';
import { Button, Input, Select, Card, CardContent, CardHeader, CardTitle, Badge } from '../ui';
import { FolderTimeline } from '../FolderTimeline';
import { Plus, Trash2, Package } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import type { ImportFolder as IF, ImportProduct as IP } from '../../lib/types';

export function ProductsTab({ folder, onUpdate }: { folder: IF | null; onUpdate: () => void }) {
  const { isAdmin } = useAuth();
  const { products, loading, refresh } = useFolderProducts(folder?.id || null);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<IP>>({ unit: 'PZA', margin_percent: folder?.default_margin || 30 });

  if (!folder) return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="text-muted-foreground/15 mb-4"><Package size={56} /></div>
      <p className="text-base font-semibold text-muted-foreground/65">Selecciona una carpeta primero</p>
      <p className="text-sm text-muted-foreground/40 mt-2">Elige una carpeta para gestionar sus productos</p>
    </div>
  );

  const isReadonly = !isAdmin || folder.status === 'cerrado';

  const handleAdd = async () => {
    if (!newProduct.code || !newProduct.description || !newProduct.quantity || !newProduct.unit_price_fob) return;
    await ImportProduct.create({
      folder_id: folder.id!,
      code: newProduct.code!,
      description: newProduct.description!,
      quantity: Number(newProduct.quantity),
      unit: newProduct.unit || 'PZA',
      unit_price_fob: Number(newProduct.unit_price_fob),
      margin_percent: Number(newProduct.margin_percent) || folder.default_margin,
    } as any);
    setNewProduct({ unit: 'PZA', margin_percent: folder.default_margin });
    setShowForm(false);
    await refresh();
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    await ImportProduct.delete(id);
    await refresh();
    onUpdate();
  };

  const totalFob = products.reduce((sum, p) => sum + p.quantity * p.unit_price_fob, 0);
  const totalCif = totalFob + (folder.international_freight || 0) + (folder.international_insurance || 0);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <p className="text-base text-muted-foreground/60 animate-pulse font-medium">Cargando...</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <FolderTimeline folder={folder} />
      {isReadonly && <Badge variant="warning">Solo lectura</Badge>}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Factura Comercial</CardTitle>
          {!isReadonly && !showForm && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus size={15} /> Agregar Producto
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {showForm && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 p-4 rounded-xl border border-border/45 bg-white/[0.03]">
              <Input placeholder="Código" value={newProduct.code || ''} onChange={e => setNewProduct(p => ({ ...p, code: e.target.value }))} />
              <Input placeholder="Descripción" value={newProduct.description || ''} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} className="md:col-span-2" />
              <Input type="number" placeholder="Cant." value={newProduct.quantity || ''} onChange={e => setNewProduct(p => ({ ...p, quantity: Number(e.target.value) }))} />
              <Select value={newProduct.unit} onChange={e => setNewProduct(p => ({ ...p, unit: e.target.value }))}>
                <option value="PZA">PZA</option>
                <option value="KG">KG</option>
                <option value="LT">LT</option>
                <option value="MTS">MTS</option>
                <option value="CAJA">CAJA</option>
              </Select>
              <Input type="number" step="0.01" placeholder="P.U. FOB" value={newProduct.unit_price_fob || ''} onChange={e => setNewProduct(p => ({ ...p, unit_price_fob: Number(e.target.value) }))} />
              <div className="col-span-full flex gap-3 mt-1">
                <Button size="sm" onClick={handleAdd}>Agregar</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </div>
          )}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 text-[11px] text-muted-foreground/65 uppercase tracking-wider font-semibold">
                <th className="text-left p-3">Código</th>
                <th className="text-left p-3">Descripción</th>
                <th className="text-right p-3">Cant.</th>
                <th className="text-right p-3">P.U. FOB</th>
                <th className="text-right p-3">Total FOB</th>
                <th className="text-right p-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-border/20 last:border-0 hover:bg-white/[0.03] transition-colors">
                  <td className="p-3 font-mono text-sm text-foreground/80 font-medium">{p.code}</td>
                  <td className="p-3 text-foreground/85 text-sm">{p.description}</td>
                  <td className="p-3 text-right text-foreground/75 text-sm">{p.quantity} {p.unit}</td>
                  <td className="p-3 text-right text-foreground/75 text-sm">{formatCurrency(p.unit_price_fob)}</td>
                  <td className="p-3 text-right font-bold text-foreground/90 text-sm">{formatCurrency(p.quantity * p.unit_price_fob)}</td>
                  <td className="p-3 text-right">
                    {!isReadonly && (
                      <Button size="sm" variant="ghost" className="text-red-400/65 hover:text-red-400" onClick={() => handleDelete(p.id!)}>
                        <Trash2 size={15} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end text-sm space-x-8 pt-2">
            <span><span className="text-muted-foreground/70">Total FOB:</span> <strong className="text-foreground font-bold">{formatCurrency(totalFob)}</strong></span>
            <span><span className="text-muted-foreground/70">Total CIF:</span> <strong className="text-foreground font-bold">{formatCurrency(totalCif)}</strong></span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Costos Internacionales</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-muted-foreground/75">Flete Internacional (USD)</label>
            <Input type="number" step="0.01" className="mt-2" value={folder.international_freight} disabled={isReadonly}
              onChange={async (e) => { await ImportFolder.update(folder.id!, { international_freight: parseFloat(e.target.value) || 0 }); onUpdate(); }} />
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground/75">Seguro Internacional (USD)</label>
            <Input type="number" step="0.01" className="mt-2" value={folder.international_insurance} disabled={isReadonly}
              onChange={async (e) => { await ImportFolder.update(folder.id!, { international_insurance: parseFloat(e.target.value) || 0 }); onUpdate(); }} />
          </div>
          <div className="flex items-end pb-1">
            <div className="text-sm">
              <span className="text-muted-foreground/70">Total CIF:</span>
              <strong className="text-xl ml-2 text-foreground font-bold">{formatCurrency(totalCif)}</strong>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
