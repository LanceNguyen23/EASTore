import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb";

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Sign in",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text"},
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {

        if (!credentials?.username || !credentials.password) {
          return null;
        }

        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password
          })
        });

        const user = await res.json();

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;  
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, profile }) {

      // pass user Id to token
      if(user) {
        return {
          ...token,
          id: user.id
        }
      }
      // when trigger SignIn, SignOut
      return token;
    },
    async session({ session, token, user }) {
      // pass user Id to session
      return {...session, user: {...session.user, id: token.id}}
    }
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };