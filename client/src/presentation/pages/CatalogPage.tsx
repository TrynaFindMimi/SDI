import { useEffect, useState } from 'react';
import { useCatalogStore } from '@application/state/catalogStore';
import { useAuthStore } from '@application/state/authStore';
import { Plus, Edit, Trash2, Package, Building2 } from 'lucide-react';
import '../styles/components.css';

type CatalogTab = 'products' | 'suppliers';

export function CatalogPage() {
  const { products, suppliers, fetchProducts, fetchSuppliers, deleteProduct, deleteSupplier } = useCatalogStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<CatalogTab>('products');

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, [fetchProducts, fetchSuppliers]);

  const canEdit = user?.role === 'admin' || user?.role === 'supervisor';
  const canDelete = user?.role === 'admin';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Catálogo Maestro</h1>
        <p className="page-subtitle">Gestiona productos y proveedores</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <button
          className="glass-button"
          style={{
            background: activeTab === 'products' ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' : 'rgba(255,255,255,0.05)',
            border: activeTab === 'products' ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--glass-border)'
          }}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} /> Productos
        </button>
        <button
          className="glass-button"
          style={{
            background: activeTab === 'suppliers' ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' : 'rgba(255,255,255,0.05)',
            border: activeTab === 'suppliers' ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--glass-border)'
          }}
          onClick={() => setActiveTab('suppliers')}
        >
          <Building2 size={16} /> Proveedores
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Productos</h2>
            {canEdit && (
              <button className="glass-button"><Plus size={16} /> Nuevo Producto</button>
            )}
          </div>
          <div className="table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio FOB Ref.</th>
                  <th>Unidad</th>
                  {(canEdit || canDelete) && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.sku}</td>
                    <td>{p.name}</td>
                    <td>{p.category || '-'}</td>
                    <td>{p.referenceFobPrice ? `$${p.referenceFobPrice.toFixed(2)}` : '-'}</td>
                    <td>{p.unitOfMeasure}</td>
                    {(canEdit || canDelete) && (
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {canEdit && (
                            <button style={{ background: 'none', color: 'var(--color-accent)', padding: '0.5rem' }}>
                              <Edit size={16} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => { if (confirm('¿Eliminar?')) deleteProduct(p.id); }}
                              style={{ background: 'none', color: 'var(--color-error)', padding: '0.5rem' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                      No hay productos en el catálogo
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Proveedores</h2>
            {canEdit && (
              <button className="glass-button"><Plus size={16} /> Nuevo Proveedor</button>
            )}
          </div>
          <div className="table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>País</th>
                  <th>Contacto</th>
                  <th>Email</th>
                  <th>Estado</th>
                  {(canEdit || canDelete) && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td>{s.country}</td>
                    <td>{s.contactName || '-'}</td>
                    <td>{s.contactEmail || '-'}</td>
                    <td>
                      <span className={`glass-badge ${s.isActive ? 'badge-arrived' : 'badge-draft'}`}>
                        {s.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    {(canEdit || canDelete) && (
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {canEdit && (
                            <button style={{ background: 'none', color: 'var(--color-accent)', padding: '0.5rem' }}>
                              <Edit size={16} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => { if (confirm('¿Eliminar?')) deleteSupplier(s.id); }}
                              style={{ background: 'none', color: 'var(--color-error)', padding: '0.5rem' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {suppliers.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                      No hay proveedores registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
