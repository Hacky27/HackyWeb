"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import Breadcrubs from "@/components/admin/breadcrubs";
import Link from "next/link";

const validationSchema = Yup.object({
  product: Yup.string().required("Product is required"),
  driveLinks: Yup.array().of(
    Yup.array().of(
      Yup.object({
        link: Yup.string()
          .url("Invalid URL")
          .required("Drive link is required"),
      })
    )
  ),
});

const DriveLinkForm = () => {
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialvalue, setInitialvalue] = useState({
    product: "",
    driveLinks: [[{ link: "" }]],
  });
  const [id, setId] = useState(null);
  const [existingProduct, setExistingProduct] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setId(urlParams.get("id"));
    }
  }, []);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchFaqs();
  }, [id]);

  const fetchFaqs = async () => {
    if (id) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/courseMaterials/product/${id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setInitialvalue(result.data);
        
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
        toast.error("Failed to load course material data");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/products`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    }
  };

  // Check if material already exists for a product
  const checkExistingMaterial = async (productId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/courseMaterials/product/${productId}`
      );

      // If the response is not ok, material doesn't exist
      if (!response.ok) {
        setExistingProduct(false);
        return false;
      }

      const result = await response.json();

      // Check if API returns success and has actual data
      if (result.success && result.data && result.data.driveLinks && result.data.driveLinks.length > 0) {
        setExistingProduct(true);
        return true;
      } else {
        setExistingProduct(false);
        return false;
      }
    } catch (error) {
      console.error("Error checking existing material:", error);
      return false;
    }
  };

  const handleProductChange = async (e, setFieldValue) => {
    const productId = e.target.value;
    setFieldValue("product", productId);

    if (productId) {
      // Check if material exists for this product
      const exists = await checkExistingMaterial(productId);
      if (exists) {
        // Show toast notification
        toast.error("Course material already exists for this product. Please edit instead.");
      }
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);

    try {
      let url;
      let method;

      if (id) {
        // We're updating an existing material
        url = `${API_BASE_URL}/api/v1/courseMaterials/edit/${id}`;
        method = "PUT";
      } else {
        // We're creating a new material
        url = `${API_BASE_URL}/api/v1/courseMaterials/add`;
        method = "POST";

        // Double-check if material already exists
        const exists = await checkExistingMaterial(values.product);
        if (exists) {
          toast.error("Course material already exists for this product. Please use edit instead.");
          setIsSubmitting(false);
          return;
        }
      }

     
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();
     

      if (response.ok) {
        toast.success(result.message || (id ? "Material updated successfully!" : "Material created successfully!"));
        setTimeout(() => {
          window.location.href = "list";
        }, 1000);
      } else {
        console.error("Error response:", result);

        // If the error is a duplicate entry
        if (response.status === 409) {
          toast.error("Cannot create course material. Product already has materials. You can edit it instead.");
        } else {
          toast.error(result.message || "Failed to submit material");
        }
      }
    } catch (error) {
      console.error("Error submitting material:", error.message);
      toast.error("An error occurred while submitting material.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Breadcrubs title={id ? "Edit Course Material" : "Add Course Material"} />
      <Formik
        enableReinitialize
        initialValues={initialvalue}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="max-w-7xl mx-auto p-6 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Google Drive Links Form
            </h2>
            {!id && (
              <div className="mb-4">
                <label className="block font-medium">Select Product</label>
                <Field
                  as="select"
                  name="product"
                  className="border p-2 w-full"
                  onChange={(e) => handleProductChange(e, setFieldValue)}
                >
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

                {existingProduct && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                    This product already has materials. Please
                    <Link href={`add?id=${values.product}`} className="font-bold text-red-700 mx-1">
                      edit
                    </Link>
                    instead of creating new ones.
                  </div>
                )}
              </div>
            )}

            <FieldArray name="driveLinks">
              {({ push, remove }) => (
                <div>
                  {values.driveLinks.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-4 border p-3 rounded">
                      <h3 className="font-semibold mb-2">
                        Group {groupIndex + 1}
                      </h3>

                      <FieldArray name={`driveLinks.${groupIndex}`}>
                        {({ push, remove }) => (
                          <div>
                            {group.map((item, index) => (
                              <div key={index} className="flex gap-2 mb-2">
                                <Field
                                  name={`driveLinks.${groupIndex}.${index}.link`}
                                  className="border p-2 w-full"
                                  placeholder="Enter Google Drive Link"
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
                              onClick={() => push({ link: "" })}
                              className="px-3 py-1 bg-customgreen text-white"
                            >
                              Add Link
                            </button>
                          </div>
                        )}
                      </FieldArray>
                      <button
                        type="button"
                        onClick={() => remove(groupIndex)}
                        className="mt-2 underline font-bold py-1 text-red-500"
                      >
                        Remove Group
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => push([{ link: "" }])}
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
                disabled={isSubmitting || (!id && existingProduct)}
                className={`mt-4 rounded-lg px-4 py-2 ${isSubmitting || (!id && existingProduct)
                  ? "bg-gray-400"
                  : "bg-gray-600"
                  } text-white`}
              >
                {isSubmitting
                  ? "Submitting..."
                  : id
                    ? "Update Material"
                    : "Add Material"
                }
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DriveLinkForm;