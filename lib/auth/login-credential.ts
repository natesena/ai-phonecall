import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/utils/supabase";

type Input = {
  email: string;
  password: string;
};

export type DecodedData = {
  sub: string;
  email: string;
  emailVerified: boolean;
};

type Credentials = Record<keyof Input, any>;

export const LoginCredential = CredentialsProvider<Credentials>({
  name: "Credentials",
  type: "credentials",
  credentials: {
    email: {},
    password: {},
  },
  async authorize(credentials) {
    if (!credentials) throw new Error("Credentials Required");

    const { email, password } = credentials;

    // Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    const user = data.user;

    if (!user) {
      throw new Error("User not found");
    }

    // Return user data and session information
    return {
      id: user.id,
      email: user.email,
      phone: user.phone || "",
      updated_at: user.updated_at,
      created_at: user.created_at,
      accessToken: data.session.access_token, // Include the access token
    };
  },
});
