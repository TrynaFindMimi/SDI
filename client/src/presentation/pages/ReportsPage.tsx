import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';
import '../styles/components.css';

export function ReportsPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Reportes y KPIs</h1>
        <p className="page-subtitle">Análisis y métricas clave del negocio</p>
      </div>

      <div className="grid grid-4">
        <div className="glass-card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="stat-label">Importaciones Activas</p>
              <p className="stat-value">12</p>
            </div>
            <Package size={24} style={{ color: '#a855f7', opacity: 0.8 }} />
          </div>
        </div>
        <div className="glass-card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="stat-label">Inversión Total</p>
              <p className="stat-value">$45.2K</p>
            </div>
            <DollarSign size={24} style={{ color: '#10b981', opacity: 0.8 }} />
          </div>
        </div>
        <div className="glass-card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="stat-label">ROI Promedio</p>
              <p className="stat-value">28.5%</p>
            </div>
            <TrendingUp size={24} style={{ color: '#f59e0b', opacity: 0.8 }} />
          </div>
        </div>
        <div className="glass-card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="stat-label">Margen Promedio</p>
              <p className="stat-value">22.3%</p>
            </div>
            <BarChart3 size={24} style={{ color: '#6b21a8', opacity: 0.8 }} />
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
            Distribución de Costos
          </h2>
          <div style={{
            height: '250px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-secondary)',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 'var(--radius-md)'
          }}>
            <p>Gráfico de distribución de costos</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
            Rentabilidad por Importación
          </h2>
          <div style={{
            height: '250px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-secondary)',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 'var(--radius-md)'
          }}>
            <p>Gráfico de rentabilidad</p>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
          Top Productos por Rentabilidad
        </h2>
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Importación</th>
                <th>Inversión</th>
                <th>Ganancia Esperada</th>
                <th>ROI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Producto A</td>
                <td>IMP-2026-001</td>
                <td>$5,200.00</td>
                <td style={{ color: 'var(--color-success)' }}>$1,820.00</td>
                <td>35.0%</td>
              </tr>
              <tr>
                <td>Producto B</td>
                <td>IMP-2026-002</td>
                <td>$3,800.00</td>
                <td style={{ color: 'var(--color-success)' }}>$1,140.00</td>
                <td>30.0%</td>
              </tr>
              <tr>
                <td>Producto C</td>
                <td>IMP-2026-001</td>
                <td>$2,100.00</td>
                <td style={{ color: 'var(--color-success)' }}>$525.00</td>
                <td>25.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
