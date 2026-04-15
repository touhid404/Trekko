import express from "express";
import chackAuth from "../../middlewares/chackAuth";
import { BlogCommentController } from "./blog-comment.controller";
import { BlogCommentValidationSchema } from "./blog-comment.validation";
import validateRequest from "../../middlewares/validateRequest";
import { MemberRole } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

// Create a blog comment
router.post(
  "/",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  validateRequest(BlogCommentValidationSchema.create),
  BlogCommentController.createComment,
);

// Get nested comments for a blog
router.get("/:blogId", BlogCommentController.getComments);

// Update a blog comment
router.patch(
  "/:commentId",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  validateRequest(BlogCommentValidationSchema.update),
  BlogCommentController.updateComment,
);

// Delete a blog comment
router.delete(
  "/:commentId",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  BlogCommentController.deleteComment,
);

export const BlogCommentRoutes = router;
