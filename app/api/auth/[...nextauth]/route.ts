/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { db } from "@app/db";
import type { Adapter } from "next-auth/adapters";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Custom Kysely adapter for NextAuth
const kyselyAdapter: Adapter = {
  createUser: async (data: any) => {
    const result = await db
      .insertInto("User")
      .values({
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.image,
        emailVerified: data.emailVerified,
      })
      .returningAll()
      .executeTakeFirst();

    return result || data;
  },

  getUser: async (id: string) => {
    const user = await db.selectFrom("User").selectAll().where("id", "=", id).executeTakeFirst();

    return (user as any) || null;
  },

  getUserByEmail: async (email: string) => {
    const user = await db
      .selectFrom("User")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();

    return (user as any) || null;
  },

  getUserByAccount: async ({
    provider,
    providerAccountId,
  }: {
    provider: string;
    providerAccountId: string;
  }) => {
    const account = await db
      .selectFrom("Account")
      .innerJoin("User", "User.id", "Account.userId")
      .selectAll()
      .where("provider", "=", provider)
      .where("providerAccountId", "=", providerAccountId)
      .executeTakeFirst();

    if (!account) return null;

    // Extract user data from the flattened join result
    const user = {
      id: account.id,
      name: account.name,
      email: account.email,
      image: account.image,
      emailVerified: account.emailVerified,
    };

    return user as any;
  },

  updateUser: async ({ id, ...data }: { id: string; [key: string]: any }) => {
    const result = await db
      .updateTable("User")
      .set(data)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    return (result as any) || { id, ...data };
  },

  deleteUser: async (id: string) => {
    await db.deleteFrom("User").where("id", "=", id).execute();

    return null;
  },

  linkAccount: async (data: any) => {
    await db
      .insertInto("Account")
      .values({
        id: data.id,
        userId: data.userId,
        type: data.type,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        refresh_token: data.refresh_token || null,
        access_token: data.access_token || null,
        expires_at: data.expires_at || null,
        token_type: data.token_type || null,
        scope: data.scope || null,
        id_token: data.id_token || null,
        session_state: data.session_state || null,
      })
      .execute();

    return data;
  },

  unlinkAccount: async ({
    provider,
    providerAccountId,
  }: {
    provider: string;
    providerAccountId: string;
  }) => {
    await db
      .deleteFrom("Account")
      .where("provider", "=", provider)
      .where("providerAccountId", "=", providerAccountId)
      .execute();

    return undefined;
  },

  createSession: async (data: any) => {
    const result = await db
      .insertInto("Session")
      .values({
        id: data.id,
        sessionToken: data.sessionToken,
        userId: data.userId,
        expires: data.expires,
      })
      .returningAll()
      .executeTakeFirst();

    return (result as any) || data;
  },

  getSessionAndUser: async (sessionToken: string) => {
    const session = await db
      .selectFrom("Session")
      .innerJoin("User", "User.id", "Session.userId")
      .selectAll()
      .where("sessionToken", "=", sessionToken)
      .executeTakeFirst();

    if (!session) return null;

    // Extract session and user data from the flattened join result
    const sessionData = {
      id: session.id,
      sessionToken: session.sessionToken,
      userId: session.userId,
      expires: session.expires,
    };

    const user = {
      id: session.id,
      name: session.name,
      email: session.email,
      image: session.image,
      emailVerified: session.emailVerified,
    };

    return {
      session: sessionData as any,
      user: user as any,
    };
  },

  updateSession: async (data: any) => {
    const result = await db
      .updateTable("Session")
      .set(data)
      .where("sessionToken", "=", data.sessionToken)
      .returningAll()
      .executeTakeFirst();

    return (result as any) || data;
  },

  deleteSession: async (sessionToken: string) => {
    await db.deleteFrom("Session").where("sessionToken", "=", sessionToken).execute();

    return null;
  },

  createVerificationToken: async (data: any) => {
    await db
      .insertInto("VerificationToken")
      .values({
        identifier: data.identifier,
        token: data.token,
        expires: data.expires,
      })
      .execute();

    return data;
  },

  useVerificationToken: async ({ identifier, token }: { identifier: string; token: string }) => {
    const verificationToken = await db
      .selectFrom("VerificationToken")
      .selectAll()
      .where("identifier", "=", identifier)
      .where("token", "=", token)
      .executeTakeFirst();

    if (verificationToken) {
      await db
        .deleteFrom("VerificationToken")
        .where("identifier", "=", identifier)
        .where("token", "=", token)
        .execute();
    }

    return verificationToken as any;
  },
};

// Custom Email Provider
const emailProvider = EmailProvider({
  server: {
    host: "smtp.resend.com",
    port: 587,
    auth: {
      user: "resend",
      pass: process.env.RESEND_API_KEY || "",
    },
  },
  from: process.env.RESEND_FROM || "onboarding@resend.dev",
  sendVerificationRequest: async ({ identifier, url, provider }) => {
    try {
      console.log("=== MAGIC LINK EMAIL DEBUG ===");
      console.log("Environment RESEND_FROM:", process.env.RESEND_FROM);
      console.log("Provider from field:", provider.from);
      console.log("Sending verification email to:", identifier);
      console.log("Magic link URL:", url);
      console.log("================================");

      await resend.emails.send({
        from: provider.from,
        to: identifier,
        subject: "Sign in to AI College Essay Reviewer",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">Sign in to AI College Essay Reviewer</h2>
            <p>Click the button below to sign in to your account:</p>
            <a href="${url}" style="display: inline-block; background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Sign In</a>
            <p>If you didn't request this email, you can safely ignore it.</p>
            <p>This link will expire in 24 hours.</p>
          </div>
        `,
      });

      console.log("✅ Magic link email sent successfully to:", identifier);
      console.log("✅ Used from address:", provider.from);
    } catch (error) {
      console.error("❌ Failed to send magic link email:", error);
      console.error("Error details:", {
        identifier,
        from: provider.from,
        envResendFrom: process.env.RESEND_FROM,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw new Error("Failed to send verification email");
    }
  },
});

const handler = NextAuth({
  adapter: kyselyAdapter,
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    emailProvider,
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
