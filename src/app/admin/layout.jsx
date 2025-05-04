"use client";

import AdminHeader from "@/components/admin/header";
import AdminSidebar from "@/components/admin/sidebar";
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 max-h-screen overflow-scroll scrollbar-hide flex flex-col">
        <AdminHeader />
        <main className="p-6 bg-gray-100 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
