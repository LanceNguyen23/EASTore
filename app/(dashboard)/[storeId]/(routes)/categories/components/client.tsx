"use client";

import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Category, CategoryColumns } from "./columns";
import { useStoreModal } from "@/hooks/use-store-modal";

const CategoryClient = ({ data }: { data: Category[] }) => {
  const router = useRouter();
  const onLoading = useStoreModal(state => state.onLoading)
  const onFinished = useStoreModal(state => state.onFinished)

  return (
    <div className="flex flex-col gap-3">
      <Heading
        title={`Categories (${data.length})`}
        desc="Manage categories for your store"
        needButton
        onClick={() => {
          onLoading
          router.push(`categories/new`);
          onFinished
        }}
      />
      <Separator />

      <DataTable
        columns={CategoryColumns}
        data={data}
        filter="name"
      />
    </div>
  );
};

export default CategoryClient;
