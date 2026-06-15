# Arquitectura del Sistema

## Visión General

El Sistema de Gestión de Importaciones (SDI) sigue una arquitectura de dos niveles:

### Backend - Arquitectura Hexagonal

```
┌─────────────────────────────────────────────────────────┐
│                    ADAPTERS LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  HTTP REST   │  │  WebSocket   │  │  CLI/Scripts │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 APPLICATION LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Use Cases   │  │  DTOs        │  │  Services    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   DOMAIN LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Entities    │  │  Value Objs  │  │  Repos Int.  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               INFRASTRUCTURE LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │   MongoDB    │  │  Mappers     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Frontend - Arquitectura en Capas

```
┌─────────────────────────────────────────────────────────┐
│               PRESENTATION LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Pages     │  │  Components  │  │  Hooks/State │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               APPLICATION LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Services    │  │   Hooks      │  │  State Mgmt  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 DOMAIN LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Models     │  │  Interfaces  │  │  Validators  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              INFRASTRUCTURE LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  API Client  │  │   Storage    │  │  Config      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Principios de Diseño

### Backend (Hexagonal)
- **Independencia del framework**: El dominio no depende de Express
- **Inversión de dependencias**: Los puertos definen contratos, las adaptaciones implementan
- **Testabilidad**: El dominio se puede testear sin infraestructura
- **SOLID**: Especialmente SRP, OCP, DIP

### Frontend (Capas)
- **Separación de responsabilidades**: Cada capa tiene un propósito claro
- **Reutilización**: Componentes UI independientes
- **Mantenibilidad**: Fácil de escalar y modificar
- **UX consistente**: Design system unificado

## Flujo de Datos

1. Usuario interactúa con la UI (Presentation)
2. Componente llama a hook/service (Application)
3. Service usa modelos del dominio (Domain)
4. API Client hace request HTTP (Infrastructure)
5. Backend recibe request (Adapters)
6. Use case procesa lógica (Application)
7. Repositorio persiste datos (Infrastructure)
8. Respuesta fluye de vuelta al frontend

## Tecnologías

### Backend
- **Runtime**: Node.js 20+
- **Lenguaje**: TypeScript 5+
- **Framework HTTP**: Express.js
- **ORM PostgreSQL**: Prisma
- **ODM MongoDB**: Mongoose
- **Validación**: Zod
- **Autenticación**: JWT

### Frontend
- **Framework**: React 18+
- **Lenguaje**: TypeScript 5+
- **Estado**: Zustand
- **Routing**: React Router v6
- **Estilos**: CSS Modules + CSS Variables
- **Gráficos**: Recharts

### Base de Datos
- **PostgreSQL**: Datos relacionales (importaciones, productos, costos)
- **MongoDB**: Timeline, logs, historial de cambios

### Infraestructura
- **Docker**: Contenedores
- **Docker Compose**: Orquestación local
