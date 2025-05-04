"use client";
import { DropdownMenuDemo } from "@/components/dashboard/learingdropdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icon } from "@iconify/react";
import Image from "next/image"; // Added Image import
import { useParams } from "next/navigation";

import React, { useEffect, useState } from "react";
import { CodeBlock, dracula } from "react-code-blocks";

const page = () => {
  const [data, setData] = useState([]);
  const { slug } = useParams(); // Assuming your route is "/product/:slug"

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    fetchlabManuals();
  }, []);
  const fetchlabManuals = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/labManuals/product/${slug}`
      );
      const result = await response.json();
      const apidata = result.data;

      if (result.success) {
        setData(apidata);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="flex flex-col gap-10 justify-between">
      <div className="absolute right-10 ">
        <DropdownMenuDemo taskData={data[0]?.tasks} />{" "}
      </div>
      <div className=" border shadow-lg w-full max-w-5xl">
        <h2 className=" p-5  bg-[#B66BA3] font-semibold text-gray-200 mb-4 w-full">
          Lab instructions
        </h2>

        <ul className="text-gray-900 list-disc p-4 pl-10">
          {data?.length > 0
            ? data[0]?.labInstructions.map((val, index) => <li key={`${val}${index}`}>{val}</li>)
            : "No Data Available"}

          {/* <CodeBlock
            language="jsx"
            text={`v := Vertex{X: 1, Y: 2}`}
            theme={dracula}
            showLineNumbers={false}
          /> */}
        </ul>
      </div>

      <div className="w-full flex flex-col gap-12 max-w-5xl">
        {data?.length > 0
          ? data[0]?.tasks.map((val, index) => {
            return (
              <Accordion
                key={val._id}
                type="single"
                collapsible
                id={val._id}
              >
                <AccordionItem value="item-1" className="border-0 ">
                  <AccordionTrigger className="relative group font-semibold px-2 border-b-2 border-b-cyan-500 overflow-hidden bg-white">
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-lime-200 transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"></span>
                    <span className="relative z-10">
                      Learning Objective {index + 1}
                    </span>
                  </AccordionTrigger>

                  <AccordionContent className=" py-3">
                    <div className=" border shadow-lg w-full ">
                      <h2 className=" p-3  bg-[#B66BA3] font-semibold text-gray-200 mb-4 w-full">
                        Task
                      </h2>

                      <ul className="text-gray-900 list-disc p-4 pl-10">
                        {val.task.map((taskin, index) => (
                          <li key={`${taskin}${index}`}>{taskin}</li>
                        ))}{" "}
                      </ul>

                      {/* Conditionally render image if imageurl exists */}
                      {val.imageurl && (
                        <div className="p-4 flex justify-center">
                          <Image
                            src={val.imageurl}
                            alt="Task visualization"
                            width={600}
                            height={400}
                            className="rounded-md shadow-md object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex  gap-2 mt-4 items-start bg-gray-50 p-4 border-t-2 border-cyan-700  shadow-sm">
                      <div className="">
                        <Icon
                          icon="akar-icons:info-fill"
                          width="18"
                          height="18"
                          className="text-gray-500"
                        />
                      </div>
                      <div className="flex-col">
                        <p className="font-semibold ">Solution</p>
                        <p className="text-gray-800 text-sm">
                          {val?.solution}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })
          : "No Data Available"}
      </div>
    </div>
  );
};

export default page;