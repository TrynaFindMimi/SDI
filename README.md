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

## Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd SDI

# Levantar con Docker
docker-compose up --build

# Acceder a:
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
# MongoDB: localhost:27017
# PostgreSQL: localhost:5432
```

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
