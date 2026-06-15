import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImportStore } from '@application/state/importStore';
import { Package, TrendingUp, DollarSign, Clock, ArrowUpRight } from 'lucide-react';
import { ImportStatus } from '@domain/models';
import '../../styles/components.css';

export function DashboardPage() {
  const { imports, fetchAll } = useImportStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const stats = {
    total: imports.length,
    inProgress: imports.filter(i => i.status === ImportStatus.IN_PROGRESS).length,
    arrived: imports.filter(i => i.status === ImportStatus.ARRIVED).length,
    closed: imports.filter(i => i.status === ImportStatus.CLOSED).length
  };

  const statCards = [
    { 
      label: 'Total Importaciones', 
      value: stats.total, 
      icon: Package, 
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      shadow: 'rgba(124, 58, 237, 0.3)'
    },
    { 
      label: 'En Progreso', 
      value: stats.inProgress, 
      icon: Clock, 
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      shadow: 'rgba(245, 158, 11, 0.3)'
    },
    { 
      label: 'Llegadas', 
      value: stats.arrived, 
      icon: TrendingUp, 
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      shadow: 'rgba(16, 185, 129, 0.3)'
    },
    { 
      label: 'Cerradas', 
      value: stats.closed, 
      icon: DollarSign, 
      gradient: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
      shadow: 'rgba(91, 33, 182, 0.3)'
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen general de importaciones</p>
      </div>

      <div className="grid grid-4">
        {statCards.map((stat, index) => (
          <div 
            key={stat.label} 
            className="glass-card stat-card"
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ marginTop: '2.5rem', padding: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Importaciones Recientes
          </h2>
          <button 
            onClick={() => navigate('/imports')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            Ver todas <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Estado</th>
                <th>Fecha Inicio</th>
                <th>Llegada Estimada</th>
              </tr>
            </thead>
            <tbody>
              {imports.slice(0, 5).map((imp) => (
                <tr 
                  key={imp.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/imports/${imp.id}`)}
                >
                  <td style={{ fontWeight: 600 }}>{imp.importNumber}</td>
                  <td>
                    <span className={`glass-badge badge-${imp.status}`}>
                      {imp.status === 'draft' && 'Borrador'}
                      {imp.status === 'in_progress' && 'En Progreso'}
                      {imp.status === 'arrived' && 'Llegada'}
                      {imp.status === 'closed' && 'Cerrada'}
                    </span>
                  </td>
                  <td>{new Date(imp.startDate).toLocaleDateString()}</td>
                  <td>{imp.estimatedArrival ? new Date(imp.estimatedArrival).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
              {imports.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ 
                    textAlign: 'center', 
                    color: 'var(--color-text-secondary)', 
                    padding: '3rem 2rem'
                  }}>
                    <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p>No hay importaciones registradas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
