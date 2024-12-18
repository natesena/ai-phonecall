import CredentialsProvider from "next-auth/providers/credentials";

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

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const { user } = await response.json();
    
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});
