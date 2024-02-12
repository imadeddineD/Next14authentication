import NextAuth from "next-auth" // This imports the NextAuth library, which provides authentication functionalities for Next.js applications.
import { db } from "./lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"
import { getUserById } from "./data/user"
import { getTwoFactorConfirmationByUserId } from "./data/twoFactorConfirmation"
import { Role } from "@prisma/client"
import { getAccountByUserId } from "./data/account"

export const {
  handlers: { GET, POST },
  auth,
  signIn , 
  signOut
} = NextAuth({ 
  pages : {
    signIn : "/auth/login" , 
    error : "/auth/error"
  },
  events : {
    async linkAccount ({user}) {
      await db.user.update({
        where : {id : user.id} , 
        data : {emailVerified : new Date()}
      })
    }
  },
  callbacks: {

    async signIn({user  , account} : any) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
      }

      return true
    },
    
    async jwt({ token }) {
      if(!token.sub) return token
      const existingUser : any = await getUserById(token.sub)

      const existingAccount = await getAccountByUserId(
        existingUser.id
      );

      

      if(existingUser){
         token.role = existingUser?.role
         token.name = existingUser?.name
         token.email = existingUser?.email
         token.isOAuth = !!existingAccount;
         token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
        }
      return token
    }
    ,async session({ session, user, token  }: any) {
      if(token.sub && session.user) session.user.id = token.sub;
      if (token.role && session.user) session.user.role = token.role as Role;
      if (session.user) {
        session.user.email = token.email ;
        session.user.isOAuth = token.isOAuth
        session.user.name = token.name;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled
      }
      
      return session
    },
  },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})