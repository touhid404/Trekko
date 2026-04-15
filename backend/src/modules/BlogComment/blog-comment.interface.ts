export type BlogComment = {
  id: string;
  blogId: string;
  memberId: string;
  parentId?: string | null;
  comment: string;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  replies?: BlogComment[];
  member?: {
    id: string;
    name: string;
    email?: string;
    profilePhoto?: string | null;
  };
};

export type CreateBlogCommentPayload = {
  blogId: string;
  comment: string;
  parentId?: string | null;
};

export type UpdateBlogCommentPayload = {
  comment: string;
};
