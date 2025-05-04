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
import React from "react";
import toast from "react-hot-toast";

const page = () => {
  const [data, setData] = React.useState([]);
  const { slug } = useParams();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  React.useEffect(() => {
    fetchCourseVideos();
  }, [API_BASE_URL]);

  const fetchCourseVideos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/courseVideos`);
      const result = await response.json();

      if (result.success) {
        setData(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching course videos:", error);
      toast.error("Failed to load course videos");
    }
  };

  const handleDelete = async (id) => {
    // Ask for confirmation before deleting
    if (!window.confirm("Are you sure you want to delete these course videos?")) {
      return;
    }

    const url = `${API_BASE_URL}/api/v1/courseVideos/product/${id}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Course Videos deleted successfully!");
        fetchCourseVideos(); // Refresh the list after deletion
      } else {
        console.error("Error response:", result);
        toast.error(result.message || "Failed to delete Course Videos");
      }
    } catch (error) {
      console.error("Error deleting Course Videos:", error.message);
      toast.error("An error occurred while deleting Course Videos.");
    }
  };

  return (
    <div>
      <Breadcrubs title="All Course Videos" />

      <div className="flex flex-col gap-10 justify-between">
        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No course videos found</p>
            <Link href="add" className="px-4 py-2 bg-customDark text-white rounded">
              Add Course Videos
            </Link>
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
                    onClick={() => handleDelete(val.product)}
                    title="Delete course videos"
                  >
                    <Icon icon="mi:delete" width="24" height="24" />
                  </button>
                  <Link
                    className="border p-2"
                    href={`add?id=${val.product}`}
                    title="Edit course videos"
                  >
                    <Icon icon="cuida:edit-outline" width="24" height="24" />
                  </Link>
                </div>
                <AccordionTrigger className="relative group font-semibold px-2 border-b-2 border-b-cyan-500 overflow-hidden bg-white">
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-lime-200 transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"></span>
                  <span className="relative z-10">{val.productTitle || "Unnamed Product"}</span>
                </AccordionTrigger>
                <AccordionContent className="py-3">
                  <div className="flex flex-col gap-4 w-full">
                    {val.groups?.map((video, index) => (
                      <div
                        className="index border-b pb-5 mb-4 border-black"
                        key={index}
                      >
                        <div className="text-2xl font-bold">
                          Learning Objective {index + 1}
                        </div>
                        <div className="mb-4 text-gray-600">
                          {video?.description || "No description provided"}
                        </div>
                        <div className="flex flex-col gap-2">
                          {video?.iframes?.map((vals, index) => (
                            <div
                              key={index}
                              dangerouslySetInnerHTML={{ __html: vals.iframe }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
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