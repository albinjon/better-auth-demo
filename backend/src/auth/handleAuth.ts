import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import type { IncomingMessage, ServerResponse } from "http";
import { type Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import {
  createAuthMiddleware,
  openAPI,
  organization,
} from "better-auth/plugins";
import { ac, admin, member } from "@zbs/shared";

const prisma = new PrismaClient();

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:5173"],
  plugins: [
    openAPI(),
    organization({
      ac,
      roles: { admin, member },
    }),
  ],
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
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const userId = ctx.context.newSession?.user.id;
        if (!userId) {
          throw new Error(
            "There was a problem getting the user ID from the newly created user, and could therefore not add them to the default organization.",
          );
        }
        await auth.api.addMember({
          body: {
            role: "member",
            userId,
            organizationId: "71IH1s2ohBwrnCEJ2Upj8lpPgou6jCC1",
          },
        });
      }
    }),
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
