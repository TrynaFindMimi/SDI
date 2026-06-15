# API Documentation

## Base URL

```
http://localhost:4000/api/v1
```

## Autenticación

Todas las rutas requieren header de autorización (excepto /auth/login):

```
Authorization: Bearer <token>
```

## Endpoints

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /auth/login | Iniciar sesión |
| POST | /auth/logout | Cerrar sesión |
| GET | /auth/me | Obtener usuario actual |

### Importaciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /imports | Listar importaciones |
| POST | /imports | Crear importación |
| GET | /imports/:id | Obtener importación |
| PUT | /imports/:id | Actualizar importación |
| DELETE | /imports/:id | Eliminar importación |
| PATCH | /imports/:id/status | Cambiar estado |
| GET | /imports/:id/timeline | Obtener línea de tiempo |

### Datos Logísticos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /imports/:id/logistics | Obtener datos logísticos |
| POST | /imports/:id/logistics | Crear/actualizar datos logísticos |

### Productos Importados

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /imports/:id/products | Listar productos de importación |
| POST | /imports/:id/products | Agregar producto |
| PUT | /imports/:id/products/:productId | Actualizar producto |
| DELETE | /imports/:id/products/:productId | Eliminar producto |

### Costos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /imports/:id/costs | Listar costos |
| POST | /imports/:id/costs | Agregar costo |
| PUT | /imports/:id/costs/:costId | Actualizar costo |
| DELETE | /imports/:id/costs/:costId | Eliminar costo |
| POST | /imports/:id/costs/allocate | Distribuir costos |

### Resumen Financiero

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /imports/:id/financial-summary | Obtener resumen financiero |

### Catálogo de Productos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /catalog/products | Listar productos |
| POST | /catalog/products | Crear producto |
| GET | /catalog/products/:id | Obtener producto |
| PUT | /catalog/products/:id | Actualizar producto |
| DELETE | /catalog/products/:id | Eliminar producto |
| POST | /catalog/products/import | Importar desde CSV |

### Proveedores

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /catalog/suppliers | Listar proveedores |
| POST | /catalog/suppliers | Crear proveedor |
| GET | /catalog/suppliers/:id | Obtener proveedor |
| PUT | /catalog/suppliers/:id | Actualizar proveedor |
| DELETE | /catalog/suppliers/:id | Eliminar proveedor |

### Usuarios (Solo Admin)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /users | Listar usuarios |
| POST | /users | Crear usuario |
| GET | /users/:id | Obtener usuario |
| PUT | /users/:id | Actualizar usuario |
| DELETE | /users/:id | Eliminar usuario |
| PATCH | /users/:id/role | Cambiar rol |

### Reportes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /reports/kpis | Obtener KPIs generales |
| GET | /reports/imports-summary | Resumen de importaciones |
| GET | /reports/costs-analysis | Análisis de costos |
| GET | /reports/profitability | Rentabilidad por importación |

### Impresión

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /imports/:id/print | Generar resumen imprimible |

## Ejemplos de Request/Response

### POST /imports

**Request:**
```json
{
    "importNumber": "IMP-2026-001",
    "estimatedArrival": "2026-07-15"
}
```

**Response (201):**
```json
{
    "success": true,
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "importNumber": "IMP-2026-001",
        "status": "draft",
        "startDate": "2026-06-15T10:00:00Z",
        "estimatedArrival": "2026-07-15",
        "createdAt": "2026-06-15T10:00:00Z"
    }
}
```

### POST /imports/:id/products

**Request:**
```json
{
    "catalogProductId": "550e8400-e29b-41d4-a716-446655440001",
    "quantity": 100,
    "fobPrice": 25.50,
    "expectedMargin": 30.00
}
```

**Response (201):**
```json
{
    "success": true,
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "importId": "550e8400-e29b-41d4-a716-446655440000",
        "sku": "PROD-001",
        "name": "Producto Ejemplo",
        "quantity": 100,
        "fobPrice": 25.50,
        "expectedMargin": 30.00,
        "createdAt": "2026-06-15T10:00:00Z"
    }
}
```

### GET /imports/:id/financial-summary

**Response (200):**
```json
{
    "success": true,
    "data": {
        "importId": "550e8400-e29b-41d4-a716-446655440000",
        "totalFobValue": 2550.00,
        "totalLogisticsCosts": 850.00,
        "totalLandedCost": 3400.00,
        "costBreakdown": {
            "customs": 300.00,
            "freight": 400.00,
            "insurance": 150.00
        },
        "productBreakdown": [
            {
                "productId": "550e8400-e29b-41d4-a716-446655440002",
                "sku": "PROD-001",
                "name": "Producto Ejemplo",
                "fobValue": 2550.00,
                "allocatedCosts": 850.00,
                "totalCost": 3400.00,
                "unitCost": 34.00,
                "expectedRevenue": 4420.00,
                "expectedProfit": 1020.00,
                "roi": 30.00
            }
        ],
        "summary": {
            "totalInvestment": 3400.00,
            "totalExpectedRevenue": 4420.00,
            "totalExpectedProfit": 1020.00,
            "averageROI": 30.00,
            "profitMargin": 23.08
        }
    }
}
```

## Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 201 | Creado |
| 204 | Sin contenido (eliminación exitosa) |
| 400 | Error de validación |
| 401 | No autenticado |
| 403 | Sin permisos |
| 404 | Recurso no encontrado |
| 409 | Conflicto (ej: duplicado) |
| 500 | Error del servidor |

## Formato de Error

```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Error de validación en los datos",
        "details": [
            {
                "field": "email",
                "message": "Email inválido"
            }
        ]
    }
}
```

## Permisos por Rol

| Recurso | Admin | Supervisor | Operador | Lector |
|---------|-------|------------|----------|--------|
| Imports | CRUD | CRUD | CRU | R |
| Products | CRUD | CRUD | CRU | R |
| Costs | CRUD | CRUD | CRU | R |
| Catalog | CRUD | CRU | R | R |
| Users | CRUD | - | - | R |
| Reports | R | R | R | R |
