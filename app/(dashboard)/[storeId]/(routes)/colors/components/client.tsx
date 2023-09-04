"use client";

import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Color, ColorColumns } from "./columns";
import { useStoreModal } from "@/hooks/use-store-modal";

const ColorClient = ({ data }: { data: Color[] }) => {
  const router = useRouter();
  const onLoading = useStoreModal(state => state.onLoading)
  const onFinished = useStoreModal(state => state.onFinished)

  return (
    <div className="flex flex-col gap-3">
      <Heading
        title={`Colors (${data.length})`}
        desc="Manage colors for your store"
        needButton
        onClick={() => {
          onLoading
          router.push(`colors/new`);
          onFinished
        }}
      />
      <Separator />

      <DataTable
        columns={ColorColumns}
        data={data}
        filter="name"
      />
    </div>
  );
};

export default ColorClient;
