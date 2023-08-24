"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import Modal from "../ui/modal";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  storeName: z.string().min(1, {
    message: "Store name must be at least 2 characters.",
  }),
});

const StoreModal = () => {
  const storeModal = useStoreModal();

  const router = useRouter();

  // Define the form by useForm
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeName: "",
    },
  });

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        body: JSON.stringify({
          storeName: values.storeName,
        })
      })

      const data = await response.json()
      
      window.location.assign(`/${data.id}`)
    } catch (error) {
      toast.error("Something went wrong!")
      console.log(error)
    } finally {
    }

  };

  return (
    <Modal
      title="Create store"
      desc="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store name</FormLabel>
                <FormControl>
                  <Input placeholder="EASTore" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant='outline' onClick={() => storeModal.onClose()}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default StoreModal;
