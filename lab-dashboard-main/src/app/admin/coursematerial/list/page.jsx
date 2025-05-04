"use client";
import Breadcrubs from "@/components/admin/breadcrubs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icon } from "@iconify/react";
import Link from "next/link";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const [data, setData] = useState([]);
  const { slug } = useParams();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  React.useEffect(() => {
    fetchMachineForms();
  }, [API_BASE_URL]);

  const fetchMachineForms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/courseMaterials`);
      const result = await response.json();

      if (result.success) {
        setData(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching machine forms:", error);
    }
  };

  const handlDelete = async (id) => {
    // Confirm before deletion
    if (!window.confirm("Are you sure you want to delete this material?")) {
      return;
    }

    const url = `${API_BASE_URL}/api/v1/courseMaterials/product/${id}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Course Material Deleted successfully!");
        fetchMachineForms();
      } else {
        console.error("Error response:", result);
        toast.error("Failed to Delete Course Material");
      }
    } catch (error) {
      console.error("Error Delete Course Material:", error.message);
      toast.error("An error occurred while Delete Course Material.");
    }
  };

  return (
    <div>
      <Breadcrubs title="All Course Material" />
      <div className="flex flex-col gap-10 justify-between">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Course Materials</h2>
          <Link href="add" className="bg-green-600 text-white px-4 py-2 rounded">
            Add New Material
          </Link>
        </div>

        {data.length === 0 ? (
          <div className="text-center py-10 border rounded-lg">
            <p className="text-lg text-gray-500">No course materials found</p>
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            className="w-full flex flex-col gap-16 max-w-5xl"
          >
            {data.map((val, index) => (
              <AccordionItem
                key={val._id}
                value={`item-${index + 1}`}
                className="border-0"
              >
                <div className="flex justify-end items-center gap-2">
                  <button
                    className="border p-2"
                    onClick={() => handlDelete(val?.product)}
                  >
                    <Icon icon="mi:delete" width="24" height="24" />
                  </button>
                  <Link className="border p-2" href={`add?id=${val.product}`}>
                    <Icon icon="cuida:edit-outline" width="24" height="24" />
                  </Link>
                </div>
                <AccordionTrigger className="relative group font-semibold px-2 border-b-2 border-b-cyan-500 overflow-hidden bg-white">
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-lime-200 transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"></span>
                  <span className="relative z-10">{val.productTitle}</span>
                </AccordionTrigger>
                <AccordionContent className="py-3">
                  <div className="flex flex-col gap-4 w-full">
                    {val.driveLinks?.map((video, index) => {
                      return (
                        <div className="index" key={index}>
                          <div className="text-2xl font-bold">
                            Learning Objective {index + 1}
                          </div>

                          <div className="flex flex-wrap gap-4 w-full">
                            {video.map((pdf, index) => (
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
                                    className="border border-gray-500 cursor-pointer text-center flex-1 text-gray-500 px-4 py-2 rounded hover:bg-gray-600 hover:text-white transition"
                                  >
                                    Read
                                  </a>
                                  <a
                                    href={pdf.link}
                                    target="_blank"
                                    download
                                    className="bg-gray-500 text-center cursor-pointer flex-1 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                                  >
                                    Download
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default page;