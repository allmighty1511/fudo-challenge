export const messages = {
  errors: {
    loadPost: 'Error al cargar el post.',
    loadPosts: 'Error al cargar los posts.',
    loadComments: 'Error al cargar los comentarios.',
  },
  notFound: {
    post: 'Post no encontrado.',
  },
  confirm: {
    deletePost: '¿Eliminar este post?',
    deleteComment: '¿Eliminar este comentario?',
    deleteCommentWithReplies: '¿Eliminar este comentario y todas sus respuestas?',
  },
  navigation: {
    backToFeed: 'Volver al feed',
    backToFeedWithArrow: '← Volver al feed',
  },
  empty: {
    noPosts: 'No hay posts aún. ¡Crea el primero!',
    noComments: 'No hay comentarios aún. ¡Sé el primero en comentar!',
  },
} as const;
