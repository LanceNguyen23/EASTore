"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Store name must be at least 1 characters.",
  }),
  password: z.string().min(1, {
    message: "Store name must be at least 1 characters.",
  }),
});

type LoginFormValues = z.infer<typeof formSchema>;

const LoginPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  // Define the form by useForm
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Submit the form login
  const onSubmit = async (data: LoginFormValues) => {
    const result = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if(result?.error) {
      setError("Invalid email or password! 😟😟")
    }
    else {
      router.push("/")
    }
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-violet-700 to-fuchsia-700">
      <div className="bg-white px-10 py-6 rounded-md shadow-lg">
        <p className="text-4xl font-semibold mb-6">Sign In 🛒</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel className="font-semibold">Username</FormLabel>
                    <FormControl onChange={() => setError("")}>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel className="font-semibold">Password</FormLabel>
                    <FormControl onChange={() => setError("")}>
                      <Input type="password" className="min-w-[350px]" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full mt-5">
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
