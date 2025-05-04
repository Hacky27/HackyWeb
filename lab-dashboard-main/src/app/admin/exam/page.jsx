"use client";

import * as React from "react";
import axios from "axios";
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
import { Icon } from "@iconify/react";
import Breadcrubs from "@/components/admin/breadcrubs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const page = () => {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Fetch data from API
  React.useEffect(() => {
    const fetchExams = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/v1/exam`);

        // Transform the API response to match the table structure
        const formattedData = response.data.data.map((exam) => ({
          id: exam._id,
          user_name: exam.name,
          exam_date: new Date(exam.date).toLocaleDateString(),
          address: exam.address, // ✅ Add this line
        }));

        setData(formattedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching exams:", error);
        setError("Failed to fetch exam data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, []);

  const columns = [
    {
      accessorKey: "user_name",
      header: "User Name",
      cell: ({ row }) => <div>{row.getValue("user_name")}</div>,
    },
    {
      accessorKey: "exam_date",
      header: "Exam Date",
      cell: ({ row }) => <div>{row.getValue("exam_date")}</div>,
    },
    {
      accessorKey: "address",
      header: "Location",
      cell: ({ row }) => <div>{row?.getValue("address")}</div>,
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
      <Breadcrubs title="Exam List" />

      {/* Loading and Error States */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <input
                className="border rounded px-3 py-2"
                placeholder="Filter by name..."
                value={table.getColumn("user_name")?.getFilterValue() ?? ""}
                onChange={(e) =>
                  table.getColumn("user_name")?.setFilterValue(e.target.value)
                }
              />
            </div>
            <div className="text-sm text-gray-500">
              Total exams: {data.length}
            </div>
          </div>

          <div className="rounded-md border m-4">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
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
                      className="text-center h-24"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 px-4 py-4">
            <div className="flex-1 text-sm text-gray-500">
              Showing {table.getRowModel().rows.length} of {data.length} results
            </div>
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
        </>
      )}
    </div>
  );
};

export default page;
