import { Card, CardContent, CardHeader, CardTitle, Badge } from '../ui';
import { formatCurrency, calcUsd } from '../../lib/utils';
import { TrendingUp } from 'lucide-react';
import type { ImportFolder as IF, ImportProduct as IP, ImportCost as IC } from '../../lib/types';

interface ReportsProps {
  folders: IF[];
  allProducts: IP[];
  allCosts: IC[];
}

function totalFolderCosts(folderId: string, costs: IC[]): number {
  return costs.filter(c => c.folder_id === folderId).reduce((s, c) => s + calcUsd(c), 0);
}

export function ReportsTab({ folders, allProducts, allCosts }: ReportsProps) {
  const totalFolders = folders.length;
  const totalFob = allProducts.reduce((s, p) => s + p.quantity * p.unit_price_fob, 0);
  const totalInvertido = folders.reduce((s, f) => {
    const fob = allProducts.filter(p => p.folder_id === f.id).reduce((s2, p) => s2 + p.quantity * p.unit_price_fob, 0);
    return s + fob + (f.international_freight || 0) + (f.international_insurance || 0) + totalFolderCosts(f.id!, allCosts);
  }, 0);
  const supplierCount = new Set(folders.map(f => f.supplier).filter(Boolean)).size;

  const byProduct = allProducts.reduce((acc, p) => {
    if (!acc[p.code]) acc[p.code] = { code: p.code, description: p.description, quantity: 0, totalFob: 0 };
    acc[p.code].quantity += p.quantity;
    acc[p.code].totalFob += p.quantity * p.unit_price_fob;
    return acc;
  }, {} as Record<string, { code: string; description: string; quantity: number; totalFob: number }>);

  const topProducts = Object.values(byProduct).sort((a, b) => b.totalFob - a.totalFob);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Importaciones', value: totalFolders.toString() },
          { label: 'FOB Acumulado', value: formatCurrency(totalFob) },
          { label: 'Total Invertido', value: formatCurrency(totalInvertido) },
          { label: 'Proveedores', value: supplierCount.toString() },
        ].map(({ label: lbl, value }) => (
          <Card key={lbl} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/55">{lbl}</p>
              <TrendingUp size={16} className="text-muted-foreground/30" />
            </div>
            <p className="text-[26px] font-bold mt-2.5 tracking-tight text-foreground">{value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Por Importación</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 text-[11px] text-muted-foreground/65 uppercase tracking-wider font-semibold">
                <th className="text-left p-3">N° Carpeta</th>
                <th className="text-left p-3">Proveedor</th>
                <th className="text-left p-3">Estado</th>
                <th className="text-right p-3">FOB</th>
                <th className="text-right p-3">Costos</th>
                <th className="text-right p-3">Total USD</th>
              </tr>
            </thead>
            <tbody>
              {folders.map(f => {
                const fob = allProducts.filter(p => p.folder_id === f.id).reduce((s, p) => s + p.quantity * p.unit_price_fob, 0);
                const costs = totalFolderCosts(f.id!, allCosts);
                const total = fob + (f.international_freight || 0) + (f.international_insurance || 0) + costs;
                return (
                  <tr key={f.id} className="border-b border-border/20 last:border-0 hover:bg-white/[0.02] transition-all duration-150">
                    <td className="p-3 font-mono text-sm text-foreground/80 font-medium">{f.folder_number}</td>
                    <td className="p-3 text-foreground/80 text-sm">{f.supplier || '—'}</td>
                    <td className="p-3">
                      <Badge variant={f.status === 'en_proceso' ? 'warning' : 'success'}>
                        {f.status === 'en_proceso' ? 'En Proceso' : 'Cerrado'}
                      </Badge>
                    </td>
                    <td className="p-3 text-right text-foreground/80 text-sm">{formatCurrency(fob)}</td>
                    <td className="p-3 text-right text-foreground/80 text-sm">{formatCurrency(costs)}</td>
                    <td className="p-3 text-right font-bold text-foreground/90 text-sm">{formatCurrency(total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Por Producto (Top)</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 text-[11px] text-muted-foreground/65 uppercase tracking-wider font-semibold">
                <th className="text-left p-3">Código</th>
                <th className="text-left p-3">Descripción</th>
                <th className="text-right p-3">Cant. Total</th>
                <th className="text-right p-3">FOB Total</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.slice(0, 20).map(p => (
                <tr key={p.code} className="border-b border-border/20 last:border-0 hover:bg-white/[0.02] transition-all duration-150">
                  <td className="p-3 font-mono text-sm text-foreground/80 font-medium">{p.code}</td>
                  <td className="p-3 text-foreground/80 text-sm">{p.description}</td>
                  <td className="p-3 text-right text-foreground/80 text-sm">{p.quantity}</td>
                  <td className="p-3 text-right font-bold text-foreground/90 text-sm">{formatCurrency(p.totalFob)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
