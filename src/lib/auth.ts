import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { BLOOD_GROUPS, DISTRICTS } from "@/types/shared";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("bloodos");

const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  baseUrl: process.env.BETTER_AUTH_URL as string,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    crossSubDomainCookies: {
      enabled: isProduction,
    },
    defaultCookieAttributes: {
      secure: isProduction,
      sameSite: isProduction ? "lax" : "none",
      httpOnly: true,
      path: "/",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["user", "admin"],
        defaultValue: "user",
        input: false,
        required: false,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      district: {
        type: DISTRICTS,
        required: false,
        input: true,
      },
      bloodGroup: {
        type: BLOOD_GROUPS,
        required: false,
        input: true,
      },
      isDonor: {
        type: "boolean",
        defaultValue: false,
        required: false,
        input: true,
      },
      lastDonationDate: {
        type: "date",
        required: false,
        input: true,
      },
    },
  },
});
