"use client";
import InstructionCardList from "@/components/dashboard/instructions";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

const page = () => {
  const [useData, setUseData] = useState({});
  const [regions, setRegions] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    const fetchUserPurchases = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      console.log("Stored User:", storedUser);
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser?.id;

      if (!userId) return;

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/checkout/users/purchases/${userId}`
        );
        setRegions(res?.data?.data?.region);
        console.log("User Purchases:", res?.data?.data?.purchasedItems[0]);
        setUseData(res?.data?.data?.purchasedItems[0]); // adjust depending on response structure
      } catch (error) {
        console.error("Failed to fetch user purchases:", error);
      }
    };

    fetchUserPurchases();
  }, []);
  function formatDateToDayAndDate(isoString) {
    const date = new Date(isoString);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  }

  // Example usage:
  const formatted = formatDateToDayAndDate("2025-04-25T09:41:07.526Z");
  console.log(formatted); // "Friday, April 25, 2025"
  const accessExpiryDate = useMemo(() => {
    if (!useData?.purchaseDate || !useData?.accessPeriod) return null;

    const purchaseDate = new Date(useData.purchaseDate);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(purchaseDate.getDate() + Number(useData.accessPeriod));

    return expiryDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [useData]);
  return (
    <div className="flex justify-between">
      <div className="p-2 rounded-lg  max-w-6xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Lab Subscription Details
        </h2>
        <hr className="border-t-2 border-customgreen   mb-4" />
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm mb-2 text-gray-600">
              Subscription Start Time
            </p>
            <div className="bg-customDark p-2 rounded-md text-gray-100">
              {formatDateToDayAndDate(useData?.purchaseDate)}
            </div>
          </div>
          <div>
            <p className="text-sm mb-2 text-gray-600">Subscription End Time</p>
            <div className="bg-customDark p-2 rounded-md text-gray-100">
              {accessExpiryDate}
            </div>
          </div>
          <div>
            <p className="text-sm mb-2 text-gray-600">
              Last Date to Attempt the Exam
            </p>
            <div className="bg-customDark p-2 rounded-md text-gray-100">
              {accessExpiryDate}
            </div>
          </div>
          <div>
            <p className="text-sm mb-2 text-gray-600">Region</p>
            <div className="bg-customDark p-2 rounded-md text-gray-100">
              {regions ? regions : "Not Yet Chosen"}
            </div>
          </div>
        </div>
      </div>
      {/* <InstructionCardList /> */}
    </div>
  );
};

export default page;
