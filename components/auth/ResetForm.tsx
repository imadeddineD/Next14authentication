"use client";

import * as z from "zod";

import Link from "next/link";
import { CardWrapper } from "./CardWrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ResetSchema } from "@/Schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { login } from "@/actions";
import { useState, useTransition } from "react";
import { reset } from "@/actions/reset";


interface ResetProps {
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
  };


export const ResetForm = ({
      headerLabel ,
      backButtonLabel,
      backButtonHref,
} :  ResetProps) => {

  const [error , setError] = useState<string | undefined>("")
  const [success , setSuccess] = useState<string | undefined>("")
  const [isPending , startTransition] = useTransition()

  

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

 

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      reset(values).then((data : any) => {
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
          </div>
          <FormError message={error } />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            Sent Reset Email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};