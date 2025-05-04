"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

const Examform = ({ useData }) => {
  console.log(useData);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [user, setUser] = useState(null);
  const [examDate, setExamDate] = useState("");
  const [address, setAddress] = useState("");
  const { slug } = useParams();

  const today = new Date();
  const maxDate = React.useMemo(() => {
    if (!useData?.purchaseDate || !useData?.accessPeriod) return null;

    const purchaseDate = new Date(useData.purchaseDate);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(
      expiryDate.getDate() + parseInt(useData.accessPeriod, 10)
    );

    return expiryDate;
  }, [useData]);

  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    if (parsedUser) {
      setUser(parsedUser);
    }
  }, []);

  const handleSave = async () => {
    const data = {
      name: user ? user.name : "demo_name",
      date: examDate,
      address: address,
      productId: slug,
    };
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    console.log("Stored User:", storedUser);
    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser?.id;
    if (!userId) return;
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/exam/${userId}`,
        data
      );
      toast.success(response.data?.message);
    } catch (error) {
      console.error(
        "Submission failed:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-4">Exam Details</h1>

      <div className="mb-4 space-y-4">
        {/* Address Dropdown */}
        <div>
          <label
            htmlFor="address"
            className="font-semibold text-gray-700 block mb-1"
          >
            Address
          </label>
          <select
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="p-2 w-52 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          >
            <option value="">Select address</option>
            <option value="delhi">Delhi</option>
            <option value="jaipur">Jaipur</option>
          </select>
        </div>

        {/* Date Picker */}
        <div>
          <label htmlFor="examDate" className="block text-sm font-medium mb-1">
            Select Exam Date
          </label>
          <input
            type="date"
            id="examDate"
            name="examDate"
            className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
            value={examDate}
            min={formatDate(today)}
            max={maxDate ? formatDate(maxDate) : undefined}
            onChange={(e) => setExamDate(e.target.value)}
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        disabled={!examDate || !address}
        onClick={handleSave}
        className="bg-customgreen w-32 text-white hover:bg-green-600 p-2 font-bold rounded-sm"
      >
        Setup Exam Lab
      </Button>
    </div>
  );
};

export default Examform;
