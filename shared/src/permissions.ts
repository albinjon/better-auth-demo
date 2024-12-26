import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  events: ["create", "update", "delete", "read"],
} as const;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
  events: ["read"],
});

export const admin = ac.newRole({
  events: ["create", "update"],
});
