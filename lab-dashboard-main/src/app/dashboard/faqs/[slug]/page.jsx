"use client";
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
          `${API_BASE_URL}/api/v1/faqs/product/${slug}`
        );
        const result = await response.json();
  
        if (result.success) {
          setData(result.data[0]?.faqs || []);
        }
      } catch (error) {
        console.error("Error fetching machine forms:", error);
      }
    };

    fetchMachineForms();
  }, [API_BASE_URL]);

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-4">Practice Lab</h1>
      <ol className="space-y-2">
        {data?.length > 0
          ? data.map((faq, index) => {
              return (
                <li
                  key={index}
                  className="p-3 flex items-start w-full border-b border-gray-300 gap-3"
                >
                  <p className="mt-[3px]">{index + 1}.</p>
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      {faq.question}
                    </h2>
                    <p className="whitespace-pre-line text-gray-700">
                      {faq.answer}
                    </p>
                  </div>
                </li>
              );
            })
          : "no data available"}
      </ol>
    </div>
  );
};

export default page;
