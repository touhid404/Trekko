import express from "express";
import chackAuth from "../../middlewares/chackAuth";
import { PaymentController } from "./payment.controller";
import { MemberRole } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

router.post(
  "/create-session",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  PaymentController.createPaymentSession,
);

router.post(
  "/verify-session",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  PaymentController.verifyPaymentSession,
);

// Webhook route uses app-level raw middleware at /webhook so Stripe signature validation works.
export const PaymentRoutes = router;
