"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Breadcrubs from "@/components/admin/breadcrubs";

const validationSchema = Yup.object({
  machine: Yup.string().required("Machine is required"),
  flag: Yup.string().required("Flag is required"),
  value: Yup.string().required("Value is required"),
});

const MachineForm = () => {
  const [initialValues, setInitialValues] = useState({
    product: "",
    machine: "",
    flag: "",
    value: "",
  });
  const [products, setProducts] = useState([]);
  const [formId, setFormId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setFormId(urlParams.get("id"));
    }
  }, []);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchProducts();
    if (formId) {
      fetchMachineForm();
    }
  }, [formId]);

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

  const fetchMachineForm = async () => {
    if (formId) {
      try {
        // Changed to fetch individual form by ID instead of all forms for a product
        const response = await fetch(
          `${API_BASE_URL}/api/v1/machineForms/${formId}`
        );
        const result = await response.json();

        if (result.success) {
          setInitialValues(result.data);
        }
      } catch (error) {
        console.error("Error fetching form:", error);
      }
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const url = `${API_BASE_URL}/api/v1/machineForms/save`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(`Machine form submitted successfully!`);
        window.location.href = "list";
        resetForm();
      } else {
        console.error("Error response:", result);
        toast.error("Failed to submit machine form");
      }
    } catch (error) {
      console.error("Error adding form:", error.message);
      toast.error("An error occurred while submitting the form.");
    }
  };

  return (
    <div>
      <Breadcrubs title="Add Flags" />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="max-w-7xl mx-auto p-6 border rounded-lg shadow-md">
            {/* Product Dropdown */}
            <div className="mb-4">
              <label className="block font-medium">Select Product</label>
              <Field as="select" name="product" className="border p-2 w-full">
                <option value="">-- Select a Product --</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.title}
                  </option>
                ))}
              </Field>
              {errors.product && touched.product && (
                <p className="text-red-500">{errors.product}</p>
              )}
            </div>

            <h2 className="text-xl font-semibold mb-4">Machine Form</h2>

            <div className="mb-4">
              <label className="block font-medium">Machine</label>
              <Field name="machine" className="border p-2 w-full rounded-md" />
              {errors.machine && touched.machine && (
                <p className="text-red-500">{errors.machine}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-medium">Flag</label>
              <Field name="flag" className="border p-2 w-full rounded-md" />
              {errors.flag && touched.flag && (
                <p className="text-red-500">{errors.flag}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-medium">Value</label>
              <Field name="value" className="border rounded-md p-2 w-full" />
              {errors.value && touched.value && (
                <p className="text-red-500">{errors.value}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-4 rounded-md px-4 py-2 bg-gray-600 text-white"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MachineForm;