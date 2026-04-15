import express from "express";
import chackAuth from "../../middlewares/chackAuth";
import { BlogController } from "./blog.controller";
import { BlogValidationSchema } from "./blog.validation";
import validateRequest from "../../middlewares/validateRequest";
import { MemberRole } from "../../../prisma/generated/prisma/enums";
import optionalAuth from "../../middlewares/optionalAuth";

const router = express.Router();

router.post(
  "/",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  validateRequest(BlogValidationSchema.create),
  BlogController.create,
);

router.get("/", optionalAuth, BlogController.getAll);

router.get("/:id", optionalAuth, BlogController.getById);

router.patch(
  "/:id",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  validateRequest(BlogValidationSchema.update),
  BlogController.update,
);

router.delete(
  "/:id",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  BlogController.remove,
);

export const BlogRoutes = router;
