"use client";
import Examform from "@/components/dashboard/examform";
import InstructionCardList from "@/components/dashboard/instructions";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const page = () => {
  const [useData, setUseData] = useState({});
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    console.log(lastSegment);
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
        console.log("User Purchases:", res?.data?.data?.purchasedItems);
        const matchedItem = res?.data?.data?.purchasedItems?.find(
          (item) => item?.product === lastSegment
        );

        // Set it or handle if not found
        if (matchedItem) {
          setUseData(matchedItem);
        } else {
          setUseData(null); // or handle accordingly
        }
       
      } catch (error) {
        console.error("Failed to fetch user purchases:", error);
      }
    };

    fetchUserPurchases();
  }, []);
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
      <div className="p-2 rounded-lg  max-w-5xl">
        <div className="flex mb-20 justify-between">
          <div>
            <div className="w-64 p-3 pr-4 border-t-2 border-yellow-500  bg-white flex gap-2 font-semibold">
              <div className="bg-yellow-500 rounded-full w-8 h-8 p-1">
                <Icon icon="ph:speaker-high-bold" width="24" height="24" />
              </div>
              <div className="text-yellow-500 flex  flex-col gap-2">
                <p className="underline">Exam Attempt Expiration Date</p>
                <p> {accessExpiryDate}</p>
              </div>
            </div>
          </div>
          <Image
            width={200}
            height={100}
            src="/crtf.png"
            alt="Logo"
            className="h-[120px] ml-3 w-[130px]"
          />
          <div className="flex flex-col gap-4 p-4 ">
            <Examform useData={useData}/>
          </div>
        </div>
        <hr className="border-2 mt-2 border-black" />
        <ul className="space-y-4 text-gray-800">
          <li className="font-semibold">
            Please send the exam report (only in PDF format) within 48 hours of
            completion of the exam to{" "}
            <a
              className="text-customgreen  underline"
              href="mailto:admin@hackysecurity.com"
            >
              admin@hackysecurity.com
            </a>
            .
          </li>

          <li>
            <strong>Important information about the exam:</strong>
          </li>

          <li>
            The exam is a 24-hour completely hands-on experience. Once started,
            the exam lab runs for 25 hours. You get an additional hour to
            compensate for the lab setup time of 10-15 minutes.
          </li>

          <li>
            The <strong>End Exam button</strong> will destroy the exam lab. The
            lab cannot be recovered after that and your one and only exam
            attempt will be recorded as availed.
          </li>

          <li>
            The exam lab has 5 target servers which are spread across domains
            and have different configurations and applications running on them.
            You get access to a VM named 'user' in the lab and that doesn't
            count as a target server.
          </li>

          <li>You can reboot individual VMs in the exam.</li>

          <li>
            The goal of the exam lab is to get OS command execution on all the
            target servers, not necessarily with administrative privileges.
          </li>

          <li>
            Please note that there is no need for any type of brute-force attack
            which involves using a dictionary.
          </li>

          <li>
            You must submit a detailed report within 48 hours of your exam lab
            time expiry. Ideally, you should spend about 18 hours on the lab and
            6 hours on reporting. Please note that the Lab access is only for 24
            hours.
          </li>

          <li>
            The report must contain a detailed walk-through of your approach to
            compromise a box with screenshots, tools used, and their outputs.
            You are free to use any tool you want, but you need to explain what
            a particular command does and no auto-generated reports will be
            accepted.
          </li>

          <li>
            Unlike the practice labs, no tools will be available on the exam VM.
            You can upload tools using the web access or RDP. Please do not try
            to upload the whole Tools.zip from the course. Only upload the tools
            you need.
          </li>
        </ul>
      </div>
      {/* <InstructionCardList />   */}
    </div>
  );
};

export default page;
