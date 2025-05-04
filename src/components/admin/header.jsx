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

const AdminHeader = () => {
  return (
    <header className="bg-customDark p-4 py-4 flex justify-end shadow-md">
      <h1 className="text-xl text-customgreen m-auto font-semibold">
        Admin Dashboard
      </h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex gap-3 cursor-pointer items-center mr-10">
            <div className="bg-customgreen flex items-center justify-center  h-8 w-8 m-auto rounded-full">
              <Icon icon="tdesign:user-filled" width="24" height="24" />
            </div>
            <div className="text-white text-sm">
              <p>Gaurav Kumar</p>
              <p>Admin</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem>
            <LogOut />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default AdminHeader;
