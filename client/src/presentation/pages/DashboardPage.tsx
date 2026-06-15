import { useEffect } from 'react';
import { useImportStore } from '@application/state/importStore';
import { Package, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { ImportStatus } from '@domain/models';
import '../styles/components.css';

export function DashboardPage() {
  const { imports, fetchAll } = useImportStore();

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
    { label: 'Total Importaciones', value: stats.total, icon: Package, color: '#a855f7' },
    { label: 'En Progreso', value: stats.inProgress, icon: Clock, color: '#f59e0b' },
    { label: 'Llegadas', value: stats.arrived, icon: TrendingUp, color: '#10b981' },
    { label: 'Cerradas', value: stats.closed, icon: DollarSign, color: '#6b21a8' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen general de importaciones</p>
      </div>

      <div className="grid grid-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-card stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
              <stat.icon size={24} style={{ color: stat.color, opacity: 0.8 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
          Importaciones Recientes
        </h2>
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
                <tr key={imp.id}>
                  <td style={{ fontWeight: 500 }}>{imp.importNumber}</td>
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
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                    No hay importaciones registradas
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
