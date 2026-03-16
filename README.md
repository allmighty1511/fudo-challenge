# DevThread

Challenge técnico para Fudo. Es una aplicación tipo feed/blog orientada a desarrolladores, donde se pueden crear, editar y eliminar posts, y dejar comentarios con soporte de respuestas anidadas. Incluye toggle de tema claro/oscuro.

## Stack

- **React 19** + **TypeScript** con **Vite** como bundler
- **React Router v7** para el routing del lado del cliente
- **TanStack Query v5** para manejo de estado del servidor (cache, refetch, optimistic updates)
- **Tailwind CSS** para estilos
- **Axios** como cliente HTTP
- **Jest** + **React Testing Library** para tests unitarios
- **Cypress** para tests end-to-end

El backend es una instancia de [MockAPI](https://mockapi.io) que expone endpoints REST para posts y comentarios.

## Requisitos previos

- Node.js 20+
- npm

## Cómo levantar el proyecto

1. Clonar el repositorio e instalar dependencias:

```bash
npm install
```

2. Crear el archivo de variables de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

3. Abrir `.env` y completar `VITE_API_BASE_URL` con la URL de tu instancia de MockAPI (algo como `https://xxxxxxxxx.mockapi.io`).

4. Levantar el servidor de desarrollo:

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Con Docker

Si preferís usar Docker, no hace falta tener Node instalado localmente. Solo hace falta Docker y Docker Compose:

```bash
docker compose up --build
```

Esto genera un build de producción y lo sirve con nginx en `http://localhost:8080`. La variable `VITE_API_BASE_URL` se inyecta como build argument durante la construcción de la imagen.

### Deploy en Render

Para desplegar en [Render](https://render.com) como Web Service con Nginx (según el requerimiento del challenge):

1. Sube el repositorio a GitHub, GitLab o Bitbucket.
2. En el [Dashboard de Render](https://dashboard.render.com/), haz clic en **New** → **Web Service**.
3. Conecta tu repositorio y selecciona el proyecto.
4. Configura el servicio:
   - **Name**: nombre del servicio (ej: `fudo-challenge`)
   - **Region**: la más cercana a tus usuarios
   - **Branch**: `main` (o la rama que uses)
   - **Runtime**: **Docker** (importante: no uses Node, usa Docker para que se use el Dockerfile con Nginx)
5. En **Environment**, agrega la variable:
   - `VITE_API_BASE_URL` = `https://665de6d7e88051d60408c32d.mockapi.io` (o tu URL de MockAPI)
6. Haz clic en **Create Web Service**.

Render construirá la imagen desde el Dockerfile (build multi-stage con Node + Nginx) y desplegará la app. La configuración de Nginx ya está ajustada para el puerto 10000 que Render espera por defecto.

## Tests

El proyecto tiene dos niveles de testing:

### Tests unitarios

```bash
npm test
```

Cubren componentes de UI, hooks, funciones de utilidad, el cliente HTTP y las páginas principales. La cobertura mínima está configurada en 90% para branches, funciones, líneas y statements. Si alguna métrica baja de ese umbral, el comando falla.

### Tests E2E

```bash
npm run e2e
```

Corren con Cypress en modo headless. Validan los flujos principales de la aplicación: navegación entre páginas, CRUD de posts, creación de comentarios, manejo de estados vacíos y cambio de tema. Las llamadas a la API se interceptan con `cy.intercept` para que los tests no dependan de un backend real.

Para abrir Cypress en modo interactivo (útil para desarrollo y debugging):

```bash
npm run e2e:open
```

## Estructura del proyecto

```
src/
├── app/                # Componente raíz, configuración del router y providers
├── components/
│   ├── layout/         # Header y MainLayout (estructura general de la página)
│   └── ui/             # Componentes genéricos reutilizables: Button, Card, Input,
│                       # Textarea, Modal, Avatar, Dropdown
├── contexts/           # ThemeContext para el manejo del tema claro/oscuro
├── features/
│   ├── posts/          # Feature de posts: páginas (Feed, PostDetail), hooks
│   │                   # (usePosts, useCreatePost, etc.), componentes (PostCard,
│   │                   # PostForm, PostFormModal)
│   └── comments/       # Feature de comentarios: CommentTree, CommentItem y hooks
│                       # para crear/editar/eliminar comentarios
├── lib/
│   ├── api/            # Cliente Axios centralizado y definición de endpoints
│   └── utils/          # Funciones auxiliares (ej: buildCommentTree para armar
│                       # el árbol de comentarios a partir de la lista plana)
├── styles/             # Estilos globales y design tokens en CSS custom properties
└── types/              # Tipos TypeScript compartidos (Post, Comment)
```

## API

La aplicación consume una API REST con los siguientes endpoints:

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/post` | Listar todos los posts |
| GET | `/post/:id` | Obtener un post por ID |
| POST | `/post` | Crear un post |
| PUT | `/post/:id` | Actualizar un post |
| DELETE | `/post/:id` | Eliminar un post |
| GET | `/post/:postId/comment` | Listar comentarios de un post |
| POST | `/post/:postId/comment` | Crear un comentario en un post |
| PUT | `/post/:postId/comment/:commentId` | Actualizar un comentario |
| DELETE | `/post/:postId/comment/:commentId` | Eliminar un comentario |

Los modelos principales son:

- **Post**: `id`, `title`, `content`, `name`, `avatar`, `createdAt`
- **Comment**: `id`, `content`, `name`, `avatar`, `parentId` (null si es comentario raíz), `createdAt`

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_BASE_URL` | URL base de la instancia de MockAPI. Se usa tanto en la app como en los tests de Cypress para interceptar las llamadas. |

## Decisiones técnicas

- **Estructura por feature**: en lugar de organizar el código por tipo de archivo (una carpeta de hooks, otra de componentes, otra de páginas), opté por agrupar por funcionalidad. Cada feature contiene sus propios componentes, hooks y páginas. Esto facilita la navegación del código y escala mejor a medida que el proyecto crece.

- **TanStack Query para el estado del servidor**: en vez de manejar el estado del servidor manualmente con `useEffect` + `useState`, delegué esa responsabilidad a TanStack Query. Se encarga del cache, la invalidación, los estados de loading/error y la sincronización con el backend.

- **Comentarios anidados del lado del cliente**: la API devuelve los comentarios como una lista plana, cada uno con un campo `parentId`. La función `buildCommentTree` los reestructura en un árbol recursivo para renderizar las respuestas anidadas correctamente.

- **Cobertura de tests al 90%**: los umbrales de cobertura de Jest están configurados al 90% en las cuatro métricas. El objetivo es mantener un nivel de confianza alto para poder refactorizar sin miedo a romper funcionalidad sin darse cuenta.

- **Cliente HTTP centralizado**: todas las llamadas HTTP pasan por una instancia de Axios configurada en `src/lib/api/client.ts`, que aplica la base URL y headers comunes en un solo lugar.
