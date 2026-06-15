import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { importService } from '@infrastructure/api/importService';
import { Import, ImportedProduct, Cost, LogisticsData, FinancialSummary } from '@domain/models';
import { Package, Truck, DollarSign, TrendingUp, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '@application/state/authStore';
import '../../styles/components.css';

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
        <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
          <span className={`glass-badge badge-${importData.status}`}>
            {importData.status === 'draft' && 'Borrador'}
            {importData.status === 'in_progress' && 'En Progreso'}
            {importData.status === 'arrived' && 'Llegada'}
            {importData.status === 'closed' && 'Cerrada'}
          </span>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Iniciada: {new Date(importData.startDate).toLocaleDateString()}
          </span>
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon size={18} style={{ marginRight: '0.5rem' }} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'logistics' && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>Datos Logísticos</h2>
          {logistics ? (
            <div className="grid grid-2" style={{ gap: '2rem' }}>
              {[
                { label: 'Incoterm', value: logistics.incoterm },
                { label: 'Broker', value: logistics.brokerName || '-' },
                { label: 'País Origen', value: logistics.originCountry || '-' },
                { label: 'Método de Envío', value: logistics.shippingMethod || '-' },
                { label: 'Tracking', value: logistics.trackingNumber || '-' },
                { label: 'Destino', value: logistics.destinationCountry }
              ].map((item) => (
                <div key={item.label}>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--color-text-secondary)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                  }}>
                    {item.label}
                  </p>
                  <p style={{ 
                    fontWeight: 500,
                    fontSize: '1rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: 'var(--color-text-secondary)'
            }}>
              <Truck size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>No hay datos logísticos registrados</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="glass-card" style={{ padding: '0' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1.5rem 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Productos Importados</h2>
            {canEdit && (
              <button className="glass-button"><Plus size={18} /> Agregar</button>
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
                    <td style={{ fontWeight: 600 }}>{p.sku}</td>
                    <td>{p.name}</td>
                    <td>{p.quantity}</td>
                    <td>${p.fobPrice.toFixed(2)}</td>
                    <td>{p.expectedMargin}%</td>
                    <td style={{ fontWeight: 600 }}>${(p.quantity * p.fobPrice).toFixed(2)}</td>
                    {canEdit && (
                      <td>
                        <button className="icon-button danger">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 7 : 6} style={{ 
                      textAlign: 'center', 
                      color: 'var(--color-text-secondary)', 
                      padding: '3rem 2rem'
                    }}>
                      <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                      <p>No hay productos agregados</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'costs' && (
        <div className="glass-card" style={{ padding: '0' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1.5rem 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Costos Logísticos</h2>
            {canEdit && (
              <button className="glass-button"><Plus size={18} /> Agregar</button>
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
                    <td style={{ fontWeight: 600 }}>{c.concept}</td>
                    <td><span className="glass-badge">{c.category}</span></td>
                    <td style={{ fontWeight: 600 }}>${c.amount.toFixed(2)}</td>
                    <td>{c.currency}</td>
                    {canEdit && (
                      <td>
                        <button className="icon-button danger">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {costs.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 5 : 4} style={{ 
                      textAlign: 'center', 
                      color: 'var(--color-text-secondary)', 
                      padding: '3rem 2rem'
                    }}>
                      <DollarSign size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                      <p>No hay costos registrados</p>
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
          <div className="grid grid-4" style={{ marginBottom: '2.5rem' }}>
            {[
              { label: 'Valor FOB Total', value: financial.totalFobValue, color: '#7c3aed' },
              { label: 'Costos Logísticos', value: financial.totalLogisticsCosts, color: '#f59e0b' },
              { label: 'Costo Total', value: financial.totalLandedCost, color: '#ef4444' },
              { label: 'ROI Promedio', value: financial.summary.averageROI, suffix: '%', color: '#10b981' }
            ].map((stat) => (
              <div key={stat.label} className="glass-card stat-card">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value" style={{ 
                  background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}cc 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {stat.suffix ? `${stat.value.toFixed(1)}${stat.suffix}` : `$${stat.value.toFixed(2)}`}
                </p>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: '0' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Desglose por Producto</h2>
            </div>
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
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td>${p.unitCost.toFixed(2)}</td>
                      <td>${p.expectedRevenue.toFixed(2)}</td>
                      <td style={{ 
                        color: p.expectedProfit >= 0 ? 'var(--color-success)' : 'var(--color-error)',
                        fontWeight: 600
                      }}>
                        ${p.expectedProfit.toFixed(2)}
                      </td>
                      <td style={{ fontWeight: 600 }}>{p.roi.toFixed(1)}%</td>
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
