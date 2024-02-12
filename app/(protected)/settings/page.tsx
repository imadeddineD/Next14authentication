'use client'
import { SettingsSchema } from "@/Schemas";
import { settings } from "@/actions/settings";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";



const page =  () => {
  const user = useCurrentUser();
  const {update} = useSession()

  const { data: session } = useSession();


  

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const role : any =  session?.user || {};


     const form = useForm<z.infer<typeof SettingsSchema>>({
      resolver: zodResolver(SettingsSchema),
      defaultValues: {
        name: user?.name || undefined,
        email: user?.email || undefined,
        role: role.role  ,
        isTwoFactorEnabled: role.isTwoFactorEnabled || undefined,
      }
    });

  const [isPending, startTransition] = useTransition();
    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
      startTransition(() => {
        settings(values).then((data) => {
        if (data.error) {
          setError(data.error);
        }

        if (data.success) {
          update();
          setSuccess(data.success);
        }
      })
      .catch(() => setError("Something went wrong!"));
        
      })
    }
  return (
    <Card className=" mt-20 w-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#BBB] to-[#FFF]">
    <CardHeader>
      <p className="text-2xl font-semibold text-center">
        Settings...
      </p>
    </CardHeader>
    <CardContent>
    <Form {...form}>
          <form 
            className="space-y-6" 
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* {user?.isOAuth === false && (
                <> */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="john.doe@example.com"
                            type="email"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  
                {/* </>
              )} */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Role.ADMIN}>
                          Admin
                        </SelectItem>
                        <SelectItem value={Role.USER}>
                          User
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>



                  

               
                  
                )}
              />

              <FormField
                  control={form.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Two Factor Authentication</FormLabel>
                        <FormDescription>
                          Enable two factor authentication for your account
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              disabled={isPending}
              type="submit"
            >
              Save
            </Button>
          </form>
    </Form>
    </CardContent>
    </Card>
  )
}

export default page