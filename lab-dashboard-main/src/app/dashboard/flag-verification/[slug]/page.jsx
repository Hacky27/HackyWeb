"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

// Completely isolated input component to prevent re-renders from affecting focus
const IsolatedInput = React.memo(
  ({ formId, initialValue, onSave, placeholder }) => {
    // Use internal state only, completely detached from parent re-renders
    const [value, setValue] = React.useState(initialValue || "");
    const inputRef = React.useRef(null);

    // Only update from props on mount or when formId changes
    React.useEffect(() => {
      setValue(initialValue || "");
    }, [formId, initialValue]);

    const handleChange = (e) => {
      const newValue = e.target.value;
      setValue(newValue);
      // Update parent state without triggering re-renders that affect this component
      onSave(formId, newValue);
    };

    // Use a proper ref callback instead of useEffect for focus management
    const setInputRef = (element) => {
      inputRef.current = element;

      // When the ref is attached or updated, focus the input
      if (element && document.activeElement !== element) {
        const cursorPosition = element.selectionStart;
        element.focus();
        if (cursorPosition !== undefined) {
          element.setSelectionRange(cursorPosition, cursorPosition);
        }
      }
    };

    return (
      <Input
        ref={setInputRef}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="max-w-sm"
      />
    );
  }
);

// Prevent unnecessary re-renders
IsolatedInput.displayName = "IsolatedInput";

const Page = () => {
  const [machineFormsData, setMachineFormsData] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);
  const [userId, setUserId] = React.useState(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Use a ref for answer inputs to avoid re-renders when typing
  const answerInputsRef = React.useRef({});

  const { slug } = useParams();

  // Get user ID from localStorage
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    const id = parsedUser?.id;
    setUserId(id);
  }, []);

  // Fetch machine forms for this product
  React.useEffect(() => {
    const fetchMachineForms = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/machineForms/product/${slug}`
        );
        const result = await response.json();

        if (result.success) {
          setMachineFormsData(result.data);
        }
      } catch (error) {
        console.error("Error fetching machine forms:", error);
      }
    };

    if (slug) {
      fetchMachineForms();
    }
  }, [API_BASE_URL, slug]);

  // Transform initial data into table data
  React.useEffect(() => {
    if (!userId || !machineFormsData.length) return;

    // Initialize answer inputs in ref (without re-renders)
    machineFormsData.forEach((form) => {
      const userAnswer = form.answers?.find(
        (answer) => answer.userId === userId
      );
      answerInputsRef.current[form._id] = userAnswer?.answer || "";
    });

    setTableData(
      machineFormsData.map((form) => {
        const userAnswer = form.answers?.find(
          (answer) => answer.userId === userId
        );

        return {
          ...form,
          userAnswer: userAnswer?.answer || "",
          hasAnswered: !!userAnswer,
          formId: form._id,
        };
      })
    );
  }, [machineFormsData, userId]);

  // Update input value in ref without triggering re-renders
  const handleAnswerChange = React.useCallback((formId, value) => {
    answerInputsRef.current[formId] = value;
  }, []);

  // Submit answer
  const submitAnswer = React.useCallback(
    async (formId) => {
      try {
        const answer = answerInputsRef.current[formId];
        if (!answer) {
          toast.error("please fill answer");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/v1/machineForms/${formId}/answer`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              answer,
            }),
          }
        );

        const result = await response.json();

        if (result.success) {
          // Update table data to show the answer is submitted
          setTableData((prev) =>
            prev.map((item) =>
              item.formId === formId
                ? { ...item, hasAnswered: true, userAnswer: answer }
                : item
            )
          );
        } else {
          console.error("Error submitting answer:", result.message);
        }
      } catch (error) {
        console.error("Error submitting answer:", error);
      }
    },
    [API_BASE_URL, userId]
  );

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "Sr. No.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
      },
      {
        accessorKey: "machine",
        header: "Machine",
        cell: ({ row }) => <div>{row.getValue("machine")}</div>,
      },
      {
        accessorKey: "flag",
        header: "Flag",
        cell: ({ row }) => <div>{row.getValue("flag")}</div>,
      },
      {
        accessorKey: "userAnswer",
        header: "Answer",
        cell: ({ row }) => {
          const formId = row.original.formId;
          const isCorrect = row.original.userAnswer === row.original.value;
          const showInput =
            !row.original.hasAnswered ||
            (row.original.hasAnswered && !isCorrect);

          return (
            <div className="flex flex-col gap-1">
              {row.original.hasAnswered && (
                <div
                  className={`font-medium ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {row.original.userAnswer}
                </div>
              )}

              {showInput && (
                <IsolatedInput
                  key={`input-${formId}`}
                  formId={formId}
                  initialValue={row.original.userAnswer}
                  placeholder={
                    row.original.hasAnswered
                      ? "Correct your answer"
                      : "Enter your answer"
                  }
                  onSave={handleAnswerChange}
                />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const formId = row.original.formId;
          const isCorrect = row.original.userAnswer === row.original.value;

          return row.original.hasAnswered ? (
            <div className="flex flex-col gap-1">
              {isCorrect ? (
                <div className="text-green-600 font-semibold">Verified</div>
              ) : (
                <>
                  <div className="text-red-600 font-semibold">Not Verified</div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 mt-1"
                    onClick={() => submitAnswer(formId)}
                   
                  >
                    Re-verify
                  </Button>
                </>
              )}
            </div>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => submitAnswer(formId)}
             
            >
              Verify
            </Button>
          );
        },
      },
    ],
    [handleAnswerChange, submitAnswer]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <h2 className="font-semibold text-lg mb-10">Machine Form Answers</h2>
      <div className="rounded-md border">
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
            {table.getRowModel().rows.length ? (
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
                <TableCell colSpan={columns.length} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Page;
