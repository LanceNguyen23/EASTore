'use client'

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Category } from "./columns";
import toast from "react-hot-toast";
import AlertModal from "@/components/modals/alert-modal";
import { useState } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";

const Actions = ({ data }: { data: Category }) => {
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false)

  const loading = useStoreModal(state => state.isLoading)
  const onLoading = useStoreModal(state => state.onLoading)
  const onFinished = useStoreModal(state => state.onFinished)

  const onEdit = () => {
    onLoading
    router.push(`/${params.storeId}/categories/${data.id}`);
    onFinished
  };

  const onDelete = async() => {
    try {
      onLoading
      const response = await fetch(`/api/${params.storeId}/categories/${data.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error("Error fetching category", { cause: response });
      }
      setIsOpen(false)
      toast.success("Category deleted!!! 🎉🎉");
      router.refresh();

    } catch (error) {
      toast.error(
        "Something went wrong"
      );
      console.log(error);
    } finally {
      onFinished
    }
  }
  return (
    <div>
      <AlertModal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={onDelete}/>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer" disabled={loading}>
            Edit Category
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)} className="cursor-pointer" disabled={loading}>
            Delete Category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Actions;
