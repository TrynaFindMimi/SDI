import { useFolderProducts } from '../../hooks/useData';
import { useFolderCosts } from '../../hooks/useData';
import { ImportProduct } from '../../lib/entities';
import { Card, CardContent, CardHeader, CardTitle, Input, Badge } from '../ui';
import { FolderTimeline } from '../FolderTimeline';
import { formatCurrency, calcUsd } from '../../lib/utils';
import { useAuth } from '../../lib/auth';
import { BarChart3 } from 'lucide-react';
import type { ImportFolder as IF } from '../../lib/types';

interface ProductSummary {
  code: string;
  description: string;
  quantity: number;
  unit: string;
  unitPriceFob: number;
  totalFob: number;
  weight: number;
  proratedCost: number;
  totalCostUsd: number;
  unitCostUsd: number;
  unitCostBob: number;
  margin: number;
  salePriceUsd: number;
  salePriceBob: number;
  totalSaleUsd: number;
}

export function SummaryTab({ folder, onUpdate }: { folder: IF | null; onUpdate: () => void }) {
  const { isAdmin } = useAuth();
  const { products, refresh: refreshProducts } = useFolderProducts(folder?.id || null);
  const { costs } = useFolderCosts(folder?.id || null);

  if (!folder) return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="text-muted-foreground/15 mb-4"><BarChart3 size={56} /></div>
      <p className="text-base font-semibold text-muted-foreground/65">Selecciona una carpeta primero</p>
      <p className="text-sm text-muted-foreground/40 mt-2">Elige una carpeta para ver el resumen financiero</p>
    </div>
  );

  const isReadonly = !isAdmin || folder.status === 'cerrado';
  const totalFob = products.reduce((sum, p) => sum + p.quantity * p.unit_price_fob, 0);
  const totalCostosLocalesUsd = costs.reduce((sum, c) => sum + calcUsd(c), 0);
  const totalInvertidoUsd = totalFob + (folder.international_freight || 0) + (folder.international_insurance || 0) + totalCostosLocalesUsd;
  const totalInvertidoBob = totalInvertidoUsd * folder.exchange_rate;
  const totalQty = products.reduce((sum, p) => sum + p.quantity, 0);

  const summaries: ProductSummary[] = products.map(p => {
    const totalFobP = p.quantity * p.unit_price_fob;
    const weight = totalFob > 0 ? totalFobP / totalFob : 0;
    const prorated = ((folder.international_freight || 0) + (folder.international_insurance || 0) + totalCostosLocalesUsd) * weight;
    const totalCostUsd = totalFobP + prorated;
    const unitCostUsd = p.quantity > 0 ? totalCostUsd / p.quantity : 0;
    const unitCostBob = unitCostUsd * folder.exchange_rate;
    const margin = p.margin_percent ?? folder.default_margin;
    const salePriceUsd = margin >= 100 ? 0 : unitCostUsd / (1 - margin / 100);
    const salePriceBob = salePriceUsd * folder.exchange_rate;
    return {
      code: p.code, description: p.description,
      quantity: p.quantity, unit: p.unit,
      unitPriceFob: p.unit_price_fob, totalFob: totalFobP,
      weight, proratedCost: prorated, totalCostUsd,
      unitCostUsd, unitCostBob, margin,
      salePriceUsd, salePriceBob,
      totalSaleUsd: salePriceUsd * p.quantity,
    };
  });

  const totalSales = summaries.reduce((s, p) => s + p.totalSaleUsd, 0);
  const ganancia = totalSales - totalInvertidoUsd;
  const roi = totalInvertidoUsd > 0 ? (ganancia / totalInvertidoUsd) * 100 : 0;
  const avgUnitCost = totalQty > 0 ? totalInvertidoUsd / totalQty : 0;
  const weightedAvgSalePrice = totalQty > 0 ? summaries.reduce((s, p) => s + p.salePriceUsd * p.quantity, 0) / totalQty : 0;

  const handleMarginChange = async (productId: string, margin: number) => {
    await ImportProduct.update(productId, { margin_percent: margin });
    await refreshProducts();
    onUpdate();
  };

  return (
    <div className="space-y-5">
      <FolderTimeline folder={folder} />
      {isReadonly && <Badge variant="warning">Solo lectura</Badge>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Invertido (USD)', value: totalInvertidoUsd, currency: 'USD' as const },
          { label: 'Total Invertido (BOB)', value: totalInvertidoBob, currency: 'BOB' as const },
          { label: 'Costo Unit. Prom. (USD)', value: avgUnitCost, currency: 'USD' as const },
          { label: 'Precio Venta Prom. (USD)', value: weightedAvgSalePrice, currency: 'USD' as const },
          { label: 'Ganancia Estimada (USD)', value: ganancia, currency: 'USD' as const, highlight: true },
          { label: 'ROI (%)', value: roi, currency: undefined },
        ].map(({ label: lbl, value, currency, highlight }) => (
          <Card key={lbl} className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/55">{lbl}</p>
            <p className={`text-xl font-bold mt-2 tracking-tight ${
              highlight
                ? (value as number) >= 0 ? 'text-emerald-400' : 'text-red-400'
                : 'text-foreground'
            }`}>
              {currency ? formatCurrency(value as number, currency) : `${(value as number).toFixed(1)}%`}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Detalle por Producto</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 text-[11px] text-muted-foreground/65 uppercase tracking-wider font-semibold">
                <th className="text-left p-3">Producto</th>
                <th className="text-right p-3">Cant.</th>
                <th className="text-right p-3">Costo Unit. (USD)</th>
                <th className="text-right p-3">Costo Unit. (BOB)</th>
                <th className="text-right p-3">Margen %</th>
                <th className="text-right p-3">Precio Venta (USD)</th>
                <th className="text-right p-3">Precio Venta (BOB)</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((p, i) => (
                <tr key={i} className="border-b border-border/20 last:border-0 hover:bg-white/[0.03] transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-foreground/90">{p.code}</div>
                    <div className="text-xs text-muted-foreground/60 mt-0.5">{p.description}</div>
                  </td>
                  <td className="p-3 text-right text-foreground/75 text-sm">{p.quantity} {p.unit}</td>
                  <td className="p-3 text-right font-mono text-sm text-foreground/85 font-medium">{formatCurrency(p.unitCostUsd)}</td>
                  <td className="p-3 text-right font-mono text-sm text-foreground/85 font-medium">{formatCurrency(p.unitCostBob, 'BOB')}</td>
                  <td className="p-3 text-right">
                    {isReadonly ? (
                      <span className="text-foreground/75 font-medium text-sm">{p.margin}%</span>
                    ) : (
                      <Input
                        type="number"
                        className="w-[4.5rem] h-8 text-sm text-right inline-block"
                        value={p.margin}
                        onChange={e => handleMarginChange(products[i].id!, parseFloat(e.target.value) || 0)}
                      />
                    )}
                  </td>
                  <td className="p-3 text-right font-mono text-sm font-bold text-foreground/90">{formatCurrency(p.salePriceUsd)}</td>
                  <td className="p-3 text-right font-mono text-sm text-foreground/85 font-medium">{formatCurrency(p.salePriceBob, 'BOB')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
