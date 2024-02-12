"use server"

import { LoginSchema, RegisterSchema } from "@/Schemas"
import * as z from "zod";
import bcrypt from 'bcryptjs'
import { db } from "@/lib/db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/token";
import { getUserByEmail } from "@/data/user";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/twoFactorToken";
import { getTwoFactorConfirmationByUserId } from "@/data/twoFactorConfirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {

    const validateFields = LoginSchema.safeParse(values)

    if (!validateFields.success) {
        return {error : "invalid fields !"}
    }

    const {email , password , code } = validateFields.data

    const existingUser = await getUserByEmail(email)

    if(!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist!" }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
          existingUser.email,
        );

        await sendVerificationEmail(verificationToken.email,  verificationToken.token)

    
        await sendVerificationEmail(
          verificationToken.email,
          verificationToken.token,
        );
    
        return { success: "Confirmation email sent!" };
      }

      if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );
    
          if (!twoFactorToken) {
            return { error: "Invalid code!" };
          }
    
          if (twoFactorToken.token !== code) {
            return { error: "Invalid code!" };
          }
    
          const hasExpired = new Date(twoFactorToken.expires) < new Date();
    
          if (hasExpired) {
            return { error: "Code expired!" };
          }
    
          await db.twoFactorToken.delete({
            where: { id: twoFactorToken.id }
          });
    
          const existingConfirmation = await getTwoFactorConfirmationByUserId(
            existingUser.id
          );
    
          if (existingConfirmation) {
            await db.twoFactorConfirmation.delete({
              where: { id: existingConfirmation.id }
            });
          }
    
          await db.twoFactorConfirmation.create({
            data: {
              userId: existingUser.id,
            }
          });
        } else {
          const twoFactorToken = await generateTwoFactorToken(existingUser.email)
          await sendTwoFactorTokenEmail(
            twoFactorToken.email,
            twoFactorToken.token,
          );
    
          return { twoFactor: true };
        }
      }

    try {
        await signIn("credentials", {
          email,
          password,
          redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
      } catch (error) {
        if (error instanceof AuthError) {
          switch (error.type) {
            case "CredentialsSignin":
              return { error: "Invalid credentials!" }
            default:
              return { error: "Something went wrong!" }
          }
        }
    
        throw error;
      }
    
}
export const register = async (values: z.infer<typeof RegisterSchema>) => {

    const validateFields = RegisterSchema.safeParse(values)

    if (!validateFields.success) {
        return {error : "invalid fields !"}
    }

    const {name , email , password} = validateFields.data

    const hashedPassword = await bcrypt.hash(password , 10)

    const existingUser = await getUserByEmail(email)

    if(existingUser) {
        return {error : "email already exist !!"}
    }

    await db.user.create({
        data : {
            name , 
            email , 
            password : hashedPassword    
        }
    })

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email,  verificationToken.token)


    return {success : "confimation email sent !"}
    
}