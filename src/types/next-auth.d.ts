import "next-auth";

declare module "next-auth" {
  interface User {
    clinicId?: string | null;
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      clinicId?: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    clinicId?: string;
    role?: string;
  }
}
