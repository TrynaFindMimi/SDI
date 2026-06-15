# Modelo de Datos

## PostgreSQL (Datos Relacionales)

### Tabla: imports (Carpetas de Importación)

```sql
CREATE TABLE imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    start_date TIMESTAMP NOT NULL DEFAULT NOW(),
    estimated_arrival DATE,
    close_date TIMESTAMP,
    arrival_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- status: draft | in_progress | arrived | closed
```

### Tabla: logistics_data (Datos Logísticos)

```sql
CREATE TABLE logistics_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_id UUID NOT NULL REFERENCES imports(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id),
    broker_name VARCHAR(255),
    broker_contact VARCHAR(255),
    incoterm VARCHAR(10) NOT NULL,
    origin_country VARCHAR(100),
    destination_country VARCHAR(100) DEFAULT 'México',
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- incoterm: EXW | FOB | CIF | DDP | DAP | etc.
```

### Tabla: suppliers (Proveedores)

```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    tax_id VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Tabla: product_catalog (Catálogo Maestro de Productos)

```sql
CREATE TABLE product_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    reference_fob_price DECIMAL(12,2),
    unit_of_measure VARCHAR(50) DEFAULT 'pieza',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Tabla: imported_products (Productos Importados)

```sql
CREATE TABLE imported_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_id UUID NOT NULL REFERENCES imports(id) ON DELETE CASCADE,
    catalog_product_id UUID REFERENCES product_catalog(id),
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    fob_price DECIMAL(12,2) NOT NULL,
    expected_margin DECIMAL(5,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Nota: Los datos se copian del catálogo al momento de la importación
-- para preservar valores históricos
```

### Tabla: costs (Costos Logísticos)

```sql
CREATE TABLE costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_id UUID NOT NULL REFERENCES imports(id) ON DELETE CASCADE,
    concept VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    is_allocated BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- category: customs | freight | insurance | storage | brokerage | other
```

### Tabla: cost_allocations (Distribución de Costos)

```sql
CREATE TABLE cost_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cost_id UUID NOT NULL REFERENCES costs(id) ON DELETE CASCADE,
    imported_product_id UUID NOT NULL REFERENCES imported_products(id) ON DELETE CASCADE,
    allocated_amount DECIMAL(12,2) NOT NULL,
    allocation_method VARCHAR(50) DEFAULT 'proportional',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- allocation_method: proportional | equal | manual
```

### Tabla: users (Usuarios)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'reader',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- role: admin | supervisor | operator | reader
```

### Tabla: permissions (Permisos por Rol)

```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(20) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    can_create BOOLEAN DEFAULT false,
    can_read BOOLEAN DEFAULT true,
    can_update BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    UNIQUE(role, resource)
);
```

## MongoDB (Timeline y Logs)

### Colección: import_timelines

```javascript
{
    _id: ObjectId,
    importId: UUID,
    events: [
        {
            id: UUID,
            type: String,        // created | status_change | product_added | cost_added | etc.
            title: String,
            description: String,
            userId: UUID,
            userName: String,
            timestamp: Date,
            metadata: Object     // Datos adicionales según el tipo de evento
        }
    ],
    createdAt: Date,
    updatedAt: Date
}
```

### Colección: audit_logs (Historial de Cambios)

```javascript
{
    _id: ObjectId,
    importId: UUID,
    entity: String,              // import | product | cost | logistics
    entityId: UUID,
    action: String,              // create | update | delete
    changes: {
        before: Object,
        after: Object
    },
    userId: UUID,
    userName: String,
    timestamp: Date
}
```

## Relaciones

```
imports
├── 1:1 logistics_data
├── 1:N imported_products
│   └── N:1 cost_allocations
├── 1:N costs
│   └── 1:N cost_allocations
└── 1:1 import_timelines (MongoDB)

suppliers
└── 1:N logistics_data

product_catalog
└── 1:N imported_products (referencia histórica)

users
├── 1:N import_timelines.events
└── 1:N audit_logs
```

## Índices

### PostgreSQL
```sql
CREATE INDEX idx_imports_status ON imports(status);
CREATE INDEX idx_imports_start_date ON imports(start_date);
CREATE INDEX idx_imported_products_import_id ON imported_products(import_id);
CREATE INDEX idx_costs_import_id ON costs(import_id);
CREATE INDEX idx_costs_category ON costs(category);
CREATE INDEX idx_suppliers_country ON suppliers(country);
CREATE INDEX idx_product_catalog_sku ON product_catalog(sku);
CREATE INDEX idx_product_catalog_category ON product_catalog(category);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### MongoDB
```javascript
db.import_timelines.createIndex({ importId: 1 });
db.import_timelines.createIndex({ "events.timestamp": -1 });
db.audit_logs.createIndex({ importId: 1 });
db.audit_logs.createIndex({ timestamp: -1 });
db.audit_logs.createIndex({ entity: 1, entityId: 1 });
```
