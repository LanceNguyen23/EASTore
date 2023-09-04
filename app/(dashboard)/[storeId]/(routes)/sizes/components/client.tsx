"use client";

import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Size, SizeColumns } from "./columns";
import { useStoreModal } from "@/hooks/use-store-modal";

const SizeClient = ({ data }: { data: Size[] }) => {
  const router = useRouter();
  const onLoading = useStoreModal(state => state.onLoading)
  const onFinished = useStoreModal(state => state.onFinished)

  return (
    <div className="flex flex-col gap-3">
      <Heading
        title={`Sizes (${data.length})`}
        desc="Manage sizes for your store"
        needButton
        onClick={() => {
          onLoading
          router.push(`sizes/new`);
          onFinished
        }}
      />
      <Separator />

      <DataTable
        columns={SizeColumns}
        data={data}
        filter="name"
      />
    </div>
  );
};

export default SizeClient;
