"use client";
import Breadcrubs from "@/components/admin/breadcrubs";
import { DropdownMenuDemo } from "@/components/dashboard/learingdropdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image"; // Added Image import
import { useParams } from "next/navigation";

import React, { useEffect, useState } from "react";
import { CodeBlock, dracula } from "react-code-blocks";
import toast from "react-hot-toast";

const page = () => {
  const [data, setData] = useState([]);
  const { slug } = useParams(); // Assuming your route is "/product/:slug"
  const [products, setProducts] = React.useState([]);
  const [prodId, setProdId] = React.useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/products`);
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  useEffect(() => {
    fetchlabManuals();
  }, []);
  const fetchlabManuals = async (id) => {

    const url = prodId
      ? `${API_BASE_URL}/api/v1/labManuals/product/${prodId}`
      : `${API_BASE_URL}/api/v1/labManuals`;
    try {
      const response = await fetch(url);
      const result = await response.json();
      const apidata = result.data;
    
      if (result.success) {
        setData(apidata);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handlDelete = async (id) => {
    const url = `${API_BASE_URL}/api/v1/labManuals/product/${id}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
      });

      const result = await response.json();
      if (response.ok) {

        toast.success("Manual Deleted successfully!");
        fetchlabManuals();
      } else {
        console.error("Error response:", result);
        toast.error("Failed to Delete Manual");
      }
    } catch (error) {
      console.error("Error Delete FAQs:", error.message);
      toast.error("An error occurred while Delete Manual.");
    }
  };

  return (
    <div>
      <Breadcrubs title="All Lab Manual" />

      <div className="flex flex-col gap-10 justify-between">
        <div className="flex justify-between items-center">
          <div className="mb-4 flex items-end gap-3">
            <div className="max-w-[400px]">
              <label className="block font-medium">Select Product</label>
              <select
                value={prodId}
                onChange={(e) => {
                  setProdId(e.target.value);
                }}
                className="border p-2 w-full rounded-md"
              >
                <option value="">-- Select a Product --</option>
                <option value="">All Products</option>
                {products.map((product) => (
                  <option key={product._id} value={product?._id}>
                    {product.title}
                  </option>
                ))}
              </select>{" "}
            </div>
            <Button onClick={() => fetchlabManuals(prodId)}>Search</Button>
          </div>
          <Link
            href="add"
            className="bg-custom-blue rounded-xl text-white flex p-2 bg-[#82849a] hover:bg-[#3b3c46]"
          >
            <Icon icon="basil:plus-outline" width="24" height="24" />
            Add New
          </Link>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {data?.length > 0
            ? data.map((manualdata, index) => (
              <div
                key={manualdata._id}
                className="flex flex-col justify-between mb-4 border border-gray-400"
              >
                <div className="flex justify-end items-center gap-2">
                  <button
                    className="border p-2"
                    onClick={() => handlDelete(manualdata.product)}
                  >
                    <Icon icon="mi:delete" width="24" height="24" />
                  </button>
                  <Link
                    className="border p-2"
                    href={`add?id=${manualdata.product}`}
                  >
                    <Icon icon="cuida:edit-outline" width="24" height="24" />
                  </Link>
                </div>
                <AccordionItem value={`item-${index + 1}`}>
                  <AccordionTrigger className=" font-semibold bg-blue-200 p-2 text-xl">
                    {index + 1}. Product :- {manualdata.productTitle}.
                  </AccordionTrigger>
                  <AccordionContent className="bg-white p-4 ">
                    <div className=" border shadow-lg w-full max-w-5xl">
                      <h2 className=" p-5  bg-[#B66BA3] font-semibold text-gray-200 mb-4 w-full">
                        Lab instructions
                      </h2>

                      <ul className="text-gray-900 list-disc p-4 pl-10">
                        {manualdata?.labInstructions.length > 0
                          ? manualdata?.labInstructions.map((val, index) => (
                            <li key={`${val}${index}`}>{val}</li>
                          ))
                          : "No Data Available"}

                        {/* <CodeBlock
            language="jsx"
            text={`v := Vertex{X: 1, Y: 2}`}
            theme={dracula}
            showLineNumbers={false}
          /> */}
                      </ul>
                    </div>
                    <div className="w-full flex flex-col mt-4 gap-8 max-w-5xl">
                      {manualdata?.tasks.length > 0
                        ? manualdata?.tasks.map((val, index) => {
                          return (
                            <Accordion
                              key={val._id}
                              type="single"
                              collapsible
                              id={val._id}
                            >
                              <AccordionItem
                                value="item-1"
                                className="border-0 "
                              >
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
                                        <li key={index}>{taskin}</li>
                                      ))}{" "}
                                    </ul>

                                    {/* Conditionally render image if imageurl exists */}
                                    {val.imageurl && (
                                      <div className="p-4 flex justify-center">
                                        <Image
                                          src={val.imageurl}
                                          alt="Task image"
                                          width={400}
                                          height={300}
                                          className="rounded-md shadow-md"
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
                                      <p className="font-semibold ">
                                        Solution
                                      </p>
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
                    </div>{" "}
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))
            : "No Data Available"}
        </Accordion>
      </div>
    </div>
  );
};

export default page;