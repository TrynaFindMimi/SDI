import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImportStore } from '@application/state/importStore';
import { Plus, Search, Eye, Trash2, Package } from 'lucide-react';
import { ImportStatus } from '@domain/models';
import { useAuthStore } from '@application/state/authStore';
import '../../styles/components.css';

export function ImportsPage() {
  const { imports, fetchAll, create, remove } = useImportStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newImport, setNewImport] = useState({ importNumber: '', estimatedArrival: '' });

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = imports.filter(i =>
    i.importNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    await create(newImport);
    setShowModal(false);
    setNewImport({ importNumber: '', estimatedArrival: '' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta importación?')) {
      await remove(id);
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'supervisor' || user?.role === 'operator';
  const canDelete = user?.role === 'admin' || user?.role === 'supervisor';

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Importaciones</h1>
          <p className="page-subtitle">Gestiona tus carpetas de importación</p>
        </div>
        {canEdit && (
          <button className="glass-button" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Nueva Importación
          </button>
        )}
      </div>

      <div className="glass-card" style={{ padding: '1rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--color-text-secondary)',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Buscar por número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input"
            style={{ paddingLeft: '3rem' }}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0' }}>
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Estado</th>
                <th>Fecha Inicio</th>
                <th>Llegada Est.</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((imp) => (
                <tr key={imp.id}>
                  <td style={{ fontWeight: 600 }}>{imp.importNumber}</td>
                  <td>
                    <span className={`glass-badge badge-${imp.status}`}>
                      {imp.status === ImportStatus.DRAFT && 'Borrador'}
                      {imp.status === ImportStatus.IN_PROGRESS && 'En Progreso'}
                      {imp.status === ImportStatus.ARRIVED && 'Llegada'}
                      {imp.status === ImportStatus.CLOSED && 'Cerrada'}
                    </span>
                  </td>
                  <td>{new Date(imp.startDate).toLocaleDateString()}</td>
                  <td>{imp.estimatedArrival ? new Date(imp.estimatedArrival).toLocaleDateString() : '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="icon-button"
                        onClick={() => navigate(`/imports/${imp.id}`)}
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      {canDelete && imp.status !== ImportStatus.CLOSED && (
                        <button
                          className="icon-button danger"
                          onClick={() => handleDelete(imp.id)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ 
                    textAlign: 'center', 
                    color: 'var(--color-text-secondary)', 
                    padding: '4rem 2rem'
                  }}>
                    <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p style={{ fontSize: '1rem', fontWeight: 500 }}>
                      {search ? 'No se encontraron resultados' : 'No hay importaciones registradas'}
                    </p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      {search ? 'Intenta con otro término de búsqueda' : 'Crea tu primera importación para comenzar'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 700, 
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, #fafafa 0%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Nueva Importación
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.75rem', 
                  color: 'var(--color-text-secondary)', 
                  marginBottom: '0.5rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Número de Importación *
                </label>
                <input
                  type="text"
                  value={newImport.importNumber}
                  onChange={(e) => setNewImport({ ...newImport, importNumber: e.target.value })}
                  className="glass-input"
                  placeholder="IMP-2026-001"
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.75rem', 
                  color: 'var(--color-text-secondary)', 
                  marginBottom: '0.5rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Llegada Estimada
                </label>
                <input
                  type="date"
                  value={newImport.estimatedArrival}
                  onChange={(e) => setNewImport({ ...newImport, estimatedArrival: e.target.value })}
                  className="glass-input"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="glass-button" onClick={handleCreate} style={{ flex: 1, justifyContent: 'center' }}>
                  Crear Importación
                </button>
                <button 
                  className="glass-button glass-button-secondary" 
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
