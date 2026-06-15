import { useEffect, useState } from 'react';
import { useAuthStore } from '@application/state/authStore';
import { authService } from '@infrastructure/api/authService';
import { User } from '@domain/models';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import '../../styles/components.css';

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
    const styles: Record<string, { color: string; border: string; shadow: string }> = {
      admin: { color: '#f87171', border: 'rgba(239, 68, 68, 0.3)', shadow: 'rgba(239, 68, 68, 0.2)' },
      supervisor: { color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)', shadow: 'rgba(245, 158, 11, 0.2)' },
      operator: { color: '#34d399', border: 'rgba(16, 185, 129, 0.3)', shadow: 'rgba(16, 185, 129, 0.2)' },
      reader: { color: '#c084fc', border: 'rgba(192, 132, 252, 0.3)', shadow: 'rgba(192, 132, 252, 0.2)' }
    };
    const s = styles[role] || styles.reader;
    return (
      <span 
        className="glass-badge" 
        style={{ 
          color: s.color, 
          borderColor: s.border,
          boxShadow: `0 2px 8px ${s.shadow}`
        }}
      >
        {role}
      </span>
    );
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <Shield size={36} style={{ color: 'var(--color-error)' }} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Acceso Restringido
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            No tienes permisos para acceder a esta sección
          </p>
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
          <Plus size={18} /> Nuevo Usuario
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0' }}>
        <div className="table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Usuario</th>
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
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 700
                      }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{u.email}</td>
                  <td>{getRoleBadge(u.role)}</td>
                  <td>
                    <span className={`glass-badge ${u.isActive ? 'badge-arrived' : 'badge-draft'}`}>
                      {u.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Nunca'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="icon-button">
                        <Edit size={16} />
                      </button>
                      {u.id !== currentUser?.id && (
                        <button className="icon-button danger">
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
