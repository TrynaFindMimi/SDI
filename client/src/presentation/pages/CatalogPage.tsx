import { useEffect, useState } from 'react';
import { useCatalogStore } from '@application/state/catalogStore';
import { useAuthStore } from '@application/state/authStore';
import { Plus, Edit, Trash2, Package, Building2 } from 'lucide-react';
import '../../styles/components.css';

type CatalogTab = 'products' | 'suppliers';

export function CatalogPage() {
  const { products, suppliers, fetchProducts, fetchSuppliers, deleteProduct, deleteSupplier } = useCatalogStore();
  const { user } = useAuthStore();
  const [activeTab, setTab] = useState<CatalogTab>('products');

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

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
        <button
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setTab('products')}
        >
          <Package size={18} style={{ marginRight: '0.5rem' }} />
          Productos
        </button>
        <button
          className={`tab-button ${activeTab === 'suppliers' ? 'active' : ''}`}
          onClick={() => setTab('suppliers')}
        >
          <Building2 size={18} style={{ marginRight: '0.5rem' }} />
          Proveedores
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="glass-card" style={{ padding: '0' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1.5rem 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Productos</h2>
            {canEdit && (
              <button className="glass-button"><Plus size={18} /> Nuevo Producto</button>
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
                    <td style={{ fontWeight: 600 }}>{p.sku}</td>
                    <td>{p.name}</td>
                    <td>{p.category || '-'}</td>
                    <td>{p.referenceFobPrice ? `$${p.referenceFobPrice.toFixed(2)}` : '-'}</td>
                    <td>{p.unitOfMeasure}</td>
                    {(canEdit || canDelete) && (
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {canEdit && (
                            <button className="icon-button">
                              <Edit size={16} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => { if (confirm('¿Eliminar?')) deleteProduct(p.id); }}
                              className="icon-button danger"
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
                    <td colSpan={6} style={{ 
                      textAlign: 'center', 
                      color: 'var(--color-text-secondary)', 
                      padding: '3rem 2rem'
                    }}>
                      <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                      <p>No hay productos en el catálogo</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="glass-card" style={{ padding: '0' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1.5rem 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Proveedores</h2>
            {canEdit && (
              <button className="glass-button"><Plus size={18} /> Nuevo Proveedor</button>
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
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
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
                            <button className="icon-button">
                              <Edit size={16} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => { if (confirm('¿Eliminar?')) deleteSupplier(s.id); }}
                              className="icon-button danger"
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
                    <td colSpan={6} style={{ 
                      textAlign: 'center', 
                      color: 'var(--color-text-secondary)', 
                      padding: '3rem 2rem'
                    }}>
                      <Building2 size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                      <p>No hay proveedores registrados</p>
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
