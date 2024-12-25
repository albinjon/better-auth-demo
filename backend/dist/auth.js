import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
const prisma = new PrismaClient();
function handleAuth(pattern) {
    const app = express();
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
    }));
    app.all(pattern);
    return toNodeHandler(auth);
}
export const auth = betterAuth({
    trustedOrigins: ["http://localhost:5173"],
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
