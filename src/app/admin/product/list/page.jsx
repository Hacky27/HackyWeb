"use client";

import * as React from "react";
import {
  createColumnHelper,
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Icon } from "@iconify/react";
import Link from "next/link";
import toast from "react-hot-toast";
import Breadcrubs from "@/components/admin/breadcrubs";

const page = () => {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  React.useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/products`);
      const result = await response.json();


      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleDeleteProduct = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    if (result.success) {
      toast.success(result.message);
      fetchProducts();
    }
  };
  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "_id",
      header: "ID",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("_id")}</div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("category")}</div>
      ),
    },
    {
      accessorKey: "prices",
      header: "Prices",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("prices")}</div>
      ),
    },
    {
      accessorKey: "bootcampAvailability",
      header: "Bootcamp Availability",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("bootcampAvailability")}</div>
      ),
    },

    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                (location.href = `/admin/product/add?id=${row.getValue("_id")}`)
              }
              className="underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteProduct(row.getValue("_id"))}
              className="text-red-600 underline ml-2"
            >
              Delete
            </button>{" "}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <Breadcrubs title="All Product" />
      <div className="flex items-center justify-end gap-3  py-4">
        <div className="p-2 bg-white flex items-center min-w-[352px] space-x-2 rounded-3xl ">
          <Icon
            className="text-gray-500"
            icon="mynaui:search"
            width="24"
            height="24"
          />
          <input
            type="text"
            placeholder="Filter Title..."
            value={table.getColumn("title")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className=" w-full outline-none"
          />
        </div>
        <Link
          href="add"
          className="bg-custom-blue rounded-xl text-white flex p-2 bg-[#82849a] hover:bg-[#3b3c46]"
        >
          <Icon icon="basil:plus-outline" width="24" height="24" />
          Add New
        </Link>
      </div>
      <div className="rounded-md border ">
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
export default page;
