import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: "http://localhost:4000", // the base url of your auth server
});