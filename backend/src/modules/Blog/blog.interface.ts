export type Blog = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  coverImage?: string | null;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    name: string;
    email?: string;
    profilePhoto?: string | null;
  };
  _count?: {
    likes: number;
    comments: number;
  };
};

export type CreateBlogPayload = {
  title: string;
  content: string;
  coverImage?: string;
};

export type UpdateBlogPayload = {
  title?: string;
  content?: string;
  coverImage?: string;
};
