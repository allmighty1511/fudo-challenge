# DevThread

Challenge técnico para Fudo. La idea es un feed/blog para desarrolladores donde podés crear, editar y eliminar posts, dejar comentarios y responder comentarios (anidados, tipo Reddit). También tiene toggle de tema claro/oscuro.

## Stack

React 19 con TypeScript, Vite como bundler, React Router v7, TanStack Query v5 para todo lo que es estado del servidor (cache, refetch, optimistic updates), Tailwind para estilos y Axios como cliente HTTP.

Para testing: Jest + React Testing Library para unitarios, Cypress para E2E.

El backend es una instancia de [MockAPI](https://mockapi.io) que expone endpoints REST para posts y comentarios.

## Levantar el proyecto

Necesitás Node 20+ y npm.

```bash
npm install
cp .env.example .env
```

Abrí `.env` y completá `VITE_API_BASE_URL` con la URL de tu instancia de MockAPI (algo como `https://xxxxxxxxx.mockapi.io`). Después:

```bash
npm run dev
```

Listo, queda corriendo en `http://localhost:5173`.

### Docker

Si no querés instalar Node, con Docker y Docker Compose alcanza:

```bash
docker compose up --build
```

Build de producción servido con Nginx en `http://localhost:8080`. La variable `VITE_API_BASE_URL` se inyecta como build arg.

### Deploy en Render

El proyecto está preparado para deployar en [Render](https://render.com) con Nginx:

1. Subí el repo a GitHub/GitLab/Bitbucket.
2. En Render: **New** → **Web Service** → conectá el repo.
3. Runtime: **Docker** (importante, no Node).
4. Agregá la variable de entorno `VITE_API_BASE_URL` con tu URL de MockAPI.
5. Create Web Service y listo.

La imagen usa un Dockerfile multi-stage (Node para build, Nginx para servir) y el Nginx ya está configurado para el puerto 10000 que espera Render.

## Tests

### Unitarios

```bash
npm test
```

Cubren componentes, hooks, utilidades, el cliente HTTP y las páginas. La cobertura mínima está en 90% para branches, funciones, líneas y statements — si baja de ahí, falla.

### E2E

```bash
npm run e2e
```

Cypress en modo headless. Validan navegación, CRUD de posts, comentarios, estados vacíos y cambio de tema. Las llamadas a la API se interceptan con `cy.intercept`, así que no dependen de un backend real.

Para modo interactivo:

```bash
npm run e2e:open
```

## Estructura

```
src/
├── app/                  # App raíz, router y providers
├── components/
│   ├── layout/           # Header, MainLayout
│   └── ui/               # Button, Card, Input, Textarea, Modal, Avatar,
│                         # Dropdown, Skeleton, FormField
├── contexts/             # ThemeContext (tema claro/oscuro)
├── features/
│   ├── posts/            # Feed, detalle, CRUD — páginas, hooks, componentes
│   └── comments/         # Comentarios anidados — árbol, CRUD, hooks
├── lib/
│   ├── api/              # Cliente Axios + endpoints
│   ├── avatars.ts        # Avatar determinista por nombre
│   ├── constants/        # Mensajes/textos
│   └── utils/            # buildCommentTree, formatDate
├── styles/               # CSS global + design tokens
└── types/                # Post, Comment
```

## API

La app consume estos endpoints REST:

| Método | Ruta | Qué hace |
|--------|------|----------|
| GET | `/post` | Lista posts |
| GET | `/post/:id` | Un post |
| POST | `/post` | Crear post |
| PUT | `/post/:id` | Editar post |
| DELETE | `/post/:id` | Borrar post |
| GET | `/post/:postId/comment` | Comentarios de un post |
| POST | `/post/:postId/comment` | Nuevo comentario |
| PUT | `/post/:postId/comment/:commentId` | Editar comentario |
| DELETE | `/post/:postId/comment/:commentId` | Borrar comentario |

**Post**: `id`, `title`, `content`, `name`, `avatar`, `createdAt`
**Comment**: `id`, `content`, `name`, `avatar`, `parentId` (null = raíz), `createdAt`

## Decisiones técnicas

**Estructura por feature** — El código está organizado por funcionalidad, no por tipo de archivo. Cada feature tiene sus componentes, hooks y páginas. Es más fácil de navegar y escala mejor.

**TanStack Query para estado del servidor** — En vez de `useEffect` + `useState` manual para cada llamada, TanStack Query maneja cache, invalidación, loading/error y sincronización con el backend.

**Comentarios anidados client-side** — La API devuelve una lista plana con `parentId`. `buildCommentTree` la reestructura en un árbol recursivo para renderizar las respuestas anidadas.

**Avatares deterministas** — `getAvatarForName` hashea el nombre del usuario para asignarle siempre el mismo avatar de un set de 8 SVGs. No hay auth, pero cada nombre tiene su identidad visual consistente.

**Cobertura al 90%** — Los umbrales de Jest están en 90% en las cuatro métricas. La idea es poder refactorizar tranquilo sin romper cosas sin darte cuenta.

**Cliente HTTP centralizado** — Todas las llamadas pasan por una instancia de Axios en `src/lib/api/client.ts` con base URL y headers configurados en un solo lugar.

**Design tokens** — Los estilos usan CSS custom properties (`--color-bg`, `--color-text`, `--color-accent`, etc.) para manejar los temas. El toggle cambia el atributo `data-theme` en el HTML y las variables hacen el resto.
