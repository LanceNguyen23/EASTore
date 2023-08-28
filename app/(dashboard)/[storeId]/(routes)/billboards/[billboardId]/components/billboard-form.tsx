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
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { BillBoard } from "@prisma/client";
import { useState } from "react";
import { Trash } from "lucide-react";
import AlertModal from "@/components/modals/alert-modal";

const formSchema = z.object({
  label: z.string().min(1, {
    message: "Label must be at least 1 characters.",
  }),
  imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm = ({ data }: { data: BillBoard | null }) => {
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (values: BillboardFormValues) => {
    try {
      setLoading(true);
      if (!data) {
        const response = await fetch(`/api/${params.storeId}/billboards`, {
          method: "POST",
          body: JSON.stringify({
            label: values.label,
            imageUrl: values.imageUrl,
          }),
        });
        if (!response.ok) {
          throw new Error("Error post billboard", { cause: response });
        }
        toast.success("Billboard created!!! 🎉🎉");
      } else {
        const response = await fetch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              label: values.label,
              imageUrl: values.imageUrl,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Error patch billboard", { cause: response });
        }
        toast.success("Billboard edited!!! 🎉🎉");
      }
      router.push(`/${params.storeId}/billboards`);
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
        `/api/${params.storeId}/billboards/${params.billboardId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching billboard", { cause: response });
      }

      router.push(`/${params.storeId}/billboards/`);
      setIsOpen(false);
      toast.success("Billboard deleted!!! 🎉🎉");
      router.refresh();
    } catch (error) {
      toast.error(
        "Make sure you removed all categories using this billboard first."
      );
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-row justify-between">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => {
                console.log("FIELD", field);
                return (
                  <FormItem className="">
                    <FormLabel className="font-semibold">
                      Background Image
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value ? [field.value] : []}
                        disabled={loading}
                        onChange={(url) => field.onChange(url)}
                        onRemove={() => field.onChange("")}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            {data ? (
              <Button variant="destructive" size="icon" type="button" onClick={() => setIsOpen(true)} >
                <Trash/>
              </Button>
            ) : (
              <></>
            )}
          </div>
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Label</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Billboard label"
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
            onClick={() => router.push(`/${params.storeId}/billboards`)}
            disabled={loading}
          >
            Cancel
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
