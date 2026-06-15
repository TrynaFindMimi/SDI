# Sistema de Gestión de Importaciones (SDI)

Sistema web para la gestión integral de operaciones de importación, con seguimiento de costos, productos, proveedores y análisis financiero.

## Características

- Gestión de carpetas de importación
- Registro de datos logísticos y productos
- Control de costos y distribución automática
- Análisis financiero (ROI, márgenes)
- Catálogo maestro de productos y proveedores
- Reportes con KPIs
- Línea de tiempo por importación
- Sistema de usuarios con roles
- Generación de reportes imprimibles

## Cuenta de Administrador (Demo)

| Campo       | Valor            |
|-------------|------------------|
| **Email**   | admin@sdi.com    |
| **Contraseña** | admin123      |

> Esta cuenta tiene permisos de **Administrador** (acceso total al sistema).

## Stack Tecnológico

### Backend
- Node.js + TypeScript
- Arquitectura Hexagonal
- PostgreSQL (datos relacionales)
- MongoDB (logs y timeline)
- Express.js

### Frontend
- React + TypeScript
- Arquitectura en Capas
- Liquid Glass UI
- Paleta morado/negro

### Infraestructura
- Docker + Docker Compose

## Estructura del Proyecto

```
SDI/
├── docs/           # Documentación
├── server/         # Backend (arquitectura hexagonal)
├── client/         # Frontend (arquitectura en capas)
└── docker-compose.yml
```

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Docker** y **Docker Compose** (recomendado)
  - Docker Desktop: https://www.docker.com/products/docker-desktop
  - Verificar: `docker --version` y `docker-compose --version`

**O para desarrollo local:**

- **Node.js** 20+ → https://nodejs.org/
- **PostgreSQL** 16+ → https://www.postgresql.org/
- **MongoDB** 7+ → https://www.mongodb.com/
- **npm** o **yarn**

## Instalación

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd SDI

# 2. Copiar variables de entorno
cp server/.env.docker server/.env
cp client/.env.docker client/.env

# 3. Levantar todos los servicios
docker-compose up --build

# 4. Esperar a que los servicios estén listos (ver logs)
# PostgreSQL y MongoDB deben mostrar "ready to accept connections"

# 5. En otra terminal, ejecutar migraciones de Prisma
docker-compose exec server npx prisma migrate dev --name init

# 6. (Opcional) Crear usuario admin inicial
docker-compose exec server npx prisma db seed
```

**Servicios disponibles:**

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:3000 | Aplicación web |
| Backend API | http://localhost:4000 | API REST |
| PostgreSQL | localhost:5432 | Base de datos relacional |
| MongoDB | localhost:27017 | Base de datos NoSQL |

**Comandos útiles Docker:**

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver solo logs del backend
docker-compose logs -f server

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ borra datos)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart server

# Entrar al contenedor del backend
docker-compose exec server sh

# Reconstruir solo el backend
docker-compose up --build server
```

### Opción 2: Desarrollo Local (sin Docker)

#### 1. Configurar Bases de Datos

**PostgreSQL:**

```bash
# Crear usuario, bases de datos y permisos
psql -U postgres -c "CREATE USER sdi_user WITH PASSWORD 'sdi_password';"
psql -U postgres -c "CREATE DATABASE sdi_db OWNER sdi_user;"
psql -U postgres -c "CREATE DATABASE sdi_db_shadow OWNER sdi_user;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE sdi_db TO sdi_user;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE sdi_db_shadow TO sdi_user;"
psql -U postgres -c "ALTER USER sdi_user CREATEDB;"
```

**MongoDB:**

```bash
# MongoDB se conecta automáticamente a localhost:27017
# No requiere configuración adicional para desarrollo
```

#### 2. Configurar Backend

```bash
# Entrar al directorio del servidor
cd server

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales locales
# DATABASE_URL=postgresql://sdi_user:sdi_password@localhost:5432/sdi_db
# MONGODB_URI=mongodb://localhost:27017/sdi_db

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Iniciar servidor en modo desarrollo
npm run dev
```

El backend estará en http://localhost:4000

#### 3. Configurar Frontend

```bash
# En otra terminal, entrar al directorio del cliente
cd client

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar Vite en modo desarrollo
npm run dev
```

El frontend estará en http://localhost:3000

## Variables de Entorno

### Backend (`server/.env`)

```env
NODE_ENV=development
PORT=4000

# PostgreSQL
DATABASE_URL=postgresql://sdi_user:sdi_password@localhost:5432/sdi_db

# MongoDB
MONGODB_URI=mongodb://localhost:27017/sdi_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (`client/.env`)

```env
VITE_API_URL=/api/v1
```

## Primeros Pasos

### 1. Crear Usuario Administrador

Después de levantar el sistema, necesitas crear un usuario admin:

```bash
# Con Docker
docker-compose exec server node -e "
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@sdi.com',
      passwordHash,
      name: 'Administrador',
      role: 'admin'
    }
  });
  console.log('✅ Usuario admin creado: admin@sdi.com / admin123');
  await prisma.\$disconnect();
}

