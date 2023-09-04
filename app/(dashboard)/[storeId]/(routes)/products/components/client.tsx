"use client";

import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Product, ProductColumns } from "./columns";
import { useStoreModal } from "@/hooks/use-store-modal";

const ProductClient = ({ data }: { data: Product[] }) => {
  const router = useRouter();
  const onLoading = useStoreModal(state => state.onLoading)
  const onFinished = useStoreModal(state => state.onFinished)

  return (
    <div className="flex flex-col gap-3">
      <Heading
        title={`Products (${data.length})`}
        desc="Manage products for your store"
        needButton
        onClick={() => {
          onLoading
          router.push(`products/new`);
          onFinished
        }}
      />
      <Separator />

      <DataTable
        columns={ProductColumns}
        data={data}
        filter="name"
      />
    </div>
  );
};

export default ProductClient;
