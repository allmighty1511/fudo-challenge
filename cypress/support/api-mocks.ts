import { mockPosts as fixturePosts } from '../fixtures/mock-posts';
import { mockComments as fixtureComments } from '../fixtures/mock-comments';

export const mockPosts = fixturePosts;
export const mockComments = fixtureComments;

const MOCK_API = Cypress.env('mockApi') as string;

const deletedPostIds = new Set<string>();
const updatedPosts = new Map<string, (typeof mockPosts)[0]>();

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
      ...(getPostById(id) ?? mockPosts[0]),
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
    }
  ).as('createComment');
}
