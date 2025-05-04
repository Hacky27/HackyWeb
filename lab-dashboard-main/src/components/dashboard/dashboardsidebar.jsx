import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import React, { useEffect } from "react";
import axios from "axios";
const links = [
  {
    title: "Lab Manual",
    route: "/dashboard/lab-manual",
  },
  {
    title: "Certification Exam",
    route: "/dashboard/certification-exam",
  },
  {
    title: "Flag Verification",
    route: "/dashboard/flag-verification",
  },
  {
    title: "Access Lab Material",
    route: "#",
  },
  {
    title: "Course Videos - GDrive",
    route: "/dashboard/course-video",
  },
  {
    title: "Course Material - GDrive",
    route: "/dashboard/course-material",
  },
  {
    title: "Frequently Asked Questions",
    route: "/dashboard/faqs",
  },
  {
    title: "Discord Link",
    route: "#",
  },
];

const otherlab = [
  "Attacking and Defending Azure AD (CARTP)",
  "Azure Application Security (CAWASP)",
  "AD CS Attacks fo Red and Blue Teams Lab (CESP - ADCS)",
  "Attacking active Directory with Linus",
];
const DashboardSidebar = () => {
  const [data, setData] = React.useState([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


  React.useEffect(() => {
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
        console.log("User Purchases:", res?.data?.data.purchasedItems);
        setData(res?.data?.data?.purchasedItems); // adjust depending on response structure
      } catch (error) {
        console.error("Failed to fetch user purchases:", error);
      }
    };

    fetchUserPurchases();
  }, []);
  return (
    <aside className="w-64 h-screen overflow-scroll bg-customDark  text-white  space-y-6 scrollbar-hide">
      <nav>
        <div className="bg-customDark py-3">
          <Link href="#">
            <Image
              width={200}
              height={100}
              src="/logos1.jpg"
              alt="Logo"
              className="h-[60px]  ml-3"
            />
          </Link>{" "}
        </div>
        <ul className="space-y-2 p-3 font-semibold">
          <li>
            <Link
              href="/dashboard/home"
              className="flex group items-center gap-2 p-2  rounded-xl hover:bg-customgreen transition-all duration-300 ease-in-out"
            >
              <Icon
                className="text-customgreen group-hover:text-white"
                icon="ic:round-home"
                width="28"
              />
              Main Dashboard
            </Link>
          </li>
          <Accordion type="single" collapsible>
            {data.map((val, index) => (
              <AccordionItem
                key={val.product}
                value={`item-${index + 1}`}
                className="border-0 "
              >
                <AccordionTrigger>
                  {" "}
                  <div className="flex font-semibold items-center  gap-2 p-2  rounded-3xl  transition-all duration-300 ease-in-out">
                    <div className="">
                      <Icon
                        icon="weui:setting-filled"
                        className="text-customgreen"
                        width="28"
                      />
                    </div>
                    <div>{val.title} </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className=" rounded-xl p-2">
                  <ul className="px-3">
                    {links.map((link, index) => (
                      <li
                        key={index}
                        className="text-gray-200 text-xs ml-4 mb-3  hover:underline cursor-pointer"
                      >
                        <Link href={`${link.route}/${val.product}`}>
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {/* <li>
            <Link
              href="#"
              className="flex group  items-center gap-2 p-2  rounded-xl hover:bg-customgreen transition-all duration-300 ease-in-out"
            >
              <Icon
                className="text-customgreen group-hover:text-white"
                icon="ant-design:menu-unfold-outlined"
                width="28"
              />
              Bootcamps
            </Link>
          </li> */}
          {/* <li>
            <Link
              href="/dashboard/exam"
              className="flex group  items-center gap-2 p-2  rounded-xl hover:bg-customgreen transition-all duration-300 ease-in-out"
            >
              <Icon
                className="text-customgreen group-hover:text-white"
                icon="healthicons:i-exam-multiple-choice-outline"
                width="28"
              />
              Exam
            </Link>
          </li> */}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
