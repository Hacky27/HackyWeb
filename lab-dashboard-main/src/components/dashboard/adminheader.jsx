'use client';

import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardHeader = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    if (parsedUser) {
      setUser(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <header className="bg-customDark p-4 py-4 flex justify-between shadow-md">
      <h1 className="text-xl text-white m-auto font-semibold">
        Attacking and Defending Active Directory Lab (CRTP)
      </h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex gap-3 cursor-pointer items-center mr-10">
            <div className="bg-white flex items-center justify-center h-8 w-8 m-auto rounded-full">
              <Icon icon="tdesign:user-filled" width="24" height="24" />
            </div>
            <div className="text-white text-sm">
              <p>{user?.name || "User"}</p>
              <p>{user?.email || "user@example.com"}</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default DashboardHeader;
