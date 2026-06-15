import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@application/state/authStore';
import {
  LayoutDashboard,
  Package,
  BookOpen,
  BarChart3,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import '../../styles/components.css';

export function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/imports', icon: Package, label: 'Importaciones' },
    { to: '/catalog', icon: BookOpen, label: 'Catálogo' },
    { to: '/reports', icon: BarChart3, label: 'Reportes' },
    ...(user?.role === 'admin' ? [{ to: '/users', icon: Users, label: 'Usuarios' }] : [])
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        className="glass-card"
        style={{
          width: sidebarOpen ? '280px' : '80px',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'fixed',
          height: '100vh',
          zIndex: 100,
          borderRadius: 0,
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(180deg, rgba(24, 24, 27, 0.95) 0%, rgba(9, 9, 11, 0.98) 100%)'
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '2.5rem', 
          padding: '0 0.75rem' 
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
              }}>
                <Package size={20} color="white" />
              </div>
              <span style={{ 
                fontSize: '1.25rem', 
                fontWeight: 800, 
                background: 'linear-gradient(135deg, #fafafa 0%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.025em'
              }}>
                SDI
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              color: 'var(--color-text-secondary)', 
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: sidebarOpen ? '0.875rem 1rem' : '0.875rem',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? 'var(--color-text)' : 'var(--color-text-secondary)',
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(192, 132, 252, 0.1) 100%)' 
                  : 'transparent',
                border: isActive ? '1px solid rgba(192, 132, 252, 0.2)' : '1px solid transparent',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s ease',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                position: 'relative',
                overflow: 'hidden'
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px',
                      height: '60%',
                      background: 'linear-gradient(180deg, var(--color-primary), var(--color-accent))',
                      borderRadius: '0 2px 2px 0'
                    }} />
                  )}
                  <item.icon size={20} style={{ flexShrink: 0 }} />
                  {sidebarOpen && (
                    <>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {isActive && <ChevronRight size={16} style={{ opacity: 0.5 }} />}
                    </>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
          paddingTop: '1rem', 
          marginTop: '1rem' 
        }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: sidebarOpen ? '0.875rem 1rem' : '0.875rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-secondary)',
              background: 'transparent',
              border: '1px solid transparent',
              width: '100%',
              fontSize: '0.875rem',
              fontWeight: 500,
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.color = '#fca5a5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            <LogOut size={20} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      <main style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? '280px' : '80px', 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh'
      }}>
        <header
          className="glass-card"
          style={{
            padding: '1.25rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            borderRadius: 0,
            borderLeft: 'none',
            borderRight: 'none',
            borderTop: 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(9, 9, 11, 0.8)'
          }}
        >
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              Bienvenido de vuelta
            </p>
            <p style={{ fontWeight: 700, fontSize: '1rem', marginTop: '0.125rem' }}>{user?.name}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--color-success)',
                boxShadow: '0 0 8px var(--color-success)'
              }} />
              <span className="glass-badge" style={{ 
                textTransform: 'capitalize', 
                border: 'none', 
                background: 'transparent',
                padding: 0
              }}>
                {user?.role}
              </span>
            </div>
          </div>
        </header>

        <div style={{ padding: '2.5rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
