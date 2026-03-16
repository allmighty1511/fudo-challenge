export interface PostFormFields {
  title: string;
  content: string;
  name: string;
}

export interface PostFormData extends PostFormFields {
  avatar: string;
}
