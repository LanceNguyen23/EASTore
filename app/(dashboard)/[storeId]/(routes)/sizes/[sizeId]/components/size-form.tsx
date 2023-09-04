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
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Size } from "@prisma/client";
import { useState } from "react";
import { Trash } from "lucide-react";
import AlertModal from "@/components/modals/alert-modal";

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;

const SizeForm = ({ data }: { data: Size | null }) => {
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (values: SizeFormValues) => {
    try {
      setLoading(true);
      if (!data) {
        const response = await fetch(`/api/${params.storeId}/sizes`, {
          method: "POST",
          body: JSON.stringify({
            name: values.name,
            value: values.value,
          }),
        });
        if (!response.ok) {
          throw new Error("Error post size", { cause: response });
        }
        toast.success("Size created!!! 🎉🎉");
      } else {
        const response = await fetch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              name: values.name,
              value: values.value,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Error patch size", { cause: response });
        }
        toast.success("Size edited!!! 🎉🎉");
      }
      router.push(`/${params.storeId}/sizes`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/${params.storeId}/sizes/${params.sizeId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching size", { cause: response });
      }

      router.push(`/${params.storeId}/sizes/`);
      setIsOpen(false);
      toast.success("Size deleted!!! 🎉🎉");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="flex flex-row justify-between">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-semibold">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Large, Medium, Small, ..."
                      {...field}
                      className="max-w-sm"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {data ? (
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={() => setIsOpen(true)}
              >
                <Trash />
              </Button>
            ) : (
              <></>
            )}
          </div>
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Value</FormLabel>
                <FormControl>
                  <Input
                    placeholder="L, S, M, ..."
                    {...field}
                    className="max-w-sm"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mr-3" disabled={loading}>
            {data ? "Edit" : "Create"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${params.storeId}/sizes`)}
            disabled={loading}
          >
            Cancel
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SizeForm;
