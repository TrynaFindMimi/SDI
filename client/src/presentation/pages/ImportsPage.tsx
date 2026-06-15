import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImportStore } from '@application/state/importStore';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { ImportStatus } from '@domain/models';
import { useAuthStore } from '@application/state/authStore';
import '../styles/components.css';

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
            <Plus size={16} /> Nueva Importación
          </button>
        )}
      </div>

      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            placeholder="Buscar por número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
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
                  <td style={{ fontWeight: 500 }}>{imp.importNumber}</td>
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
                        onClick={() => navigate(`/imports/${imp.id}`)}
                        style={{ background: 'none', color: 'var(--color-accent)', padding: '0.5rem' }}
                      >
                        <Eye size={16} />
                      </button>
                      {canDelete && imp.status !== ImportStatus.CLOSED && (
                        <button
                          onClick={() => handleDelete(imp.id)}
                          style={{ background: 'none', color: 'var(--color-error)', padding: '0.5rem' }}
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
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                    No se encontraron importaciones
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              Nueva Importación
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
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
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                  Llegada Estimada
                </label>
                <input
                  type="date"
                  value={newImport.estimatedArrival}
                  onChange={(e) => setNewImport({ ...newImport, estimatedArrival: e.target.value })}
                  className="glass-input"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="glass-button" onClick={handleCreate}>
                  Crear
                </button>
                <button className="glass-button glass-button-secondary" onClick={() => setShowModal(false)}>
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
