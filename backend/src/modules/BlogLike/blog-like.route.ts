import express from "express";
import chackAuth from "../../middlewares/chackAuth";
import { BlogLikeController } from "./blog-like.controller";
import { MemberRole } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

// Toggle like on a blog post
router.post(
  "/:blogId",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  BlogLikeController.toggleLike,
);

export const BlogLikeRoutes = router;
