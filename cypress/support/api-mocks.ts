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
 * Cubre: raíces múltiples, varios niveles, hermanos, contenido especial,
 * orden temporal, patrones de conversación, edge cases y datos de usuario.
 */
export const mockComments = [
  // --- Raíz 1: comentario principal con muchas respuestas ---
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
  {
    id: 'c7',
    content: 'Respuesta muy profunda (nivel 3)',
    name: 'Elena Ruiz',
    avatar: '/avatars/avatar7.svg',
    parentId: 'c4',
    createdAt: '2024-01-15T10:45:00.000Z',
  },
  {
    id: 'c10',
    content: 'Máxima profundidad del árbol (nivel 4)',
    name: 'Javier Moreno',
    avatar: '/avatars/avatar2.svg',
    parentId: 'c7',
    createdAt: '2024-01-15T10:50:00.000Z',
  },
  // --- Raíz 2: comentario con una sola respuesta ---
  {
    id: 'c6',
    content: 'Otro comentario principal del post',
    name: 'Roberto Díaz',
    avatar: '/avatars/avatar6.svg',
    parentId: null,
    createdAt: '2024-01-15T11:00:00.000Z',
  },
  {
    id: 'c8',
    content: 'Única respuesta a este comentario',
    name: 'David Torres',
    avatar: '/avatars/avatar8.svg',
    parentId: 'c6',
    createdAt: '2024-01-15T11:10:00.000Z',
  },
  // --- Raíz 3: comentario sin respuestas (mismo avatar que c1) ---
  {
    id: 'c9',
    content: 'Comentario sin respuestas aún',
    name: 'Sofia Herrera',
    avatar: '/avatars/avatar1.svg',
    parentId: null,
    createdAt: '2024-01-15T11:30:00.000Z',
  },
  // --- Raíz 4: contenido especial (emojis, saltos de línea, URLs, caracteres) ---
  {
    id: 'c11',
    content: '¡Excelente punto! 👍👏\n\nMuy de acuerdo con lo que dices.\n\nMás info: https://example.com y #hashtag @usuario',
    name: 'Usuario Con Emojis',
    avatar: '/avatars/avatar3.svg',
    parentId: null,
    createdAt: '2024-01-15T11:45:00.000Z',
  },
  {
    id: 'c12',
    content: 'Respuesta con emojis 😀🎉 y código: `const x = 1`',
    name: 'Dev Tester',
    avatar: '/avatars/avatar4.svg',
    parentId: 'c11',
    createdAt: '2024-01-15T11:50:00.000Z',
  },
  // --- Raíz 5: rama lineal muy larga (cascada 6 niveles) ---
  {
    id: 'c13',
    content: 'Inicio de cadena lineal',
    name: 'Usuario A',
    avatar: '/avatars/avatar1.svg',
    parentId: null,
    createdAt: '2024-01-15T12:00:00.000Z',
  },
  {
    id: 'c14',
    content: 'Nivel 2 de la cascada',
    name: 'Usuario B',
    avatar: '/avatars/avatar2.svg',
    parentId: 'c13',
    createdAt: '2024-01-15T12:05:00.000Z',
  },
  {
    id: 'c15',
    content: 'Nivel 3 de la cascada',
    name: 'Usuario C',
    avatar: '/avatars/avatar3.svg',
    parentId: 'c14',
    createdAt: '2024-01-15T12:10:00.000Z',
  },
  {
    id: 'c16',
    content: 'Nivel 4 de la cascada',
    name: 'Usuario D',
    avatar: '/avatars/avatar4.svg',
    parentId: 'c15',
    createdAt: '2024-01-15T12:15:00.000Z',
  },
  {
    id: 'c17',
    content: 'Nivel 5 de la cascada',
    name: 'Usuario E',
    avatar: '/avatars/avatar5.svg',
    parentId: 'c16',
    createdAt: '2024-01-15T12:20:00.000Z',
  },
  {
    id: 'c18',
    content: 'Final de cascada (nivel 6)',
    name: 'Usuario F',
    avatar: '/avatars/avatar6.svg',
    parentId: 'c17',
    createdAt: '2024-01-15T12:25:00.000Z',
  },
  // --- Raíz 6: embudo (un hijo con muchos nietos) ---
  {
    id: 'c19',
    content: 'Raíz con un solo hijo',
    name: 'Padre Único',
    avatar: '/avatars/avatar7.svg',
    parentId: null,
    createdAt: '2024-01-15T12:30:00.000Z',
  },
  {
    id: 'c20',
    content: 'Hijo único que tiene muchas respuestas',
    name: 'Hijo Con Muchos',
    avatar: '/avatars/avatar8.svg',
    parentId: 'c19',
    createdAt: '2024-01-15T12:32:00.000Z',
  },
  {
    id: 'c21',
    content: 'Nieto 1',
    name: 'Nieto A',
    avatar: '/avatars/avatar1.svg',
    parentId: 'c20',
    createdAt: '2024-01-15T12:33:00.000Z',
  },
  {
    id: 'c22',
    content: 'Nieto 2',
    name: 'Nieto B',
    avatar: '/avatars/avatar2.svg',
    parentId: 'c20',
    createdAt: '2024-01-15T12:34:00.000Z',
  },
  {
    id: 'c23',
    content: 'Nieto 3',
    name: 'Nieto C',
    avatar: '/avatars/avatar3.svg',
    parentId: 'c20',
    createdAt: '2024-01-15T12:35:00.000Z',
  },
  {
    id: 'c24',
    content: 'Nieto 4',
    name: 'Nieto D',
    avatar: '/avatars/avatar4.svg',
    parentId: 'c20',
    createdAt: '2024-01-15T12:36:00.000Z',
  },
  {
    id: 'c25',
    content: 'Nieto 5',
    name: 'Nieto E',
    avatar: '/avatars/avatar5.svg',
    parentId: 'c20',
    createdAt: '2024-01-15T12:37:00.000Z',
  },
  {
    id: 'c26',
    content: 'Nieto 6',
    name: 'Nieto F',
    avatar: '/avatars/avatar6.svg',
    parentId: 'c20',
    createdAt: '2024-01-15T12:38:00.000Z',
  },
  // --- Raíz 7: muchos hermanos (7 respuestas directas) ---
  {
    id: 'c27',
    content: 'Comentario con muchas respuestas directas',
    name: 'Popular Post',
    avatar: '/avatars/avatar7.svg',
    parentId: null,
    createdAt: '2024-01-15T12:40:00.000Z',
  },
  {
    id: 'c28',
    content: 'Respuesta 1',
    name: 'R1',
    avatar: '/avatars/avatar1.svg',
    parentId: 'c27',
    createdAt: '2024-01-15T12:41:00.000Z',
  },
  {
    id: 'c29',
    content: 'Respuesta 2',
    name: 'R2',
    avatar: '/avatars/avatar2.svg',
    parentId: 'c27',
    createdAt: '2024-01-15T12:42:00.000Z',
  },
  {
    id: 'c30',
    content: 'Respuesta 3',
    name: 'R3',
    avatar: '/avatars/avatar3.svg',
    parentId: 'c27',
    createdAt: '2024-01-15T12:43:00.000Z',
  },
  {
    id: 'c31',
    content: 'Respuesta 4',
    name: 'R4',
    avatar: '/avatars/avatar4.svg',
    parentId: 'c27',
    createdAt: '2024-01-15T12:44:00.000Z',
  },
  {
    id: 'c32',
    content: 'Respuesta 5',
    name: 'R5',
    avatar: '/avatars/avatar5.svg',
    parentId: 'c27',
    createdAt: '2024-01-15T12:45:00.000Z',
  },
  {
    id: 'c33',
    content: 'Respuesta 6',
    name: 'R6',
    avatar: '/avatars/avatar6.svg',
    parentId: 'c27',
    createdAt: '2024-01-15T12:46:00.000Z',
  },
  {
    id: 'c34',
    content: 'Respuesta 7',
    name: 'R7',
    avatar: '/avatars/avatar7.svg',
    parentId: 'c27',
    createdAt: '2024-01-15T12:47:00.000Z',
  },
  // --- Raíz 8: conversación alternada A→B→A→B ---
  {
    id: 'c35',
    content: 'Inicio de debate',
    name: 'Alice',
    avatar: '/avatars/avatar1.svg',
    parentId: null,
    createdAt: '2024-01-15T12:50:00.000Z',
  },
  {
    id: 'c36',
    content: 'Contraargumento de Bob',
    name: 'Bob',
    avatar: '/avatars/avatar2.svg',
    parentId: 'c35',
    createdAt: '2024-01-15T12:51:00.000Z',
  },
  {
    id: 'c37',
    content: 'Réplica de Alice',
    name: 'Alice',
    avatar: '/avatars/avatar1.svg',
    parentId: 'c36',
    createdAt: '2024-01-15T12:52:00.000Z',
  },
  {
    id: 'c38',
    content: 'Contraréplica de Bob',
    name: 'Bob',
    avatar: '/avatars/avatar2.svg',
    parentId: 'c37',
    createdAt: '2024-01-15T12:53:00.000Z',
  },
  // --- Raíz 9: usuario respondiéndose a sí mismo ---
  {
    id: 'c39',
    content: 'Nota mental inicial',
    name: 'Solo Yo',
    avatar: '/avatars/avatar3.svg',
    parentId: null,
    createdAt: '2024-01-15T12:55:00.000Z',
  },
  {
    id: 'c40',
    content: 'Añado más detalle',
    name: 'Solo Yo',
    avatar: '/avatars/avatar3.svg',
    parentId: 'c39',
    createdAt: '2024-01-15T12:56:00.000Z',
  },
  {
    id: 'c41',
    content: 'Y un detalle final',
    name: 'Solo Yo',
    avatar: '/avatars/avatar3.svg',
    parentId: 'c40',
    createdAt: '2024-01-15T12:57:00.000Z',
  },
  // --- Raíz 10: orden temporal (hijo más antiguo que el padre) ---
  {
    id: 'c42',
    content: 'Comentario padre (posteado después)',
    name: 'Padre Tardío',
    avatar: '/avatars/avatar4.svg',
    parentId: null,
    createdAt: '2024-01-15T13:00:00.000Z',
  },
  {
    id: 'c43',
    content: 'Respuesta que aparece antes en el tiempo',
    name: 'Hijo Temprano',
    avatar: '/avatars/avatar5.svg',
    parentId: 'c42',
    createdAt: '2024-01-15T12:55:00.000Z',
  },
  // --- Raíz 11 y 12: misma fecha exacta ---
  {
    id: 'c44',
    content: 'Primer comentario del minuto',
    name: 'Cronológico A',
    avatar: '/avatars/avatar6.svg',
    parentId: null,
    createdAt: '2024-01-15T13:10:00.000Z',
  },
  {
    id: 'c45',
    content: 'Segundo comentario del mismo minuto',
    name: 'Cronológico B',
    avatar: '/avatars/avatar7.svg',
    parentId: null,
    createdAt: '2024-01-15T13:10:00.000Z',
  },
  // --- Raíz 13: nombre muy largo ---
  {
    id: 'c46',
    content: 'Comentario de alguien con nombre extenso',
    name: 'María Fernanda de las Mercedes González-Sánchez y Rodríguez',
    avatar: '/avatars/avatar8.svg',
    parentId: null,
    createdAt: '2024-01-15T13:15:00.000Z',
  },
  // --- Raíz 14: nombre con caracteres especiales (ñ, acentos) ---
  {
    id: 'c47',
    content: 'Comentario de prueba con ñ y acentos',
    name: 'José María Niño-Cañón',
    avatar: '/avatars/avatar1.svg',
    parentId: null,
    createdAt: '2024-01-15T13:20:00.000Z',
  },
  // --- Raíz 15: texto muy largo ---
  {
    id: 'c48',
    content: `Este es un comentario extremadamente largo para probar el comportamiento de la UI cuando el contenido ocupa mucho espacio. Debería renderizarse correctamente sin romper el layout, permitiendo scroll si es necesario y manteniendo la legibilidad del texto. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
    name: 'Usuario Verboso',
    avatar: '/avatars/avatar2.svg',
    parentId: null,
    createdAt: '2024-01-15T13:25:00.000Z',
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
