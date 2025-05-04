"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

export function Signinmodal() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/signin`,
        formData
      );
      // Handle successful response (e.g., show success message, redirect, etc.)
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: "", email: "" });
        setIsLoading(false);
        setOpen(false); // Close the dialog on success
        return;
      }
      toast.error(response.data.message);
      setIsLoading(false);
    } catch (error) {
      console.error("Sign-in failed:", error.response?.data || error.message);
      // Handle error response (e.g., show error message)
      toast.error(error.response?.data?.message || "Sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-white text-black flex items-center gap-1 px-6 py-3 rounded shadow">
          <Icon icon="mdi-light:email" width="24" height="24" />
          <span>Sign In with Email</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In Using Your Registered Email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="custom-input border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Registered Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@gmail.com"
                className="custom-input border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={isLoading}
              type="submit"
              className="bg-[#0DB79F] hover:bg-[#369e90]"
            >
              {isLoading ? "Sending..." : "Send One-Time Sign-In Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}