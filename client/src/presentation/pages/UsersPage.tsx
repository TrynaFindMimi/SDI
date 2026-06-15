import { useEffect, useState } from 'react';
import { useAuthStore } from '@application/state/authStore';
import { authService } from '@infrastructure/api/authService';
import { User } from '@domain/models';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import '../styles/components.css';

export function UsersPage() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await authService.getAll();
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: '#ef4444',
      supervisor: '#f59e0b',
      operator: '#10b981',
      reader: '#6b21a8'
    };
    return (
      <span className="glass-badge" style={{ color: colors[role] || '#a1a1aa', borderColor: `${colors[role]}33` || 'var(--glass-border)' }}>
        {role}
      </span>
    );
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <Shield size={48} style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--color-text-secondary)' }}>No tienes permisos para acceder a esta sección</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Gestión de Usuarios</h1>
          <p className="page-subtitle">Administra accesos y permisos</p>
        </div>
        <button className="glass-button">
          <Plus size={16} /> Nuevo Usuario
        </button>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Último Acceso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{getRoleBadge(u.role)}</td>
                  <td>
                    <span className={`glass-badge ${u.isActive ? 'badge-arrived' : 'badge-draft'}`}>
                      {u.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Nunca'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ background: 'none', color: 'var(--color-accent)', padding: '0.5rem' }}>
                        <Edit size={16} />
                      </button>
                      {u.id !== currentUser?.id && (
                        <button style={{ background: 'none', color: 'var(--color-error)', padding: '0.5rem' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
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
