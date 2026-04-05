import status from "http-status";
import { MemberRole } from "../prisma/generated/prisma/enums";
import AppError from "./errors/AppError";
import { auth } from "./lib/auth";
import { prisma } from "./lib/prisma";

const createAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: {
        email: "touhidulislamriyadh@gmail.com",
      },
    });

    if (existingSuperAdmin) {
      throw new AppError(status.CONFLICT, "Super admin already exists");
    }

    // Create user with better-auth
    await auth.api.signUpEmail({
      body: {
        name: "Touhidul Islam",
        email: "touhidulislamriyadh@gmail.com",
        password: "12345678",
        role: MemberRole.ADMIN,
      },
    });
  } catch (error) {
    console.error("Error creating super admin:", error);
  }
};

// Run the seed function
createAdmin();
