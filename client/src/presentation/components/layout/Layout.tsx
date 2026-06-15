import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@application/state/authStore';
import {
  LayoutDashboard,
  Package,
  BookOpen,
  BarChart3,
  Users,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import '../styles/components.css';

export function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          width: sidebarOpen ? '260px' : '70px',
          padding: '1.5rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          position: 'fixed',
          height: '100vh',
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', padding: '0 0.5rem' }}>
          {sidebarOpen && (
            <span style={{ fontSize: '1.25rem', fontWeight: 700, background: 'linear-gradient(135deg, #a855f7, #6b21a8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SDI
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', color: 'var(--color-text)', padding: '0.5rem' }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                background: isActive ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: isActive ? 500 : 400,
                transition: 'all 0.2s ease'
              })}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '1rem' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-secondary)',
              background: 'none',
              width: '100%',
              fontSize: '0.875rem'
            }}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: sidebarOpen ? '260px' : '70px', transition: 'margin-left 0.3s ease' }}>
        <header
          className="glass-card"
          style={{
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            borderRadius: 0,
            borderLeft: 'none',
            borderRight: 'none',
            borderTop: 'none'
          }}
        >
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Bienvenido</p>
            <p style={{ fontWeight: 500 }}>{user?.name}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="glass-badge" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
        </header>

        <div style={{ padding: '2rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { Outlet } from 'react-router-dom';
