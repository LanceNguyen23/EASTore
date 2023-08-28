"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./input";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useStoreModal } from "@/hooks/use-store-modal";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filter: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filter,
}: DataTableProps<TData, TValue>) {
  const loading = useStoreModal(state => state.isLoading)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },  
    },
    state: {
      columnFilters,
      sorting
    },
  });

  // Pagination
  const currentIndex = table.getState().pagination.pageIndex;
  const count = table.getPageCount();
  // Save max 4 other index around current index
  const pages = [];
  for (let i = -2; i <= 2; i++) {
    const index = currentIndex + i;
    if (index >= 0 && index < count) pages.push(currentIndex + i);
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="relative flex flex-row max-w-sm">
        <Input
          placeholder={`Filter ${filter}...`}
          value={(table.getColumn(filter)?.getFilterValue() as string) ?? ""}
          disabled={loading}
          onChange={(event) =>
            table.getColumn(filter)?.setFilterValue(event.target.value)
          }
        />
        <Search className="absolute right-3 top-3" color="#b9acc8" size={18} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-row justify-end items-center gap-3">
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage() || loading}
          >
            <ChevronFirst size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || loading}
          >
            <ChevronLeft size={16} />
          </Button>
          {pages.map((index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className={cn("h-8 w-8",
                index === currentIndex ? "border-2 border-[#7e42c9]" : ""
              )}
              onClick={() => table.setPageIndex(index)}
              disabled={loading}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || loading}
          >
            <ChevronRight size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage() || loading}
          >
            <ChevronLast size={16} />
          </Button>
        </div>
        <div className="border-r-2 border-[#838184] h-[23px] "></div>
        <div className="flex flex-row items-center">
        <p className="text-sm mr-2">Go to page: </p>

          <Input
            type="number"
            className="h-9 w-14 mr-2 pl-3 pr-1"
            onChange={(e) => table.setPageIndex(Number(e.target.value) - 1)}
          />
          <p className="text-sm">of {table.getPageCount()} pages</p>
        </div>
      </div>
    </div>
  );
}
