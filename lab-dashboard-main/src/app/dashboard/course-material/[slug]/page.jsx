"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const [data, setData] = React.useState([]);
  const { slug } = useParams();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  React.useEffect(() => {
    const fetchMachineForms = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/courseMaterials/product/${slug}`
        );
        const result = await response.json();
      
        if (result.success) {
          setData(result.data?.driveLinks || []);
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
        className="w-full flex flex-col gap-12 max-w-5xl"
      >
        {data?.length > 0 ? (
          data?.map((val, index) => {
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
                    Learning Objective {val.index}
                  </span>
                </AccordionTrigger>

                <AccordionContent className=" py-3">
                  <div className="flex flex-wrap gap-4 w-full">
                    {val.map((pdf, index) => (
                      <div
                        key={index}
                        className="w-full md:w-[23%] border p-4 shadow-lg rounded-lg flex flex-col items-start"
                      >
                        <h3 className="text-lg font-semibold mb-2">
                          File {index + 1}
                        </h3>
                        <div className="flex w-full gap-2">
                          <a
                            href={pdf.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-gray-500  cursor-pointer text-center flex-1 text-gray-500  px-4 py-2 rounded hover:bg-gray-600 hover:text-white transition"
                          >
                            Read
                          </a>
                          <a
                            href={pdf.link}
                            target="_blank"
                            download
                            className="bg-gray-500 text-center cursor-pointer  flex-1 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })
        ) : (
          <h2 className="text-2xl font-bold">No Data Found</h2>
        )}
      </Accordion>
    </div>
  );
};

export default page;
