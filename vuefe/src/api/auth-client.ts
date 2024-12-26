import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";
import { ac, admin, member } from "@zbs/shared";

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac,
      roles: { admin, member },
    }),
  ],
  baseURL: "http://localhost:4000",
});
