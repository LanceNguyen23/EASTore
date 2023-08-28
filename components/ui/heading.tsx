'use client'

import { Plus } from "lucide-react";
import { Button } from "./button";
import { useStoreModal } from "@/hooks/use-store-modal";

const Heading = ({
  title,
  desc,
  needButton = false,
  onClick,
}: {
  title: string;
  desc: string;
  needButton?: boolean;
  onClick?: () => void;
}) => {
  const loading = useStoreModal(state => state.isLoading)
  return (
    <div className="flex flex-row justify-between">
      <div className="">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      {needButton ? (
        <Button onClick={onClick} disabled={loading}>
          <Plus size={16} className="mr-1" />
          Add New
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Heading;
