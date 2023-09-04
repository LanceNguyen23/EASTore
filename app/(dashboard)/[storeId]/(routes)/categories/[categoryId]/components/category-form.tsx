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
import { BillBoard, Category } from "@prisma/client";
import { useState } from "react";
import { Trash } from "lucide-react";
import AlertModal from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 characters.",
  }),
  billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

const CategoryForm = ({
  categories,
  billboards,
}: {
  categories: Category | null;
  billboards: BillBoard[];
}) => {
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: categories || {
      name: "",
      billboardId: "",
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setLoading(true);
      if (!categories) {
        const response = await fetch(`/api/${params.storeId}/categories`, {
          method: "POST",
          body: JSON.stringify({
            name: values.name,
            billboardId: values.billboardId,
          }),
        });
        if (!response.ok) {
          throw new Error("Error post category", { cause: response });
        }
        toast.success("Category created!!! 🎉🎉");
      } else {
        const response = await fetch(
          `/api/${params.storeId}/categories/${params.categoryId}/`,
          {
            method: "PATCH",
            body: JSON.stringify({
              name: values.name,
              billboardId: values.billboardId,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Error patch category", { cause: response });
        }
        toast.success("Category edited!!! 🎉🎉");
      }
      router.push(`/${params.storeId}/categories`);
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
        `/api/${params.storeId}/categories/${params.categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching category", { cause: response });
      }

      router.push(`/${params.storeId}/categories/`);
      setIsOpen(false);
      toast.success("Category deleted!!! 🎉🎉");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
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
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-semibold">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Category name"
                      {...field}
                      className="max-w-sm"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {categories ? (
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
            name="billboardId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Billboard</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value === "" ? undefined : field.value}
                  defaultValue={field.value === "" ? undefined : field.value}
                >
                  <FormControl>
                    <SelectTrigger className="max-w-sm">
                      <SelectValue
                        placeholder="Select a billboard"
                        defaultValue={field.value}
                      />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="max-h-[180px]">
                    {billboards.map((billboard) => {
                      return(
                      <SelectItem value={billboard.id} key={billboard.id}>
                        {billboard.label}
                      </SelectItem>
                    )})}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mr-3" disabled={loading}>
            {categories ? "Edit" : "Create"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${params.storeId}/categories`)}
            disabled={loading}
          >
            Cancel
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CategoryForm;
