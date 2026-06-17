import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, AlertDialog } from '../ui';
import { Users, Shield, ShieldCheck, ShieldAlert, ShieldX, Check, X, RefreshCw } from 'lucide-react';

const API = '/api/v1';

interface ServerUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export function UsersTab() {
  const { user, token, isAdmin } = useAuth();
  const [users, setUsers] = useState<ServerUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionTarget, setActionTarget] = useState<ServerUser | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.error?.message || 'Error al cargar usuarios');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && token) {
      fetchUsers();
    }
  }, [isAdmin, token]);

  const handleAction = async () => {
    if (!actionTarget || !actionType || !token) return;
    try {
      const res = await fetch(`${API}/users/${actionTarget.id}/${actionType}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === actionTarget.id ? data.data : u));
      } else {
        setError(data.error?.message || `Error al ${actionType === 'approve' ? 'aprobar' : 'rechazar'}`);
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setActionTarget(null);
      setActionType(null);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="text-muted-foreground/15 mb-5"><Shield size={56} /></div>
          <p className="text-base font-semibold text-muted-foreground/65">Solo administradores</p>
          <p className="text-sm text-muted-foreground/40 mt-2">Necesitas permisos de administrador para ver esta sección</p>
        </CardContent>
      </Card>
    );
  }

  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsers = users.filter(u => u.status !== 'pending');
  const statusBadge = (status: string) => {
    if (status === 'approved') return <Badge variant="success" className="gap-1.5"><ShieldCheck size={11} /> Aprobado</Badge>;
    if (status === 'pending') return <Badge variant="warning" className="gap-1.5"><ShieldAlert size={11} /> Pendiente</Badge>;
    if (status === 'rejected') return <Badge variant="destructive" className="gap-1.5"><ShieldX size={11} /> Rechazado</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  const roleBadge = (role: string) => {
    if (role === 'admin') return <Badge variant="default" className="gap-1.5"><ShieldCheck size={11} /> admin</Badge>;
    return <Badge variant="secondary" className="gap-1.5"><Users size={11} /> {role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <AlertDialog
        open={!!actionTarget}
        onClose={() => { setActionTarget(null); setActionType(null); }}
        onConfirm={handleAction}
        title={actionType === 'approve' ? 'Aprobar usuario' : 'Rechazar usuario'}
        description={
          actionType === 'approve'
            ? `¿Estás seguro de aprobar a ${actionTarget?.name} (${actionTarget?.email})?`
            : `¿Estás seguro de rechazar la solicitud de ${actionTarget?.name} (${actionTarget?.email})?`
        }
        confirmText={actionType === 'approve' ? 'Aprobar' : 'Rechazar'}
        confirmVariant={actionType === 'approve' ? 'success' : 'destructive'}
      />

      {error && (
        <div className="flex items-center gap-3 text-sm text-red-400 bg-red-500/8 rounded-xl px-4 py-3.5 border border-red-500/10 font-medium">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError('')} className="ml-auto">X</Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div />
        <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading || !token}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </Button>
      </div>

      {pendingUsers.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60 shadow-[0_0_6px_hsl(var(--warning)/0.3)]" />
              <CardTitle>Solicitudes Pendientes ({pendingUsers.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 text-[11px] text-muted-foreground/65 uppercase tracking-wider font-semibold">
                  <th className="text-left p-3.5">Nombre</th>
                  <th className="text-left p-3.5">Email</th>
                  <th className="text-left p-3.5">Rol solicitado</th>
                  <th className="text-left p-3.5 hidden md:table-cell">Fecha</th>
                  <th className="text-right p-3.5">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map(u => (
                  <tr key={u.id} className="border-b border-border/20 last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className="p-3.5 font-semibold text-foreground/90">{u.name}</td>
                    <td className="p-3.5 text-foreground/70 text-sm">{u.email}</td>
                    <td className="p-3.5">{roleBadge(u.role)}</td>
                    <td className="p-3.5 text-muted-foreground/60 hidden md:table-cell text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="success" size="sm"
                          onClick={() => { setActionTarget(u); setActionType('approve'); }}
                        >
                          <Check size={14} /> Aprobar
                        </Button>
                        <Button
                          variant="destructive" size="sm"
                          onClick={() => { setActionTarget(u); setActionType('reject'); }}
                        >
                          <X size={14} /> Rechazar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary/60 shadow-[0_0_6px_hsl(var(--primary)/0.3)]" />
            <CardTitle>Usuarios del Sistema ({activeUsers.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {users.length === 0 && !loading && token ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-muted-foreground/15 mb-5"><Users size={48} /></div>
              <p className="text-[15px] font-medium text-muted-foreground/70">No se pudieron cargar usuarios</p>
              <p className="text-sm text-muted-foreground/45 mt-2">Verifica la conexión con el servidor</p>
            </div>
          ) : !token ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-muted-foreground/15 mb-5"><Shield size={48} /></div>
              <p className="text-[15px] font-medium text-muted-foreground/70">Inicia sesión con credenciales reales</p>
              <p className="text-sm text-muted-foreground/45 mt-2">La gestión de usuarios requiere conexión con el servidor</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 text-[11px] text-muted-foreground/65 uppercase tracking-wider font-semibold">
                  <th className="text-left p-3.5">Nombre</th>
                  <th className="text-left p-3.5">Email</th>
                  <th className="text-left p-3.5">Rol</th>
                  <th className="text-left p-3.5">Estado</th>
                  <th className="text-left p-3.5 hidden md:table-cell">Creado</th>
                </tr>
              </thead>
              <tbody>
                {activeUsers.map(u => (
                  <tr key={u.id} className={`border-b border-border/20 last:border-0 hover:bg-white/[0.03] transition-colors ${u.id === user?.id ? 'bg-white/[0.04]' : ''}`}>
                    <td className="p-3.5 font-semibold text-foreground/90">
                      {u.name} {u.id === user?.id && <span className="text-xs text-muted-foreground/50 ml-1 font-normal">(tú)</span>}
                    </td>
                    <td className="p-3.5 text-foreground/70 text-sm">{u.email}</td>
                    <td className="p-3.5">{roleBadge(u.role)}</td>
                    <td className="p-3.5">{statusBadge(u.status)}</td>
                    <td className="p-3.5 text-muted-foreground/60 hidden md:table-cell text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