createAdmin();
"

# Sin Docker (en carpeta server/)
node -e "..." # mismo código
```

### 2. Acceder al Sistema

1. Abre http://localhost:3000
2. Inicia sesión con:
   - **Email:** admin@sdi.com
   - **Contraseña:** admin123

### 3. Crear tu Primera Importación

1. Ve a "Importaciones" en el menú lateral
2. Click en "Nueva Importación"
3. Ingresa un número (ej: IMP-2026-001)
4. Agrega productos, costos y datos logísticos
5. Revisa el resumen financiero

## Troubleshooting

### Error: "Cannot connect to PostgreSQL"

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Reiniciar PostgreSQL
docker-compose restart postgres

# Ver logs de PostgreSQL
docker-compose logs postgres
```

### Error: "Port already in use"

```bash
# Ver qué proceso usa el puerto
lsof -i :3000  # Frontend
lsof -i :4000  # Backend
lsof -i :5432  # PostgreSQL
lsof -i :27017 # MongoDB

# Matar proceso (reemplazar PID)
kill -9 <PID>

# O cambiar puertos en docker-compose.yml
```

### Error: "Prisma Client not generated"

```bash
# Regenerar Prisma Client
docker-compose exec server npx prisma generate

# O sin Docker
cd server && npx prisma generate
```

### El frontend no carga datos

```bash
# Verificar que el backend esté corriendo
curl http://localhost:4000/health

# Debe responder: {"status":"ok","timestamp":"..."}

# Ver logs del backend
docker-compose logs -f server
```

### Limpiar todo y empezar de cero

```bash
# Detener y eliminar todo (⚠️ borra datos)
docker-compose down -v

# Reconstruir desde cero
docker-compose up --build

# Ejecutar migraciones nuevamente
docker-compose exec server npx prisma migrate dev
```

## Desarrollo

### Comandos Backend

```bash
cd server

npm run dev          # Modo desarrollo (hot reload)
npm run build        # Compilar para producción
npm run start        # Ejecutar versión compilada
npm run typecheck    # Verificar tipos TypeScript
npm run lint         # Ejecutar ESLint
```

### Comandos Frontend

```bash
cd client

npm run dev          # Modo desarrollo (Vite)
npm run build        # Compilar para producción
npm run preview      # Preview de build de producción
npm run lint         # Ejecutar ESLint
```

### Estructura de Carpetas

```
SDI/
├── docs/                    # Documentación
│   ├── architecture.md      # Arquitectura del sistema
│   ├── data-model.md        # Modelo de datos
│   └── api.md              # API endpoints
├── server/                  # Backend (arquitectura hexagonal)
│   ├── src/
│   │   ├── domain/         # Entidades, value objects, repos interfaces
│   │   ├── application/    # Use cases, DTOs
│   │   ├── infrastructure/ # Prisma, MongoDB, repos implementations
│   │   └── adapters/       # Controllers, routes, middleware
│   └── prisma/
│       └── schema.prisma   # Esquema de base de datos
├── client/                  # Frontend (arquitectura en capas)
│   ├── src/
│   │   ├── domain/         # Models, interfaces
│   │   ├── infrastructure/ # API client, services
│   │   ├── application/    # Zustand stores
│   │   └── presentation/   # Pages, components, CSS
│   └── vite.config.ts
└── docker-compose.yml       # Orquestación de servicios
```

## Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **Administrador** | Acceso total, gestión de usuarios |
| **Supervisor** | Crear, editar y eliminar importaciones |
| **Operador** | Crear y editar importaciones |
| **Lector** | Solo lectura |

## Documentación Adicional

Ver carpeta `docs/` para:
- [Arquitectura del sistema](docs/architecture.md)
- [Modelo de datos](docs/data-model.md)
- [API endpoints](docs/api.md)

## Soporte

Si encuentras problemas:

1. Revisa la sección de Troubleshooting
2. Consulta los logs: `docker-compose logs -f`
3. Verifica que todos los servicios estén corriendo: `docker-compose ps`
4. Asegúrate de que los puertos no estén en uso

## Roles de Usuario

- **Administrador**: Acceso total, gestión de usuarios
- **Supervisor**: Puede crear, editar y eliminar
- **Operador**: Puede crear y editar
- **Lector**: Solo lectura

## Documentación

Ver carpeta `docs/` para:
- Arquitectura del sistema
- Modelo de datos
- API endpoints
- Guías de desarrollo
