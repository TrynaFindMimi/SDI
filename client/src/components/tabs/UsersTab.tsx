import { useAuth } from '../../lib/auth';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '../ui';
import { Users, Shield, ShieldCheck } from 'lucide-react';

const ALL_USERS = [
  { id: '1', name: 'Admin Demo', email: 'admin@logicost.com', role: 'admin' as const, createdAt: '2025-01-01' },
  { id: '2', name: 'Usuario Demo', email: 'user@logicost.com', role: 'user' as const, createdAt: '2025-01-15' },
];

export function UsersTab() {
  const { user, isAdmin } = useAuth();

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary/60 shadow-[0_0_6px_hsl(var(--primary)/0.3)]" />
          <CardTitle>Usuarios del Sistema</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30 text-[11px] text-muted-foreground/65 uppercase tracking-wider font-semibold">
              <th className="text-left p-3.5">Nombre</th>
              <th className="text-left p-3.5">Email</th>
              <th className="text-left p-3.5">Rol</th>
              <th className="text-left p-3.5 hidden md:table-cell">Creado</th>
            </tr>
          </thead>
          <tbody>
            {ALL_USERS.map(u => (
              <tr key={u.id} className={`border-b border-border/20 last:border-0 hover:bg-white/[0.03] transition-colors ${u.id === user?.id ? 'bg-white/[0.04]' : ''}`}>
                <td className="p-3.5 font-semibold text-foreground/90">
                  {u.name} {u.id === user?.id && <span className="text-xs text-muted-foreground/50 ml-1 font-normal">(tú)</span>}
                </td>
                <td className="p-3.5 text-foreground/70 text-sm">{u.email}</td>
                <td className="p-3.5">
                  {u.role === 'admin' ? (
                    <Badge variant="default" className="gap-1.5">
                      <ShieldCheck size={11} /> admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1.5">
                      <Users size={11} /> user
                    </Badge>
                  )}
                </td>
                <td className="p-3.5 text-muted-foreground/60 hidden md:table-cell text-sm">{u.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
