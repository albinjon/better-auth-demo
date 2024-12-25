import { toNodeHandler } from "better-auth/node";
import express, {} from "express";
import { auth } from "../auth.js";
import cors from "cors";
export default function createServer() {
    const app = express();
    handleAuth("/api/auth/*");
    app.use(express.json());
    return app;
}
