import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      mosqueId: string;
    } & DefaultSession["user"];
  }

  interface User {
    mosqueId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    mosqueId: string;
  }
}
