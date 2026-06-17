import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Ship, ArrowRight, Mail, Lock, User, Eye, EyeOff, Briefcase } from 'lucide-react';
import { Button, Input, Select } from '../components/ui';

const API = '/api/v1';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [role, setRole] = useState('analista');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, passwordConfirm, role })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || 'Error al registrar');
        setLoading(false);
        return;
      }

      setSuccess(data.message || 'Solicitud enviada correctamente');
      setLoading(false);

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch {
      setError('Error de conexión con el servidor');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 25% 15%, rgba(99,102,241,0.12) 0%, transparent 55%), radial-gradient(ellipse at 75% 85%, rgba(6,182,212,0.07) 0%, transparent 55%), #050712'
      }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.025)_0%,transparent_70%)]" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/6 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/4 rounded-full blur-3xl" />

      <div className="relative w-full max-w-sm space-y-8 animate-in">
        <div className="text-center space-y-5">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl glass shimmer relative overflow-hidden mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-transparent" />
            <Ship className="w-10 h-10 text-primary relative z-10" />
          </div>
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-foreground">LogiCost Pro</h1>
            <p className="text-[15px] text-muted-foreground/70 mt-2">Solicitar acceso al sistema</p>
          </div>
        </div>

        <div className="rounded-2xl glass p-7 space-y-5 animate-in delay-200">
          {success && (
            <div className="flex items-center gap-3 text-sm text-emerald-400 bg-emerald-500/8 rounded-xl px-4 py-3.5 border border-emerald-500/10 animate-in-scale font-medium">
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 text-sm text-red-400 bg-red-500/8 rounded-xl px-4 py-3.5 border border-red-500/10 animate-in-scale font-medium">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/45" />
                <Input
                  type="text" value={name} placeholder="Tu nombre"
                  onChange={e => setName(e.target.value)}
                  className="pl-11 h-11 text-[15px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/45" />
                <Input
                  type="email" value={email} placeholder="tu@email.com"
                  onChange={e => setEmail(e.target.value)}
                  className="pl-11 h-11 text-[15px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Rol</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/45" />
                <Select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="pl-11 h-11 text-[15px]"
                >
                  <option value="analista">Analista</option>
                  <option value="consultor">Consultor</option>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/45" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password} placeholder="••••••••"
                  onChange={e => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-11 text-[15px]"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/45 hover:text-foreground/65 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/45" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordConfirm} placeholder="••••••••"
                  onChange={e => setPasswordConfirm(e.target.value)}
                  className="pl-11 h-11 text-[15px]"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} variant="default" size="lg" className="w-full mt-2">
              {loading ? 'Enviando solicitud...' : (
                <>
                  Solicitar acceso
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <div className="text-center border-t border-border/40 pt-5">
            <p className="text-sm text-muted-foreground/70">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
