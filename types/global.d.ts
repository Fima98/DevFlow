export interface Question {
  _id: string;
  title: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  answers: number;
  views: number;
}

export interface Tag {
  _id: string;
  name: string;
}

export interface Author {
  _id: string;
  name: string;
  image: string;
}
