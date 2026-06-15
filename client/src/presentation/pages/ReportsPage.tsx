import { BarChart3, TrendingUp, DollarSign, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import '../../styles/components.css';

export function ReportsPage() {
  const kpis = [
    { 
      label: 'Importaciones Activas', 
      value: '12', 
      icon: Package, 
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      shadow: 'rgba(124, 58, 237, 0.3)',
      trend: '+3 este mes',
      trendUp: true
    },
    { 
      label: 'Inversión Total', 
      value: '$45.2K', 
      icon: DollarSign, 
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      shadow: 'rgba(16, 185, 129, 0.3)',
      trend: '+12% vs anterior',
      trendUp: true
    },
    { 
      label: 'ROI Promedio', 
      value: '28.5%', 
      icon: TrendingUp, 
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      shadow: 'rgba(245, 158, 11, 0.3)',
      trend: '+2.3% vs anterior',
      trendUp: true
    },
    { 
      label: 'Margen Promedio', 
      value: '22.3%', 
      icon: BarChart3, 
      gradient: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
      shadow: 'rgba(91, 33, 182, 0.3)',
      trend: '-1.2% vs anterior',
      trendUp: false
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Reportes y KPIs</h1>
        <p className="page-subtitle">Análisis y métricas clave del negocio</p>
      </div>

      <div className="grid grid-4">
        {kpis.map((stat, index) => (
          <div 
            key={stat.label} 
            className="glass-card stat-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                background: stat.gradient,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${stat.shadow}`,
                position: 'relative'
              }}>
                <stat.icon size={24} color="white" />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: stat.gradient,
                  borderRadius: 'var(--radius-md)',
                  opacity: 0.4,
                  filter: 'blur(12px)',
                  zIndex: -1
                }} />
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.375rem',
              fontSize: '0.75rem',
              color: stat.trendUp ? 'var(--color-success)' : 'var(--color-error)'
            }}>
              {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-2" style={{ marginTop: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Distribución de Costos
          </h2>
          <div style={{
            height: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.1) 0%, transparent 70%)'
            }} />
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <BarChart3 size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                Gráfico de distribución de costos
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Rentabilidad por Importación
          </h2>
          <div style={{
            height: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)'
            }} />
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <TrendingUp size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                Gráfico de rentabilidad
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2.5rem', padding: '0' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Top Productos por Rentabilidad
          </h2>
        </div>
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
              {[
                { name: 'Producto A', imp: 'IMP-2026-001', inv: 5200, gain: 1820, roi: 35 },
                { name: 'Producto B', imp: 'IMP-2026-002', inv: 3800, gain: 1140, roi: 30 },
                { name: 'Producto C', imp: 'IMP-2026-001', inv: 2100, gain: 525, roi: 25 }
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{row.name}</td>
                  <td>{row.imp}</td>
                  <td>${row.inv.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                    ${row.gain.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span className="glass-badge badge-arrived">{row.roi}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
