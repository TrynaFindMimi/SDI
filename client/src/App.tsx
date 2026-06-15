import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@application/state/authStore';
import { Layout } from '@presentation/components/layout/Layout';
import { LoginPage } from '@presentation/pages/LoginPage';
import { DashboardPage } from '@presentation/pages/DashboardPage';
import { ImportsPage } from '@presentation/pages/ImportsPage';
import { ImportDetailPage } from '@presentation/pages/ImportDetailPage';
import { CatalogPage } from '@presentation/pages/CatalogPage';
import { ReportsPage } from '@presentation/pages/ReportsPage';
import { UsersPage } from '@presentation/pages/UsersPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="imports" element={<ImportsPage />} />
          <Route path="imports/:id" element={<ImportDetailPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
