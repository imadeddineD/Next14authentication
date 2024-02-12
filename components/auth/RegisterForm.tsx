"use client";

import * as z from "zod";

import Link from "next/link";
import { CardWrapper } from "./CardWrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RegisterSchema } from "@/Schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { login, register } from "@/actions";
import { useState, useTransition } from "react";


interface RegisterProps {
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
  };


export const RegisterForm = ({
      headerLabel ,
      backButtonLabel,
      backButtonHref,
      showSocial
} :  RegisterProps) => {

  const [error , setError] = useState<string | undefined>("")
  const [success , setSuccess] = useState<string | undefined>("")
  const [isPending , startTransition] = useTransition()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name : ""
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("")
    setSuccess("")


    startTransition(() => {
      register(values).then((data) => {
        setError(data.error)
        setSuccess(data.success)
      })
    })
    
  };
  return (
    <CardWrapper
      headerLabel={headerLabel}
      backButtonLabel={backButtonLabel}
      backButtonHref={backButtonHref}
      showSocial={showSocial}
    >
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
                <FormField
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="John Doe"
                          
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="john.doe@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          type="password"
                        />
                      </FormControl>                    
                      <FormMessage />
                    </FormItem>
                  )}
                />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full bg-blue-800 hover:bg-blue-600"
            disabled={isPending}
          >
            Create an Account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};