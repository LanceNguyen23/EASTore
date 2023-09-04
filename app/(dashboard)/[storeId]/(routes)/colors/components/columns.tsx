"use client";

import { ColumnDef } from "@tanstack/react-table";
import Actions from "./actions";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Color = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const ColorColumns: ColumnDef<Color>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-2 items-center ">
          <div className="w-[35px] h-[30px] rounded-sm flex items-center justify-center bg-[#f0f0f0]">
            <div
              className="w-8 h-6 rounded-sm"
              style={{ backgroundColor: row.original.value }}
            />
          </div>
          <p>{row.original.value}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => <Actions data={row.original} />,
  },
];
