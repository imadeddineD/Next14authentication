"use client";

import * as z from "zod";

import Link from "next/link";
import { CardWrapper } from "./CardWrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { NewPasswordSchema } from "@/Schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { login } from "@/actions";
import { useState, useTransition } from "react";
import { reset } from "@/actions/reset";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/newPassword";


interface ResetProps {
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
  };


export const NewPasswordForm = ({
      headerLabel ,
      backButtonLabel,
      backButtonHref,
} :  ResetProps) => {

  const [error , setError] = useState<string | undefined>("")
  const [success , setSuccess] = useState<string | undefined>("")
  const [isPending , startTransition] = useTransition()

  const searchParams = useSearchParams()

  const token = searchParams.get("token")

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

 

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("")
    setSuccess("")


    startTransition(() => {
      newPassword(values , token).then((data : any) => {
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
    > 
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
                <FormField
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
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
          <FormError message={error } />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            Generate New Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};