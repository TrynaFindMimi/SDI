import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { Card, CardHeader, CardTitle, CardContent, Input, Label, Button, Badge } from '../ui';
import { User, Mail, Lock, Save, CheckCircle } from 'lucide-react';

export function ProfileTab() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const data: { name?: string; email?: string; password?: string } = {};
      if (name !== user?.name) data.name = name;
      if (email !== user?.email) data.email = email;
      if (newPassword) data.password = newPassword;

      if (Object.keys(data).length === 0) {
        setError('No hay cambios para guardar');
        setLoading(false);
        return;
      }

      await updateProfile(data);
      setSuccess('Perfil actualizado correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary/60 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
          <h2 className="text-lg font-bold tracking-tight">Mi Perfil</h2>
        </div>
        <Badge variant="info">{user?.role}</Badge>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3.5 text-[13px] text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/8 px-4 py-3.5 text-[13px] text-green-400">
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/45" />
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="pl-11 h-11 text-[15px]"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/45" />
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-11 h-11 text-[15px]"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/30">
              <h3 className="text-sm font-semibold text-foreground/80 mb-4">Cambiar Contraseña</h3>
              <p className="text-xs text-muted-foreground/60 mb-4">Deja en blanco si no deseas cambiarla</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nueva Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/45" />
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="pl-11 h-11 text-[15px]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Confirmar Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/45" />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="pl-11 h-11 text-[15px]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Contraseña Actual</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/45" />
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      className="pl-11 h-11 text-[15px]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? (
                  'Guardando...'
                ) : (
                  <>
                    <Save size={16} />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
