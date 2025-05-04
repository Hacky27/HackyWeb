"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const page = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [user, setUser] = useState(null);
  const [examDate, setExamDate] = useState("");
 
  const today = new Date();
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(today.getMonth() + 3);

  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    if (parsedUser) {
      setUser(parsedUser);
    }
  }, []);
  const handleSave = async () => {
    // You can call your API here to save the date
    const data = {
      name: user ? user.name : "demo_name",
      date: examDate,
    };
    try {
      // Make API request
      const response = await axios.post(`${API_BASE_URL}/api/v1/exam`, data);
      // Handle successful response
      toast.success(response.data?.message);
    } catch (error) {
      // Handle error
      console.error(
        "Submission failed:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-4">Exam Details</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="examDate">
          Select Exam Date
        </label>
        <input
          type="date"
          id="examDate"
          name="examDate"
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
          value={examDate}
          min={formatDate(today)}
          max={formatDate(threeMonthsLater)}
          onChange={(e) => setExamDate(e.target.value)}
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={!examDate}
      >
        Save
      </button>
    </div>
  );
};

export default page;
