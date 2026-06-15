import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { ImportFolder, ExchangeRate, setDailyRate } from '../../lib/entities';
import { Button, Input, Select, Textarea, Card, CardContent, CardHeader, CardTitle, Label, Badge } from '../ui';
import { FolderTimeline } from '../FolderTimeline';
import { DollarSign, History, TrendingUp, FileText } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import type { ImportFolder as IF, ExchangeRate as ER } from '../../lib/types';

export function OperationTab({ folder, onUpdate }: { folder: IF | null; onUpdate: () => void }) {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState<IF | null>(null);
  const [rateHistory, setRateHistory] = useState<ER[]>([]);
  const [newRate, setNewRate] = useState<number>(6.96);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (folder) setForm({ ...folder });
    loadRates();
  }, [folder?.id]);

  const loadRates = async () => {
    const rates = await ExchangeRate.list<ER>('-date');
    setRateHistory(rates);
    if (rates.length > 0) setNewRate(rates[0].rate);
    else setNewRate(folder?.exchange_rate || 6.96);
  };

  if (!folder) return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="text-muted-foreground/15 mb-4"><FileText size={56} /></div>
      <p className="text-base font-semibold text-muted-foreground/65">Selecciona una carpeta primero</p>
      <p className="text-sm text-muted-foreground/40 mt-2">Elige una carpeta en la pestaña "Carpetas" para ver su operación</p>
    </div>
  );

  if (!form) return null;

  const isReadonly = !isAdmin || folder.status === 'cerrado';
  const todayRate = rateHistory.find(r => r.date === new Date().toISOString().split('T')[0]);

  const handleSave = async () => {
    await ImportFolder.update(folder.id!, {
      supplier: form.supplier, broker: form.broker,
      invoice_numbers: form.invoice_numbers,
      incoterm: form.incoterm, transport_mode: form.transport_mode,
      exchange_rate: form.exchange_rate, default_margin: form.default_margin,
      notes: form.notes,
    });
    onUpdate();
  };

  const handleSetRate = async () => {
    await setDailyRate(newRate);
    await loadRates();
  };

  return (
    <div className="space-y-5">
      <FolderTimeline folder={folder} />

      {isReadonly && <Badge variant="warning" className="mb-1">Solo lectura</Badge>}

      <Card>
        <CardHeader>
          <CardTitle>Datos de la Operación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Proveedor / Exportador</Label>
              <Input value={form.supplier} onChange={e => setForm(f => f ? { ...f, supplier: e.target.value } : null)} disabled={isReadonly} />
            </div>
            <div>
              <Label>Broker / Agente Aduanal</Label>
              <Input value={form.broker} onChange={e => setForm(f => f ? { ...f, broker: e.target.value } : null)} disabled={isReadonly} />
            </div>
            <div>
              <Label>N° de Factura(s)</Label>
              <Input value={form.invoice_numbers} onChange={e => setForm(f => f ? { ...f, invoice_numbers: e.target.value } : null)} disabled={isReadonly} placeholder="FAC-001, FAC-002" />
            </div>
            <div>
              <Label>Incoterm</Label>
              <Select value={form.incoterm} onChange={e => setForm(f => f ? { ...f, incoterm: e.target.value as any } : null)} disabled={isReadonly}>
                <option value="FOB">FOB</option>
                <option value="EXW">EXW</option>
                <option value="CIF">CIF</option>
                <option value="DDP">DDP</option>
              </Select>
            </div>
            <div>
              <Label>Vía de Transporte</Label>
              <Select value={form.transport_mode} onChange={e => setForm(f => f ? { ...f, transport_mode: e.target.value as any } : null)} disabled={isReadonly}>
                <option value="Marítima">Marítima</option>
                <option value="Aérea">Aérea</option>
                <option value="Terrestre">Terrestre</option>
              </Select>
            </div>
            <div>
              <Label>Tipo de Cambio (USD → BOB)</Label>
              <Input type="number" step="0.01" value={form.exchange_rate} onChange={e => setForm(f => f ? { ...f, exchange_rate: parseFloat(e.target.value) || 0 } : null)} disabled={isReadonly} />
            </div>
            <div>
              <Label>Margen por Defecto (%)</Label>
              <Input type="number" step="1" value={form.default_margin} onChange={e => setForm(f => f ? { ...f, default_margin: parseFloat(e.target.value) || 0 } : null)} disabled={isReadonly} />
            </div>
          </div>
          <div>
            <Label>Notas</Label>
            <Textarea value={form.notes} onChange={e => setForm(f => f ? { ...f, notes: e.target.value } : null)} disabled={isReadonly} />
          </div>
          {!isReadonly && <Button onClick={handleSave}>Guardar Cambios</Button>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2.5">
            <DollarSign size={17} className="text-primary/80" />
            Dólar Paralelo
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}>
            <History size={15} /> Historial
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdmin && (
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Label>Tasa del día ({new Date().toLocaleDateString()})</Label>
                <Input type="number" step="0.01" value={newRate} onChange={e => setNewRate(parseFloat(e.target.value) || 0)} />
              </div>
              <Button onClick={handleSetRate} size="sm">
                {todayRate ? 'Actualizar Tasa' : 'Fijar Tasa'}
              </Button>
            </div>
          )}
          {todayRate && (
            <div className="text-[15px] bg-white/[0.03] rounded-xl px-4 py-3 border border-border/35 flex items-center gap-3">
              <TrendingUp size={16} className="text-primary/70" />
              <span className="text-muted-foreground/75">Tasa de hoy:</span>
              <strong className="text-foreground font-bold">1 USD = {todayRate.rate} BOB</strong>
              {!isAdmin && <span className="ml-auto text-xs text-muted-foreground/45 font-medium">(admin)</span>}
            </div>
          )}
          {showHistory && rateHistory.length > 0 && (
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30 text-[11px] text-muted-foreground/65 uppercase tracking-wider font-semibold">
                    <th className="text-left p-3">Fecha</th>
                    <th className="text-right p-3">Tasa (USD → BOB)</th>
                  </tr>
                </thead>
                <tbody>
                  {rateHistory.map(r => (
                    <tr key={r.id} className="border-b border-border/20 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 text-foreground/80 font-medium">{formatDate(r.date)}</td>
                      <td className="p-3 text-right font-mono font-bold text-foreground/90">1 USD = {r.rate} BOB</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!rateHistory.length && (
            <p className="text-sm text-muted-foreground/55">No hay tasas registradas. El administrador puede fijar la tasa diaria del dólar paralelo.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
