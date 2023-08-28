"use client";

import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Billboard, BillboardColumns } from "./columns";
import { useStoreModal } from "@/hooks/use-store-modal";

const BillboardClient = ({ data }: { data: Billboard[] }) => {
  const router = useRouter();
  const onLoading = useStoreModal(state => state.onLoading)
  const onFinished = useStoreModal(state => state.onFinished)

  return (
    <div className="flex flex-col gap-3">
      <Heading
        title={`Billboards (${data.length})`}
        desc="Manage billboards for your store"
        needButton
        onClick={() => {
          onLoading
          router.push(`billboards/new`);
          onFinished
        }}
      />
      <Separator />

      <DataTable
        columns={BillboardColumns}
        data={data}
        filter="label"
      />
    </div>
  );
};

export default BillboardClient;
