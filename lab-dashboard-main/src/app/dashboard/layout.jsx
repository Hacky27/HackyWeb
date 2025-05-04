"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardHeader from "@/components/dashboard/adminheader";
import DashboardSidebar from "@/components/dashboard/dashboardsidebar";

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const checkUser = async () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setLoading(false);
        return;
      }
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const userId = urlParams.get("userId");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (token && userId) {
        try {
          const res = await fetch(
            `${API_BASE_URL}/api/v1/auth/verify?token=${token}&userId=${userId}`
          );
          const data = await res.json();

          if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.user));
            setLoading(false);
            router.replace("/dashboard/home");
          } else {
            alert(data.message || "Verification failed");
            router.push("/");
          }
        } catch (error) {
          console.error("Verification error:", error);
          router.push("/");
        }
      } else {
        // If we don't have token and userId in params and also don't have user in localStorage
        // then redirect to homepage "/"
        router.push("/");
      }
    };

    checkUser();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 max-h-screen overflow-scroll scrollbar-hide flex flex-col">
        <DashboardHeader />
        <main className="p-6 bg-gray-100 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;