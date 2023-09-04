"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Category, Color, Product, Size, Image } from "@prisma/client";
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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  image: z.object({ url: z.string() }).array(),
  name: z.string().min(1),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  price: z.coerce.number().min(1),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
});

type ProductFormValues = z.infer<typeof formSchema>;

const ProductForm = ({
  data,
  categories,
  sizes,
  colors,
}: {
  data: (Product & { image: Image[] }) | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}) => {
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      image: [],
      name: "",
      categoryId: "",
      sizeId: "",
      colorId: "",
      isFeatured: false,
      isArchived: false,
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setLoading(true);
      if (!data) {
        const response = await fetch(`/api/${params.storeId}/products`, {
          method: "POST",
          body: JSON.stringify({
            image: values.image,
            name: values.name,
            categoryId: values.categoryId,
            sizeId: values.sizeId,
            colorId: values.colorId,
            price: values.price,
            isFeatured: values.isFeatured,
            isArchived: values.isArchived,
          }),
        });
        if (!response.ok) {
          throw new Error("Error post product", { cause: response });
        }
        toast.success("Product created!!! 🎉🎉");
      } else {
        const response = await fetch(
          `/api/${params.storeId}/products/${params.productId}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              name: values.name,
              categoryId: values.categoryId,
              sizeId: values.sizeId,
              image: values.image,
              colorId: values.colorId,
              price: values.price,
              isFeatured: values.isFeatured,
              isArchived: values.isArchived,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Error patch product", { cause: response });
        }
        toast.success("Product edited!!! 🎉🎉");
      }
      router.push(`/${params.storeId}/products`);
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
        `/api/${params.storeId}/products/${params.productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching product", { cause: response });
      }

      router.push(`/${params.storeId}/products/`);
      setIsOpen(false);
      toast.success("Product deleted!!! 🎉🎉");
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-row justify-between">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel className="font-semibold">
                      Product Images
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value.map((image) => {
                          console.log(field);
                          return image.url;
                        })}
                        disabled={loading}
                        onChange={(url) => {
                          return field.onChange([
                            ...field.value,
                            { url: url },
                          ]);
                        }}
                        onRemove={(url) =>
                          field.onChange(
                            field.value.filter(
                              (current) => current.url !== url
                            )
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-semibold">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product name"
                      {...field}
                      className="max-w-sm"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-semibold">Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Product price"
                      {...field}
                      className="max-w-sm"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-semibold">Category</FormLabel>
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
                      {categories.map((category) => {
                        return (
                          <SelectItem value={category.id} key={category.id}>
                            {category.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-semibold">Size</FormLabel>
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
                      {sizes.map((size) => {
                        return (
                          <SelectItem value={size.id} key={size.id}>
                            {size.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-semibold">Color</FormLabel>
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
                      {colors.map((color) => {
                        return (
                          <SelectItem value={color.id} key={color.id}>
                            {color.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className=""></div>
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="max-w-sm border rounded-md flex flex-col justify-center p-3 pt-4">
                  <div className="flex flex-row items-center">
                    <FormControl className="mr-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-semibold">Feature</FormLabel>
                  </div>

                  <FormDescription>
                    This product will appear on the home page
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="max-w-sm border rounded-md flex flex-col justify-center p-3 pt-4">
                  <div className="flex flex-row items-center">
                    <FormControl className="mr-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-semibold">Archived</FormLabel>
                  </div>
                  <FormDescription>
                    This product will not appear anywhere in the store
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4">
            <Button type="submit" className="mr-3" disabled={loading}>
              {data ? "Edit" : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${params.storeId}/products`)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
