"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import Breadcrubs from "@/components/admin/breadcrubs";

// ✅ Updated Validation Schema to include 'description' for each group
const validationSchema = Yup.object({
  product: Yup.string().required("Product is required"),
  groups: Yup.array().of(
    Yup.object({
      description: Yup.string().required("Description is required"),
      iframes: Yup.array().of(
        Yup.object({
          iframe: Yup.string().required("Iframe is required"),
        })
      ),
    })
  ),
});

const YoutubeIframeForm = () => {
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValue, setInitialValue] = useState({
    product: "",
    groups: [{ description: "", iframes: [{ iframe: "" }] }],
  });
  const [id, setId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get("id");
      setId(productId);

      // Set isEditing flag based on whether id exists
      if (productId) {
        setIsEditing(true);
      }
    }
  }, []);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (id) {
      fetchCourseVideos();
    }
  }, [id]);

  const fetchCourseVideos = async () => {
    if (id) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/courseVideos/product/${id}`
        );
        const result = await response.json();

        if (result.success && result.data) {
          setInitialValue(result.data);
        }
      } catch (error) {
        console.error("Error fetching course videos:", error);
        toast.error("Failed to fetch course videos data");
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
      toast.error("Failed to load products");
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);

    // Determine which API endpoint to use based on whether we're editing or adding
    const url = isEditing
      ? `${API_BASE_URL}/api/v1/courseVideos/update`
      : `${API_BASE_URL}/api/v1/courseVideos/add`;

    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          result.message ||
          (isEditing ? "Videos updated successfully!" : "Videos added successfully!")
        );
        window.location.href = "list";
        resetForm();
      } else {
        console.error("Error response:", result);

        // If trying to add a duplicate record, show a specific error message
        if (response.status === 409) {
          toast.error("Videos for this product already exist. Please edit instead.");
        } else if (response.status === 404 && isEditing) {
          toast.error("No videos found for this product. Please add instead.");
        } else {
          toast.error(result.message || "Failed to submit videos");
        }
      }
    } catch (error) {
      console.error("Error submitting videos:", error.message);
      toast.error("An error occurred while submitting videos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Breadcrubs title={isEditing ? "Edit Course Videos" : "Add Course Videos"} />

      <Formik
        enableReinitialize
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form className="max-w-7xl mx-auto p-6 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Course Videos" : "Add Course Videos"}
            </h2>

            {/* Product Dropdown - Only show when adding new videos */}
            {!isEditing && (
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

            <FieldArray name="groups">
              {({ push, remove }) => (
                <div>
                  {values.groups.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-4 border p-3 rounded">
                      <h3 className="font-semibold mb-2">
                        Group {groupIndex + 1}
                      </h3>

                      {/* Description Field */}
                      <div className="mb-2">
                        <label className="block font-medium">
                          Group Description
                        </label>
                        <Field
                          name={`groups.${groupIndex}.description`}
                          className="border p-2 w-full"
                          placeholder="Enter group description"
                        />
                        {errors.groups?.[groupIndex]?.description &&
                          touched.groups?.[groupIndex]?.description && (
                            <p className="text-red-500">
                              {errors.groups[groupIndex].description}
                            </p>
                          )}
                      </div>

                      {/* Iframes FieldArray */}
                      <FieldArray name={`groups.${groupIndex}.iframes`}>
                        {({ push, remove }) => (
                          <div>
                            {group.iframes.map((item, index) => (
                              <div key={index} className="flex gap-2 mb-2">
                                <Field
                                  name={`groups.${groupIndex}.iframes.${index}.iframe`}
                                  className="border p-2 w-full"
                                  placeholder="Enter YouTube Embed URL"
                                />
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="px-3 py-1 bg-red-500 text-white"
                                >
                                  <Icon
                                    icon="charm:cross"
                                    width="16"
                                    height="16"
                                  />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => push({ iframe: "" })}
                              className="px-3 py-1 bg-customgreen text-white"
                            >
                              Add Iframe
                            </button>
                          </div>
                        )}
                      </FieldArray>

                      <button
                        type="button"
                        onClick={() => remove(groupIndex)}
                        className="mt-2 font-bold py-1 underline text-red-600"
                      >
                        Remove Group
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      push({ description: "", iframes: [{ iframe: "" }] })
                    }
                    className="px-3 py-1 bg-customDark text-white"
                  >
                    Add Group
                  </button>
                </div>
              )}
            </FieldArray>

            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-4 rounded-lg px-4 py-2 bg-gray-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : isEditing ? "Update Videos" : "Add Videos"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default YoutubeIframeForm;