/**
 * Seed comments: itera por todos los posts (excepto el primero) y les genera comentarios.
 *
 * CONFIGURAR EN MOCKAPI.IO:
 * 1. Ir a https://665de6d7e88051d60408c32d.mockapi.io
 * 2. El recurso "comment" (singular) debe ser HIJO de "post"
 * 3. Campos: content (string), name (string), avatar (string), parentId (string|null)
 *
 * Ejecutar: npm run seed:comments
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url, opts, maxRetries = 3) {
  let res;
  for (let i = 0; i < maxRetries; i++) {
    res = await fetch(url, opts);
    if (res.status === 429 && i < maxRetries - 1) {
      const wait = 6000 + i * 2000;
      console.warn(`  Rate limit (429). Esperando ${wait / 1000}s...`);
      await sleep(wait);
      continue;
    }
    return res;
  }
  return res;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickUser() {
  return pick(USERS);
}

async function getComments(postId) {
  const res = await fetchWithRetry(`${BASE}/post/${postId}/comment`);
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GET comments failed: ${res.status}`);
  return res.json();
}

async function deleteComment(postId, commentId) {
  const res = await fetchWithRetry(`${BASE}/post/${postId}/comment/${commentId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`DELETE comment failed: ${res.status}`);
  await sleep(500);
}

async function createComment(postId, body) {
  const payload = {
    content: body.content,
    name: body.name,
    avatar: body.avatar,
    parentId: body.parentId ?? null,
  };
  const res = await fetchWithRetry(`${BASE}/post/${postId}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST comments failed: ${res.status} - ${text.slice(0, 100)}`);
  }
  await sleep(500);
  return res.json();
}

async function clearAllComments(posts) {
  console.log('Borrando comentarios existentes...');
  let deleted = 0;
  for (const post of posts) {
    try {
      const comments = await getComments(post.id);
      await sleep(400);
      for (const c of comments) {
        await deleteComment(post.id, c.id);
        deleted++;
      }
    } catch (e) {
      console.warn(`  Post ${post.id}: no se pudieron borrar comentarios: ${e.message}`);
    }
  }
  if (deleted > 0) console.log(`  Borrados ${deleted} comentarios.`);
  return deleted;
}

async function seedComments() {
  console.log('Obteniendo posts...');
  const posts = await fetchWithRetry(`${BASE}/post`).then((r) => r.json());
  if (!posts.length) {
    console.log('No hay posts.');
    return;
  }

  await clearAllComments(posts);

  const postsToSeed = posts.slice(1);
  console.log(`\nGenerando comentarios para ${postsToSeed.length} posts (excluyendo el primero)...`);

  let totalComments = 0;
  let failed = 0;

  // Límite MockAPI ~100 elementos: ~4 comentarios/post × 19 posts ≈ 76
  const MAX_ROOTS = 4;
  const MAX_REPLIES = 2;

  for (const post of postsToSeed) {
    const numComments = Math.floor(Math.random() * (MAX_ROOTS + 1));
    if (numComments === 0) continue;

    try {
      const roots = [];
      for (let j = 0; j < numComments; j++) {
        const u = pickUser();
        const c = await createComment(post.id, {
          content: pick(COMMENT_TEXTS),
          name: u.name,
          avatar: u.avatar,
          parentId: null,
        });
        roots.push(c);
      }

      const numReplies = Math.floor(Math.random() * Math.min(roots.length, MAX_REPLIES) + 1);
      for (let r = 0; r < numReplies; r++) {
        const parent = pick(roots);
        const u = pickUser();
        await createComment(post.id, {
          content: pick(COMMENT_TEXTS),
          name: u.name,
          avatar: u.avatar,
          parentId: parent.id,
        });
      }

      totalComments += numComments + numReplies;
      console.log(`  Post ${post.id} (${post.title?.slice(0, 30)}...): ${numComments} comentarios + ${numReplies} respuestas`);
    } catch (e) {
      failed++;
      console.warn(`  Post ${post.id}: ${e.message}`);
    }
  }

  console.log(`\nCompletado. ${totalComments} comentarios creados. ${failed} posts fallaron.`);
  if (failed > 0) {
    console.log('\nAlgunos fallos pueden deberse al límite del plan gratuito de MockAPI.');
  }
}

seedComments().catch((err) => {
  console.error('Error:', err.message);
  console.log('\n¿El recurso "comments" existe en mockapi.io? Debe ser hijo de "post".');
  process.exit(1);
});
