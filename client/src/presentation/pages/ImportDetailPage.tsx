import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { importService } from '@infrastructure/api/importService';
import { Import, ImportedProduct, Cost, LogisticsData, FinancialSummary } from '@domain/models';
import { Package, Truck, DollarSign, TrendingUp, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '@application/state/authStore';
import '../styles/components.css';

type Tab = 'logistics' | 'products' | 'costs' | 'financial';

export function ImportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [importData, setImportData] = useState<Import | null>(null);
  const [logistics, setLogistics] = useState<LogisticsData | null>(null);
  const [products, setProducts] = useState<ImportedProduct[]>([]);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [financial, setFinancial] = useState<FinancialSummary | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('logistics');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [impRes, logRes, prodRes, costRes, finRes] = await Promise.all([
        importService.getById(id),
        importService.getLogistics(id),
        importService.getProducts(id),
        importService.getCosts(id),
        importService.getFinancialSummary(id)
      ]);
      setImportData(impRes.data);
      setLogistics(logRes.data);
      setProducts(prodRes.data);
      setCosts(costRes.data);
      setFinancial(finRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'logistics' as Tab, label: 'Datos Logísticos', icon: Truck },
    { id: 'products' as Tab, label: 'Productos', icon: Package },
    { id: 'costs' as Tab, label: 'Costos', icon: DollarSign },
    { id: 'financial' as Tab, label: 'Resumen Financiero', icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!importData) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Importación no encontrada</div>;
  }

  const canEdit = user?.role === 'admin' || user?.role === 'supervisor' || user?.role === 'operator';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{importData.importNumber}</h1>
        <p className="page-subtitle">
          <span className={`glass-badge badge-${importData.status}`} style={{ marginRight: '0.5rem' }}>
            {importData.status}
          </span>
          Iniciada: {new Date(importData.startDate).toLocaleDateString()}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="glass-button"
            style={{
              background: activeTab === tab.id ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' : 'rgba(255,255,255,0.05)',
              border: activeTab === tab.id ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--glass-border)'
            }}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'logistics' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Datos Logísticos</h2>
          {logistics ? (
            <div className="grid grid-2">
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Incoterm</p>
                <p style={{ fontWeight: 500 }}>{logistics.incoterm}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Broker</p>
                <p style={{ fontWeight: 500 }}>{logistics.brokerName || '-'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>País Origen</p>
                <p style={{ fontWeight: 500 }}>{logistics.originCountry || '-'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Método de Envío</p>
                <p style={{ fontWeight: 500 }}>{logistics.shippingMethod || '-'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Tracking</p>
                <p style={{ fontWeight: 500 }}>{logistics.trackingNumber || '-'}</p>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-secondary)' }}>No hay datos logísticos registrados</p>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Productos Importados</h2>
            {canEdit && (
              <button className="glass-button"><Plus size={16} /> Agregar</button>
            )}
          </div>
          <div className="table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Precio FOB</th>
                  <th>Margen %</th>
                  <th>Valor Total</th>
                  {canEdit && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.sku}</td>
                    <td>{p.name}</td>
                    <td>{p.quantity}</td>
                    <td>${p.fobPrice.toFixed(2)}</td>
                    <td>{p.expectedMargin}%</td>
                    <td>${(p.quantity * p.fobPrice).toFixed(2)}</td>
                    {canEdit && (
                      <td>
                        <button style={{ background: 'none', color: 'var(--color-error)', padding: '0.5rem' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 7 : 6} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                      No hay productos agregados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'costs' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Costos Logísticos</h2>
            {canEdit && (
              <button className="glass-button"><Plus size={16} /> Agregar</button>
            )}
          </div>
          <div className="table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th>Categoría</th>
                  <th>Monto</th>
                  <th>Moneda</th>
                  {canEdit && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {costs.map((c) => (
                  <tr key={c.id}>
                    <td>{c.concept}</td>
                    <td><span className="glass-badge">{c.category}</span></td>
                    <td>${c.amount.toFixed(2)}</td>
                    <td>{c.currency}</td>
                    {canEdit && (
                      <td>
                        <button style={{ background: 'none', color: 'var(--color-error)', padding: '0.5rem' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {costs.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 5 : 4} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                      No hay costos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'financial' && financial && (
        <div>
          <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
            <div className="glass-card stat-card">
              <p className="stat-label">Valor FOB Total</p>
              <p className="stat-value">${financial.totalFobValue.toFixed(2)}</p>
            </div>
            <div className="glass-card stat-card">
              <p className="stat-label">Costos Logísticos</p>
              <p className="stat-value">${financial.totalLogisticsCosts.toFixed(2)}</p>
            </div>
            <div className="glass-card stat-card">
              <p className="stat-label">Costo Total</p>
              <p className="stat-value">${financial.totalLandedCost.toFixed(2)}</p>
            </div>
            <div className="glass-card stat-card">
              <p className="stat-label">ROI Promedio</p>
              <p className="stat-value">{financial.summary.averageROI.toFixed(1)}%</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Desglose por Producto</h2>
            <div className="table-container">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Costo Unit.</th>
                    <th>Ingresos Esp.</th>
                    <th>Ganancia Esp.</th>
                    <th>ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {financial.productBreakdown.map((p) => (
                    <tr key={p.productId}>
                      <td>{p.name}</td>
                      <td>${p.unitCost.toFixed(2)}</td>
                      <td>${p.expectedRevenue.toFixed(2)}</td>
                      <td style={{ color: p.expectedProfit >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                        ${p.expectedProfit.toFixed(2)}
                      </td>
                      <td>{p.roi.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
