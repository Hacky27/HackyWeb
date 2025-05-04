"use client";
import { DropdownMenuDemo } from "@/components/dashboard/learingdropdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  // const data = [
  //   { index: "01", value: "Value 1" },
  //   { index: "02", value: "Value 2" },
  //   { index: "03", value: "Value 3" },
  //   { index: "04", value: "Value 4" },
  //   { index: "05", value: "Value 5" },
  //   { index: "06", value: "Value 6" },
  //   { index: "07", value: "Value 7" },
  //   { index: "08", value: "Value 8" },
  //   { index: "09", value: "Value 9" },
  //   { index: "10", value: "Value 10" },
  // ];
  const [data, setData] = React.useState([]);
  const { slug } = useParams();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  React.useEffect(() => {
    const fetchMachineForms = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/courseVideos/product/${slug}`
        );
        const result = await response.json();
      
        if (result.success) {
          setData(result.data.groups || []);
        }
      } catch (error) {
        console.error("Error fetching machine forms:", error);
      }
    };

    fetchMachineForms();
  }, [API_BASE_URL]);

  return (
    <div className="flex flex-col gap-10 justify-between">
      <Accordion
        type="single"
        collapsible
        className="w-full flex flex-col gap-16 max-w-5xl"
      >
        {data.map((val, index) => {
          return (
            <AccordionItem
              key={index}
              value={`item-${index + 1}`}
              className="border-0 "
              id={index}
            >
              <AccordionTrigger className="relative group font-semibold px-2 border-b-2 border-b-cyan-500 overflow-hidden bg-white">
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-lime-200 transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"></span>
                <span className="relative z-10">
                  Learning Objective {index+1}
                </span>
              </AccordionTrigger>
              <p className="relative z-10">{val.description}</p>
              <AccordionContent className=" py-3">
                <div className="flex flex-wrap gap-4  w-full ">
                  {val?.iframes?.map((video, index) => (
                    <div
                      key={index}
                      dangerouslySetInnerHTML={{ __html: video?.iframe }}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default page;
