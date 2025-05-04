"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Breadcrubs from "@/components/admin/breadcrubs";

const validationSchema = Yup.object({
  product: Yup.string().required("Product selection is required"),
  faqs: Yup.array().of(
    Yup.object({
      question: Yup.string().required("Question is required"),
      answer: Yup.string().required("Answer is required"),
    })
  ),
});

const FAQForm = () => {
  const [products, setProducts] = useState([]);
  const [initialvalue, setInitialvalue] = useState({
    product: "",
    faqs: [{ question: "", answer: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [id, setId] = useState(null);
  const [faqId, setFaqId] = useState(null); // Store the actual FAQ document ID

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setId(urlParams.get("id"));
    }
  }, []);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (id) {
      fetchFaqs();
    }
  }, [id]);

  const fetchFaqs = async () => {
    if (id) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/faqs/product/${id}`
        );
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          const apidata = result.data[0];
          // Store the actual FAQ document ID for update
          setFaqId(apidata._id);
          setInitialvalue(apidata);

       
        
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        toast.error("Failed to load FAQ data");
      }
    }
  };

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

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);

    try {
      let url;
      let method;
      let requestData;

      if (faqId) {
        // We're updating an existing FAQ document
        url = `${API_BASE_URL}/api/v1/faqs/update/${faqId}`;
        method = "PUT";

        // Just send the faqs array for update
        requestData = {
          faqs: values.faqs.map(faq => ({
            question: faq.question,
            answer: faq.answer,
            // Include _id if it exists
            ...(faq._id ? { _id: faq._id } : {})
          }))
        };


      } else {
        // We're creating a new FAQ document
        url = `${API_BASE_URL}/api/v1/faqs/create`;
        method = "POST";

        // Send both product and faqs for create
        requestData = {
          product: values.product,
          faqs: values.faqs.map(faq => ({
            question: faq.question,
            answer: faq.answer
          }))
        };

    
      }

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
     

      if (response.ok) {
        toast.success(faqId ? "FAQs updated successfully!" : "FAQs created successfully!");
        window.location.href = "list";
      } else {
        console.error("Error response:", result);
        toast.error(result.message || (faqId ? "Failed to update FAQs" : "Failed to create FAQs"));
      }
    } catch (error) {
      console.error("Error submitting FAQs:", error);
      toast.error("An error occurred while submitting FAQs");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Breadcrubs title={id ? "Edit Faqs" : "Add Faqs"} />
      <Formik
        enableReinitialize
        initialValues={initialvalue}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form className="max-w-7xl mx-auto p-6 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">FAQs Form</h2>
            {/* Product Dropdown */}
            {!id && (
              <div className="mb-4">
                <label className="block font-medium">Select Product</label>
                <Field as="select" name="product" className="border p-2 w-full">
                  <option value="">-- Select a Product --</option>
                  {products?.map((product) => (
                    <option key={product?._id} value={product?._id}>
                      {product.title}
                    </option>
                  ))}
                </Field>
                {errors?.product && touched?.product && (
                  <p className="text-red-500">{errors.product}</p>
                )}
              </div>
            )}

            {faqId && (
              <div className="mb-4 p-2 bg-gray-100 rounded">
                <p className="text-sm text-gray-600">FAQ ID: {faqId}</p>
              </div>
            )}

            <FieldArray name="faqs">
              {({ push, remove }) => (
                <div>
                  {values?.faqs?.map((faq, index) => (
                    <div key={index} className="mb-4 border p-3 rounded">
                      <h3 className="font-semibold mb-2">FAQ {index + 1}</h3>

                      <div className="mb-2">
                        <label className="block font-medium">Question</label>
                        <Field
                          name={`faqs.${index}.question`}
                          className="border p-2 w-full"
                          placeholder="Enter question"
                        />
                        {errors?.faqs?.[index]?.question &&
                          touched.faqs?.[index]?.question && (
                            <p className="text-red-500">
                              {errors?.faqs[index].question}
                            </p>
                          )}
                      </div>

                      <div className="mb-2">
                        <label className="block font-medium">Answer</label>
                        <Field
                          name={`faqs.${index}.answer`}
                          className="border p-2 w-full"
                          placeholder="Enter answer"
                        />
                        {errors.faqs?.[index]?.answer &&
                          touched.faqs?.[index]?.answer && (
                            <p className="text-red-500">
                              {errors.faqs[index].answer}
                            </p>
                          )}
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="mt-2 px-3 py-1 bg-red-500 text-white"
                      >
                        Remove FAQ
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => push({ question: "", answer: "" })}
                    className="px-3 py-1 bg-customgreen text-white"
                  >
                    Add FAQ
                  </button>
                </div>
              )}
            </FieldArray>
            <div className="flex justify-end">
              <button
                type="submit"
                className={`mt-4 rounded-lg px-4 py-2 ${isSubmitting ? "bg-gray-400" : "bg-gray-600"
                  } text-white`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : id ? "Update" : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FAQForm;