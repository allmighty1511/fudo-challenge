/**
 * Seed script: inserta datos falsos en la API de MockAPI.
 * Usa los endpoints del challenge: POST /post y POST /post/:id/comment
 * Ejecutar: node scripts/seed.mjs
 */

const BASE = 'https://665de6d7e88051d60408c32d.mockapi.io';

const BASE_URL = process.env.VITE_APP_URL ?? 'http://localhost:5173';

const AVATAR_URLS = [
  `${BASE_URL}/avatars/avatar1.svg`,
  `${BASE_URL}/avatars/avatar2.svg`,
  `${BASE_URL}/avatars/avatar3.svg`,
  `${BASE_URL}/avatars/avatar4.svg`,
  `${BASE_URL}/avatars/avatar5.svg`,
  `${BASE_URL}/avatars/avatar6.svg`,
  `${BASE_URL}/avatars/avatar7.svg`,
  `${BASE_URL}/avatars/avatar8.svg`,
];

const USERS = [
  { name: 'Admin', avatar: AVATAR_URLS[0] },
  { name: 'María Dev', avatar: AVATAR_URLS[1] },
  { name: 'Carlos Lead', avatar: AVATAR_URLS[2] },
  { name: 'Ana', avatar: AVATAR_URLS[3] },
  { name: 'Luis', avatar: AVATAR_URLS[4] },
  { name: 'Sofia', avatar: AVATAR_URLS[5] },
  { name: 'Pablo', avatar: AVATAR_URLS[6] },
  { name: 'Elena', avatar: AVATAR_URLS[7] },
];

const POST_TITLES = [
  'Bienvenidos a DevThread',
  '¿Cuál es tu stack favorito en 2024?',
  'Tips para code reviews más efectivos',
  '¿Alguien usa Deno en producción?',
  'Mejor forma de manejar estado en React',
  'TypeScript vs JavaScript: ¿vale la pena?',
  'Cómo estructurar un monorepo',
  'Recomendaciones de testing E2E',
  'API REST vs GraphQL en 2024',
  'Docker en desarrollo local',
  'Patrones de diseño que sigo',
  '¿Qué IDE usan?',
  'Cómo aprendiste a programar',
  'Recursos para aprender Rust',
  'CI/CD con GitHub Actions',
  'Manejo de errores en frontend',
  '¿Usan feature flags?',
  'Documentación de APIs',
  'Refactoring legacy code',
  'Pair programming remoto',
  'Métricas que miden en su equipo',
  'Cómo priorizan el backlog',
  'Onboarding de nuevos devs',
];

const POST_CONTENTS = [
  'Comparte tus ideas, preguntas y proyectos con la comunidad.',
  'Estoy evaluando opciones para un nuevo proyecto. ¿Qué recomiendan?',
  'Después de años en la industria, estos son mis consejos prácticos.',
  'Quisiera saber experiencias reales antes de adoptar algo nuevo.',
  'Hay muchas formas de hacerlo. ¿Cuál les funciona mejor?',
  'El debate de siempre. ¿Qué opinan en 2024?',
  'Necesito organizar varios paquetes. ¿Qué estructura usan?',
  'Cypress, Playwright, otros? ¿Cuál prefieren y por qué?',
  'Cada uno tiene sus pros. ¿En qué casos eligen uno u otro?',
  '¿Vale la pena para desarrollo o solo para prod?',
  'Los que más uso día a día. ¿Cuáles aplican ustedes?',
  'VS Code, JetBrains, Neovim... ¿Qué les funciona?',
  'Todos tenemos una historia. ¿Cómo fue su camino?',
  'Rust está ganando terreno. ¿Por dónde empezar?',
  'Tips para pipelines eficientes y mantenibles.',
  'Error boundaries, toasts, logging... ¿Cómo lo manejan?',
  '¿Los usan? ¿Qué herramienta recomiendan?',
  'OpenAPI, Postman, algo custom... ¿Qué flujo tienen?',
  'Código viejo que nadie quiere tocar. ¿Cómo lo abordan?',
  '¿Qué herramientas usan? ¿Funciona bien remoto?',
  'SLA, uptime, errores... ¿Qué dashboards tienen?',
  'Sprint planning, OKRs... ¿Cómo deciden qué hacer?',
  'Primera semana, primer mes. ¿Qué les funcionó?',
];

const COMMENT_TEXTS = [
  'Buena pregunta. Yo uso...',
  'Totalmente de acuerdo.',
  'No había pensado en eso. Interesante.',
  'En mi equipo hacemos...',
  '¿Probaste con...?',
  'Gracias por compartir.',
  'Algo que me ayudó fue...',
  '¿Tienes algún ejemplo?',
  'Eso depende del contexto.',
  'Recomiendo revisar...',
  'Nosotros lo resolvimos así.',
  '¿Qué tal si...?',
  'Buen punto. Añadiría que...',
  'Eso me recuerda a...',
  '¿Alguien más tuvo ese problema?',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickUser() {
  return pick(USERS);
}

async function createResource(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`);
  return res.json();
}

async function seed() {
  console.log('Seeding API (endpoints del challenge)...');
  const createdPosts = [];

  for (let i = 0; i < 20; i++) {
    const idx = i % POST_TITLES.length;
    const user = pickUser();
    const p = {
      title: POST_TITLES[idx],
      content: POST_CONTENTS[idx],
      name: user.name,
      avatar: user.avatar,
    };
    try {
      const created = await createResource(`${BASE}/post`, p);
      createdPosts.push(created);
      console.log(`  Post ${createdPosts.length}: ${created.title} (id: ${created.id})`);
    } catch (e) {
      console.warn(`  Skip: ${e.message}`);
    }
  }

  const noCommentIndices = new Set();
  while (noCommentIndices.size < 3 && noCommentIndices.size < createdPosts.length) {
    noCommentIndices.add(Math.floor(Math.random() * createdPosts.length));
  }

  let commentsOk = false;
  for (let i = 0; i < createdPosts.length; i++) {
    const post = createdPosts[i];
    if (noCommentIndices.has(i)) continue;

    const numComments = Math.floor(Math.random() * 11);
    if (numComments === 0) continue;

    try {
      const roots = [];
      for (let j = 0; j < numComments; j++) {
        const u = pickUser();
        const c = await createResource(`${BASE}/post/${post.id}/comment`, {
          content: pick(COMMENT_TEXTS),
          name: u.name,
          avatar: u.avatar,
          parentId: null,
        });
        roots.push(c);
      }

      const numReplies = Math.floor(Math.random() * Math.min(roots.length, 5));
      for (let r = 0; r < numReplies; r++) {
        const parent = pick(roots);
        const u = pickUser();
        await createResource(`${BASE}/post/${post.id}/comment`, {
          content: pick(COMMENT_TEXTS),
          name: u.name,
          avatar: u.avatar,
          parentId: parent.id,
        });
      }
      commentsOk = true;
    } catch (e) {
      if (!commentsOk) console.warn(`  Comments 404 para post ${post.id}`);
    }
  }

  console.log('Seed completed.');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
