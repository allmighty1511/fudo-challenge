const MOCK_API = 'https://665de6d7e88051d60408c32d.mockapi.io';

/** IDs de posts "eliminados" para simular refetch sin ellos */
const deletedPostIds = new Set<string>();

/** Posts actualizados por PUT para que GET devuelva el estado actualizado */
const updatedPosts = new Map<string, (typeof mockPosts)[0]>();

export const mockPosts = [
  {
    id: '1',
    title: 'Post de prueba',
    content: 'Contenido del primer post para tests e2e.',
    name: 'Usuario Test',
    avatar: '/avatars/avatar1.svg',
    createdAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Segundo post',
    content: 'Otro contenido para verificar el feed.',
    name: 'Otro Usuario',
    avatar: '/avatars/avatar2.svg',
    createdAt: '2024-01-16T12:00:00.000Z',
  },
];

/**
 * Mock de comentarios con estructura anidada completa.
 * Cubre: raíces múltiples, varios niveles de profundidad, múltiples hermanos,
 * ramas largas, ramas cortas, y orden cronológico variado.
 */
export const mockComments = [
  // Raíz 1 - comentario principal con muchas respuestas
  {
    id: 'c1',
    content: 'Primer comentario del post',
    name: 'Ana García',
    avatar: '/avatars/avatar1.svg',
    parentId: null,
    createdAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 'c2',
    content: 'Respuesta directa al primer comentario',
    name: 'Carlos López',
    avatar: '/avatars/avatar2.svg',
    parentId: 'c1',
    createdAt: '2024-01-15T10:15:00.000Z',
  },
  {
    id: 'c3',
    content: 'Segunda respuesta al comentario raíz',
    name: 'María Fernández',
    avatar: '/avatars/avatar3.svg',
    parentId: 'c1',
    createdAt: '2024-01-15T10:20:00.000Z',
  },
  {
    id: 'c4',
    content: 'Respuesta anidada nivel 2',
    name: 'Pedro Sánchez',
    avatar: '/avatars/avatar4.svg',
    parentId: 'c2',
    createdAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: 'c5',
    content: 'Otra respuesta al mismo comentario padre',
    name: 'Laura Martínez',
    avatar: '/avatars/avatar5.svg',
    parentId: 'c2',
    createdAt: '2024-01-15T10:35:00.000Z',
  },
  // Raíz 2 - comentario con una sola respuesta
  {
    id: 'c6',
    content: 'Otro comentario principal del post',
    name: 'Roberto Díaz',
    avatar: '/avatars/avatar6.svg',
    parentId: null,
    createdAt: '2024-01-15T11:00:00.000Z',
  },
  {
    id: 'c7',
    content: 'Respuesta muy profunda (nivel 3)',
    name: 'Elena Ruiz',
    avatar: '/avatars/avatar7.svg',
    parentId: 'c4',
    createdAt: '2024-01-15T10:45:00.000Z',
  },
  {
    id: 'c8',
    content: 'Única respuesta a este comentario',
    name: 'David Torres',
    avatar: '/avatars/avatar8.svg',
    parentId: 'c6',
    createdAt: '2024-01-15T11:10:00.000Z',
  },
  // Raíz 3 - comentario sin respuestas
  {
    id: 'c9',
    content: 'Comentario sin respuestas aún',
    name: 'Sofia Herrera',
    avatar: '/avatars/avatar1.svg',
    parentId: null,
    createdAt: '2024-01-15T11:30:00.000Z',
  },
  {
    id: 'c10',
    content: 'Máxima profundidad del árbol (nivel 4)',
    name: 'Javier Moreno',
    avatar: '/avatars/avatar2.svg',
    parentId: 'c7',
    createdAt: '2024-01-15T10:50:00.000Z',
  },
];

function getPostById(id: string) {
  return updatedPosts.get(id) ?? mockPosts.find((p) => p.id === id);
}

function getPostsList() {
  return mockPosts
    .filter((p) => !deletedPostIds.has(p.id))
    .map((p) => getPostById(p.id) ?? p);
}

export function interceptApi() {
  deletedPostIds.clear();
  updatedPosts.clear();

  cy.intercept('GET', `${MOCK_API}/post`, (req) => {
    req.reply({ statusCode: 200, body: getPostsList() });
  }).as('getPosts');

  cy.intercept(
    { method: 'GET', url: new RegExp(`${MOCK_API.replace('.', '\\.')}/post/[^/]+$`) },
    (req) => {
      const match = req.url.match(/\/post\/([^/]+)$/);
      const id = match?.[1];
      const post = getPostById(id ?? '');
      req.reply(post ? { statusCode: 200, body: post } : { statusCode: 404 });
    }
  ).as('getPost');

  cy.intercept(
    { method: 'GET', url: new RegExp(`${MOCK_API.replace(/\./g, '\\.')}/post/[^/]+/comment`) },
    {
    statusCode: 200,
    body: mockComments,
  }
  ).as('getComments');

  cy.intercept('POST', `${MOCK_API}/post`, {
    statusCode: 201,
    body: {
      id: 'new-1',
      title: 'Nuevo post',
      content: 'Contenido nuevo',
      name: 'Autor',
      avatar: '/avatars/avatar1.svg',
      createdAt: new Date().toISOString(),
    },
  }).as('createPost');

  cy.intercept('PUT', `${MOCK_API}/post/*`, (req) => {
    const id = req.url.split('/').pop() ?? '';
    const body = req.body as { title?: string; content?: string };
    const updated = {
      ...getPostById(id) ?? mockPosts[0],
      ...body,
      id,
    };
    updatedPosts.set(id, updated);
    req.reply({ statusCode: 200, body: updated });
  }).as('updatePost');

  cy.intercept('DELETE', `${MOCK_API}/post/*`, (req) => {
    const id = req.url.split('/').pop() ?? '';
    deletedPostIds.add(id);
    req.reply({ statusCode: 200 });
  }).as('deletePost');

  cy.intercept(
    { method: 'POST', url: new RegExp(`${MOCK_API.replace(/\./g, '\\.')}/post/[^/]+/comment`) },
    {
    statusCode: 201,
    body: {
      id: 'new-c1',
      content: 'Nuevo comentario',
      name: 'Nuevo Usuario',
      avatar: '/avatars/avatar1.svg',
      parentId: null,
      createdAt: new Date().toISOString(),
    },
  }).as('createComment');
}
