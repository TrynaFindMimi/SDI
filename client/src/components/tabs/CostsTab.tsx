import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { useFolderCosts } from '../../hooks/useData';
import { ImportCost, getRateForDate } from '../../lib/entities';
import { Button, Input, Select, Card, CardContent, CardHeader, CardTitle, Badge } from '../ui';
import { FolderTimeline } from '../FolderTimeline';
import { Plus, Trash2, DollarSign } from 'lucide-react';
import { formatCurrency, calcUsd, calcBob } from '../../lib/utils';
import type { ImportFolder as IF, ImportCost as IC } from '../../lib/types';

const CATEGORIES = ['Financiero', 'Permisos', 'Transporte', 'Seguro', 'Aduana', 'Logística', 'Otros'];

export function CostsTab({ folder, onUpdate }: { folder: IF | null; onUpdate: () => void }) {
  const { isAdmin } = useAuth();
  const { costs, loading, refresh } = useFolderCosts(folder?.id || null);
  const [showForm, setShowForm] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [newCost, setNewCost] = useState<Partial<IC>>({
    date: today,
    category: 'Otros',
    currency: 'BOB',
    exchange_rate: folder?.exchange_rate || 6.96,
  });

  useEffect(() => {
    const updateRate = async () => {
      const rate = await getRateForDate(newCost.date || today);
      setNewCost(p => ({ ...p, exchange_rate: rate }));
    };
    updateRate();
  }, [newCost.date]);

  if (!folder) return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="text-muted-foreground/15 mb-4"><DollarSign size={56} /></div>
      <p className="text-base font-semibold text-muted-foreground/65">Selecciona una carpeta primero</p>
      <p className="text-sm text-muted-foreground/40 mt-2">Elige una carpeta para gestionar sus costos</p>
    </div>
  );

  const isReadonly = !isAdmin || folder.status === 'cerrado';

  const handleAdd = async () => {
    if (!newCost.description || !newCost.amount) return;
    await ImportCost.create({
      folder_id: folder.id!,
      date: newCost.date || new Date().toISOString().split('T')[0],
      receipt_number: newCost.receipt_number || '',
      category: (newCost.category as any) || 'Otros',
      description: newCost.description!,
      currency: (newCost.currency as any) || 'BOB',
      amount: Number(newCost.amount),
      exchange_rate: Number(newCost.exchange_rate) || folder.exchange_rate,
    } as any);
    setNewCost({ date: new Date().toISOString().split('T')[0], category: 'Otros', currency: 'BOB', exchange_rate: folder.exchange_rate });
    setShowForm(false);
    await refresh();
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    await ImportCost.delete(id);
    await refresh();
    onUpdate();
  };

  const totalUsd = costs.reduce((sum, c) => sum + calcUsd(c), 0);
  const totalBob = costs.reduce((sum, c) => sum + calcBob(c), 0);

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
          <CardTitle>Gastos de Importación</CardTitle>
          {!isReadonly && !showForm && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus size={15} /> Agregar Gasto
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {showForm && (
            <div className="grid grid-cols-2 md:grid-cols-7 gap-2 p-4 rounded-xl border border-border/45 bg-white/[0.03]">
              <Input type="date" value={newCost.date || ''} onChange={e => setNewCost(p => ({ ...p, date: e.target.value }))} />
              <Input placeholder="N° Comprobante" value={newCost.receipt_number || ''} onChange={e => setNewCost(p => ({ ...p, receipt_number: e.target.value }))} />
              <Select value={newCost.category} onChange={e => setNewCost(p => ({ ...p, category: e.target.value as any }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
              <Input placeholder="Descripción" value={newCost.description || ''} onChange={e => setNewCost(p => ({ ...p, description: e.target.value }))} className="md:col-span-2" />
              <div className="flex gap-1">
                <Input type="number" step="0.01" placeholder="Monto" value={newCost.amount || ''} onChange={e => setNewCost(p => ({ ...p, amount: Number(e.target.value) }))} />
                <Select value={newCost.currency} onChange={e => setNewCost(p => ({ ...p, currency: e.target.value as any }))} className="w-20">
                  <option value="USD">USD</option>
                  <option value="BOB">BOB</option>
                </Select>
              </div>
              <Input type="number" step="0.01" placeholder="T.C." value={newCost.exchange_rate || ''} onChange={e => setNewCost(p => ({ ...p, exchange_rate: Number(e.target.value) }))} />
              <div className="col-span-full flex gap-3 mt-1">
                <Button size="sm" onClick={handleAdd}>Agregar</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </div>
          )}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 text-[11px] text-muted-foreground/65 uppercase tracking-wider font-semibold">
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3 hidden md:table-cell">Comp.</th>
                <th className="text-left p-3 hidden md:table-cell">Categoría</th>
                <th className="text-left p-3">Descripción</th>
                <th className="text-right p-3">USD</th>
                <th className="text-right p-3 hidden md:table-cell">BOB</th>
                <th className="text-right p-3"></th>
              </tr>
            </thead>
            <tbody>
              {costs.map(c => (
                <tr key={c.id} className="border-b border-border/20 last:border-0 hover:bg-white/[0.03] transition-colors">
                  <td className="p-3 text-sm text-foreground/75">{c.date}</td>
                  <td className="p-3 text-sm text-muted-foreground/60 hidden md:table-cell">{c.receipt_number || '—'}</td>
                  <td className="p-3 text-sm hidden md:table-cell">
                    <span className="rounded-lg bg-secondary/70 px-2 py-1 text-xs text-muted-foreground/75 font-medium">{c.category}</span>
                  </td>
                  <td className="p-3 text-foreground/85 text-sm">{c.description}</td>
                  <td className="p-3 text-right font-bold text-foreground/90 text-sm">{formatCurrency(calcUsd(c), 'USD')}</td>
                  <td className="p-3 text-right text-foreground/70 hidden md:table-cell text-sm">{formatCurrency(calcBob(c), 'BOB')}</td>
                  <td className="p-3 text-right">
                    {!isReadonly && (
                      <Button size="sm" variant="ghost" className="text-red-400/65 hover:text-red-400" onClick={() => handleDelete(c.id!)}>
                        <Trash2 size={15} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end text-sm space-x-8 pt-2">
            <span><span className="text-muted-foreground/70">Total USD:</span> <strong className="text-foreground font-bold">{formatCurrency(totalUsd)}</strong></span>
            <span><span className="text-muted-foreground/70">Total BOB:</span> <strong className="text-foreground font-bold">{formatCurrency(totalBob, 'BOB')}</strong></span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
