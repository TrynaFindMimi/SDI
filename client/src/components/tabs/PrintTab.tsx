import { useRef } from 'react';
import { useFolders } from '../../hooks/useData';
import { useFolderProducts, useFolderCosts } from '../../hooks/useData';
import { Button } from '../ui';
import { formatCurrency, calcUsd, formatDate } from '../../lib/utils';
import { Printer, FileText } from 'lucide-react';

export function PrintTab({ activeFolderId }: { activeFolderId: string | null }) {
  const { folders } = useFolders();
  const { products } = useFolderProducts(activeFolderId);
  const { costs } = useFolderCosts(activeFolderId);
  const printRef = useRef<HTMLDivElement>(null);

  const folder = folders.find(f => f.id === activeFolderId);
  if (!folder) return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="text-muted-foreground/15 mb-4"><Printer size={56} /></div>
      <p className="text-base font-semibold text-muted-foreground/65">Selecciona una carpeta para imprimir</p>
      <p className="text-sm text-muted-foreground/40 mt-2">Elige una carpeta en la pestaña "Carpetas"</p>
    </div>
  );

  const totalFob = products.reduce((s, p) => s + p.quantity * p.unit_price_fob, 0);
  const totalCif = totalFob + (folder.international_freight || 0) + (folder.international_insurance || 0);
  const totalCostsUsd = costs.reduce((s, c) => s + calcUsd(c), 0);
  const totalInvertido = totalCif + totalCostsUsd;

  return (
    <div className="space-y-5">
      <div className="no-print flex justify-between items-center">
        <p className="text-[15px] text-muted-foreground/65 flex items-center gap-2.5 font-medium">
          <FileText size={16} />
          <span className="font-mono">{folder.folder_number}</span>
        </p>
        <Button onClick={() => window.print()} variant="default" size="sm">
          <Printer size={15} /> Imprimir / Guardar PDF
        </Button>
      </div>

      <div ref={printRef} className="space-y-6 bg-white text-black p-8 rounded-xl print:p-0 print:rounded-none">
        <div className="text-center border-b border-gray-200 pb-5 mb-5">
          <h1 className="text-2xl font-bold tracking-tight">LogiCost Pro</h1>
          <p className="text-sm text-gray-500 mt-1">Reporte de Importación</p>
          <p className="text-sm text-gray-500 mt-0.5">N° {folder.folder_number} — {formatDate(new Date().toISOString())}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong className="text-gray-700">Proveedor:</strong> <span className="text-gray-600">{folder.supplier || '—'}</span></div>
          <div><strong className="text-gray-700">Broker:</strong> <span className="text-gray-600">{folder.broker || '—'}</span></div>
          <div><strong className="text-gray-700">Factura(s):</strong> <span className="text-gray-600">{folder.invoice_numbers || '—'}</span></div>
          <div><strong className="text-gray-700">Incoterm:</strong> <span className="text-gray-600">{folder.incoterm}</span></div>
          <div><strong className="text-gray-700">Transporte:</strong> <span className="text-gray-600">{folder.transport_mode}</span></div>
          <div><strong className="text-gray-700">T.C.:</strong> <span className="text-gray-600">{folder.exchange_rate}</span></div>
          <div><strong className="text-gray-700">Fecha inicio:</strong> <span className="text-gray-600">{formatDate(folder.start_date)}</span></div>
          <div><strong className="text-gray-700">Estado:</strong> <span className="text-gray-600">{folder.status === 'en_proceso' ? 'En Proceso' : 'Cerrado'}</span></div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2.5 text-gray-800">Productos</h3>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left p-1.5 font-semibold text-gray-600">Código</th>
                <th className="text-left p-1.5 font-semibold text-gray-600">Descripción</th>
                <th className="text-right p-1.5 font-semibold text-gray-600">Cant.</th>
                <th className="text-right p-1.5 font-semibold text-gray-600">P.U. FOB</th>
                <th className="text-right p-1.5 font-semibold text-gray-600">Total FOB</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-gray-200">
                  <td className="p-1.5 text-gray-700">{p.code}</td>
                  <td className="p-1.5 text-gray-700">{p.description}</td>
                  <td className="p-1.5 text-right text-gray-600">{p.quantity}</td>
                  <td className="p-1.5 text-right text-gray-600">${p.unit_price_fob.toFixed(2)}</td>
                  <td className="p-1.5 text-right text-gray-700 font-medium">${(p.quantity * p.unit_price_fob).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-xs space-y-1 mt-3">
            <div className="flex justify-between"><span className="text-gray-500">Total FOB:</span><span className="text-gray-700">${totalFob.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Flete:</span><span className="text-gray-700">${(folder.international_freight || 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Seguro:</span><span className="text-gray-700">${(folder.international_insurance || 0).toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-sm mt-1.5 pt-1.5 border-t border-gray-200">
              <span className="text-gray-800">Total CIF:</span><span className="text-gray-900">${totalCif.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {costs.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-2.5 text-gray-800">Costos</h3>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-1.5 font-semibold text-gray-600">Fecha</th>
                  <th className="text-left p-1.5 font-semibold text-gray-600">Comp.</th>
                  <th className="text-left p-1.5 font-semibold text-gray-600">Categoría</th>
                  <th className="text-left p-1.5 font-semibold text-gray-600">Descripción</th>
                  <th className="text-right p-1.5 font-semibold text-gray-600">Total USD</th>
                </tr>
              </thead>
              <tbody>
                {costs.map(c => (
                  <tr key={c.id} className="border-b border-gray-200">
                    <td className="p-1.5 text-gray-700">{c.date}</td>
                    <td className="p-1.5 text-gray-600">{c.receipt_number || '—'}</td>
                    <td className="p-1.5 text-gray-600">{c.category}</td>
                    <td className="p-1.5 text-gray-700">{c.description}</td>
                    <td className="p-1.5 text-right text-gray-700 font-medium">{formatCurrency(calcUsd(c))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t-2 border-gray-300 pt-4 text-sm">
          <div className="flex justify-between font-bold text-base mb-1">
            <span className="text-gray-800">Total Invertido (USD):</span>
            <span className="text-gray-900">${totalInvertido.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base">
            <span className="text-gray-800">Total Invertido (BOB):</span>
            <span className="text-gray-900">{(totalInvertido * folder.exchange_rate).toFixed(2)} BOB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
