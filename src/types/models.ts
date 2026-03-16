export interface Post {
  id: string;
  title: string;
  content: string;
  name: string;
  avatar: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  name: string;
  avatar: string;
  parentId: string | null;
  createdAt: string;
}
