"use client";
import Breadcrubs from "@/components/admin/breadcrubs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const page = () => {
  const [data, setData] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [prodId, setProdId] = React.useState("");
  const { slug } = useParams();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  React.useEffect(() => {
    fetchMachineForms();
  }, [API_BASE_URL]);
  const fetchMachineForms = async () => {
    const url = prodId
      ? `${API_BASE_URL}/api/v1/faqs/product/${prodId}`
      : `${API_BASE_URL}/api/v1/faqs`;
    try {
      const response = await fetch(url);
      const result = await response.json();


      if (result.success) {
        setData(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching machine forms:", error);
    }
  };
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

  const handlDelete = async (id) => {
    const url = `${API_BASE_URL}/api/v1/faqs/product/${id}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
      });

      const result = await response.json();
      if (response.ok) {

        toast.success("FAQs Deleted successfully!");
        fetchMachineForms();
      } else {
        console.error("Error response:", result);
        toast.error("Failed to Delete FAQs");
      }
    } catch (error) {
      console.error("Error Delete FAQs:", error.message);
      toast.error("An error occurred while Delete FAQs.");
    }
  };
  return (
    <div className="w-full ">
      <Breadcrubs title="All Faqs" />
      <h1 className="text-2xl font-bold mb-4">Practice Lab</h1>
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
              <option key={product._id} value={product._id}>
                {product.title}
              </option>
            ))}
          </select>{" "}
        </div>
        <Button onClick={() => fetchMachineForms(prodId)}>Search</Button>
      </div>
      <ol className="space-y-2">
        <Accordion type="single" collapsible className="w-full">
          {data?.length > 0
            ? data.map((faqs, index) => {
              return (
                <li key={index} className="mb-4  border border-gray-600">
                  <div className="flex justify-end items-center gap-2">
                    <button
                      className="border p-2"
                      onClick={() => handlDelete(faqs.product)}
                    >
                      <Icon icon="mi:delete" width="24" height="24" />
                    </button>
                    <Link className="border p-2" href={`add?id=${faqs.product}`}>
                      <Icon
                        icon="cuida:edit-outline"
                        width="24"
                        height="24"
                      />
                    </Link>
                  </div>
                  <AccordionItem value={`item-${index + 1}`}>
                    <AccordionTrigger className=" font-semibold bg-blue-200 p-2 text-xl">
                      {index + 1}. {faqs.productTitle}.
                    </AccordionTrigger>
                    <AccordionContent className="bg-white p-4">
                      {faqs?.faqs.map((faq) => (
                        <div
                          key={faq._id}
                          className="border-b mb-3 pb-2"
                        >
                          <h2 className="text-lg font-semibold mb-2">
                            {faq.question}
                          </h2>
                          <p className="whitespace-pre-line text-gray-700">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </li>
              );
            })
            : "no data available"}
        </Accordion>{" "}
      </ol>
    </div>
  );
};

export default page;
