import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import type { IncomingMessage, ServerResponse } from "http";
import { type Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

const prisma = new PrismaClient();

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:5173"],
  session: {
    updateAge: 0,
    expiresIn: 60 * 60 * 24 * 7,
  },
  user: {
    additionalFields: {
      notifications: {
        type: "string",
        defaultValue: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});

export function handleAuth(
  pattern: string,
  app: Application,
): {
  (req: IncomingMessage, res: ServerResponse): Promise<void>;
} {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );
  app.all(pattern);
  return toNodeHandler(auth);
}
