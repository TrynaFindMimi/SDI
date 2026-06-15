import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@application/state/authStore';
import { Lock, Mail, Sparkles } from 'lucide-react';
import '../../styles/components.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(192, 132, 252, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      <div className="glass-card" style={{ 
        padding: '3rem', 
        maxWidth: '420px', 
        width: '100%',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 32px rgba(124, 58, 237, 0.4)',
            position: 'relative'
          }}>
            <Sparkles size={32} color="white" />
            <div style={{
              position: 'absolute',
              inset: '-2px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              borderRadius: 'var(--radius-lg)',
              opacity: 0.5,
              filter: 'blur(8px)',
              zIndex: -1
            }} />
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #fafafa 0%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.025em'
          }}>
            SDI
          </h1>
          <p style={{ 
            color: 'var(--color-text-secondary)', 
            fontSize: '0.875rem', 
            marginTop: '0.5rem',
            fontWeight: 400
          }}>
            Sistema de Gestión de Importaciones
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.875rem',
              backdropFilter: 'blur(10px)',
              animation: 'shake 0.5s ease'
            }}>
              <style>{`
                @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  25% { transform: translateX(-5px); }
                  75% { transform: translateX(5px); }
                }
              `}</style>
              {error}
            </div>
          )}

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
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--color-text-secondary)',
                pointerEvents: 'none'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
                placeholder="tu@email.com"
                style={{ paddingLeft: '3rem' }}
                required
              />
            </div>
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
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--color-text-secondary)',
                pointerEvents: 'none'
              }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                placeholder="••••••••"
                style={{ paddingLeft: '3rem' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="glass-button"
            disabled={isLoading}
            style={{ 
              marginTop: '0.5rem', 
              justifyContent: 'center',
              width: '100%',
              padding: '1rem'
            }}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                Iniciando sesión...
              </>
            ) : (
              <>
                Iniciar sesión
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            ¿Nuevo en SDI? Contacta al administrador
          </p>
        </div>
      </div>
    </div>
  );
}
