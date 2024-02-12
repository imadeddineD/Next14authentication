import { Role } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([Role.ADMIN, Role.USER]),
  email: z.optional(z.string().email()),
})
  
  


export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters",
  }),
  
});
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  })
  
});
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  
});

