"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Icon } from "@iconify/react";
import React from "react";

export function DropdownMenuDemo({ taskData }) {
  const [open, setOpen] = React.useState(false);
 

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-gray-500 w-10 h-10 relative focus:outline-none bg-white">
          <span className="sr-only">Open main menu</span>
          <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span
              aria-hidden="true"
              className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                open ? "rotate-45" : "-translate-y-1.5"
              }`}
            ></span>

            <span
              aria-hidden="true"
              className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                open ? "opacity-0" : ""
              }`}
            ></span>

            <span
              aria-hidden="true"
              className={`block absolute  h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                open ? "-rotate-45" : "translate-y-1.5"
              }`}
            ></span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 rounded-none border-t-2 border-t-customgreen mr-10 ">
        {taskData?.map((val, index) => {
          return (
            <DropdownMenuItem key={index}>
              <Link href={`#${val._id}`}>Learning Objective {index + 1}</Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
