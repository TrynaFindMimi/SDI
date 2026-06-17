import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { seedData } from '../lib/seed';
import { Lock, Mail, Eye, EyeOff, Ship, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components/ui';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { seedData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!email.includes('@')) {
      setError('Ingresa un email válido');
      setLoading(false);
      return;
    }
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
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

      <div className="relative w-full max-w-sm space-y-10 animate-in">
        <div className="text-center space-y-5">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl glass shimmer relative overflow-hidden mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-transparent" />
            <Ship className="w-10 h-10 text-primary relative z-10" />
          </div>
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-foreground">LogiCost Pro</h1>
            <p className="text-[15px] text-muted-foreground/70 mt-2">Sistema de Gestión de Importaciones</p>
          </div>
        </div>

        <div className="rounded-2xl glass p-7 space-y-5 animate-in delay-200">
          {error && (
            <div className="flex items-center gap-3 text-sm text-red-400 bg-red-500/8 rounded-xl px-4 py-3.5 border border-red-500/10 animate-in-scale font-medium">
              <Lock size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button type="submit" disabled={loading} variant="default" size="lg" className="w-full mt-2">
              {loading ? 'Iniciando sesión...' : (
                <>
                  Iniciar sesión
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground/70">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Solicitar acceso
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
