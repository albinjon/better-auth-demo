import express, { type Application } from "express";
import { handleAuth } from "./auth/handleAuth.js";

export default function createServer() {
  const app: Application = express();
  app.use(handleAuth("/api/auth/*", app));
  app.use(express.json());
  return app;
}
