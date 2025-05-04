"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import Breadcrubs from "@/components/admin/breadcrubs";
const ProductAddPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductAdd />
    </Suspense>
  );
};
const ProductAdd = () => {
  const [initialValues, setInitialValues] = useState({
    title: "",
    category: "beginner",
    prices: "all_prices",
    bootcampAvailability: "all_bootcamps",
    courseDetails: {
      overview: "",
      accessPeriod: [{ days: "", price: "" }],
      gcbLab: {
        image: "",
        labs: [{ title: "", description: "", imageUrl: "" }],
      },
      onDemandLab: [{ title: "", price: "" }],
    },
    termsAndConditions: [""],
    howLearn: [{ title: "", points: [""] }],
    certification: [{ title: "", description: "", image: "" }],
    author: { title: "", description: "", imageUrl: "" },
  });
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchProducts = async () => {
      if (id) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/products/${id}`);
          const result = await response.json();

          if (result.success) {
            setInitialValues(result.data);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };

    fetchProducts();
  }, [id]);
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    category: Yup.string().required("Category is required"),
    prices: Yup.string().required("Price option is required"),
    bootcampAvailability: Yup.string().required("Bootcamp option is required"),
  });
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/products/${id ? id : ""}`,
        {
          method: id ? "PATCH" : "POST", // If `id` exists, update; otherwise, create a new product
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success(`Product ${id ? "updated" : "created"} successfully!`);
        window.location.href = "list";

        resetForm();
      } else {
        console.error("Error response:", result);
        toast.error("Failed to add Product");
      }
    } catch (error) {
      console.error("Error adding Product:", error.message);
      toast.error("An error occurred while adding Product.");
    }
  };

  return (
    <div>
      <Breadcrubs title="Add Product" />

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="p-4 max-w-7xl mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-3xl font-bold mb-4">
              {" "}
              {id ? "Edit Product" : "Add Product"} Form
            </h2>
            <div className="mb-4">
              <label className="block font-semibold">Title</label>
              <Field name="title" className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Overview</label>
              <Field
                as="textarea"
                name="courseDetails.overview"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold">Category</label>
                <Field
                  as="select"
                  name="category"
                  className="w-full p-2 border rounded"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Field>
              </div>

              <div>
                <label className="block font-semibold">Prices</label>
                <Field
                  as="select"
                  name="prices"
                  className="w-full p-2 border rounded"
                >
                  <option value="all_prices">All Prices</option>
                  <option value="discount_only">Discount Only</option>
                </Field>
              </div>
            </div>

            <FieldArray name="courseDetails.accessPeriod">
              {({ push, remove }) => (
                <div>
                  <div className="flex w-full justify-between mb-2">
                    <h3 className="font-semibold mt-4">Access Period</h3>
                    <button
                      type="button"
                      onClick={() => push({ days: "", price: "" })}
                      className="mt-2 bg-customgreen text-white p-2 rounded"
                    >
                      Add
                    </button>
                  </div>
                  {values.courseDetails.accessPeriod.map((_, index) => (
                    <div key={index} className="flex gap-2 w-full mb-2">
                      <Field
                        name={`courseDetails.accessPeriod.${index}.days`}
                        placeholder="Days"
                        className="p-2 w-[50%] border rounded"
                      />
                      <Field
                        name={`courseDetails.accessPeriod.${index}.price`}
                        placeholder="Price"
                        className="p-2 w-[50%]  border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-3 text-3xl bg-red-500 text-white rounded"
                      >
                        <Icon icon="charm:cross" width="16" height="16" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>
            <FieldArray name="courseDetails.onDemandLab">
              {({ push, remove }) => (
                <div>
                  <div className="flex w-full justify-between mb-2">
                    <h3 className="font-semibold mt-4">On Demand Lab</h3>
                    <button
                      type="button"
                      onClick={() => push({ days: "", price: "" })}
                      className="mt-2 bg-customgreen text-white p-2 rounded"
                    >
                      Add
                    </button>
                  </div>
                  {values.courseDetails.onDemandLab.map((_, index) => (
                    <div key={index} className="flex gap-2 w-full mb-2">
                      <Field
                        name={`courseDetails.onDemandLab.${index}.title`}
                        placeholder="Title"
                        className="p-2 w-[50%] border rounded"
                      />
                      <Field
                        name={`courseDetails.onDemandLab.${index}.price`}
                        placeholder="Price"
                        className="p-2 w-[50%]  border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-3 text-3xl bg-red-500 text-white rounded"
                      >
                        <Icon icon="charm:cross" width="16" height="16" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>
            <div>
              <label className="block text-sm font-medium">
                Bootcamp Availability
              </label>
              <Field
                as="select"
                name="bootcampAvailability"
                className="w-full p-2 border rounded"
              >
                <option value="all_bootcamps">All Bootcamps</option>
                <option value="bootcamp_availability">
                  Bootcamp Availability
                </option>
              </Field>
            </div>

            <FieldArray name="courseDetails.gcbLab.labs">
              {({ push, remove }) => (
                <div>
                  <h3 className="font-semibold mt-4">GCB Lab</h3>
                  <Field
                    name="courseDetails.gcbLab.image"
                    placeholder="Image URL"
                    className="w-full p-2 border rounded mb-2"
                  />
                  {values.courseDetails.gcbLab.labs.map((_, index) => (
                    <div key={index} className="mb-2 flex items-center gap-2">
                      <Field
                        name={`courseDetails.gcbLab.labs.${index}.title`}
                        placeholder="Title"
                        className="p-2 border w-[30%] rounded"
                      />
                      <Field
                        name={`courseDetails.gcbLab.labs.${index}.description`}
                        placeholder="Description"
                        className="p-2 border w-[30%] rounded"
                      />
                      <Field
                        name={`courseDetails.gcbLab.labs.${index}.imageUrl`}
                        placeholder="Image URL"
                        className="p-2 border w-[30%] rounded"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-3 bg-red-500 text-white rounded"
                      >
                        <Icon icon="charm:cross" width="16" height="16" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      push({ title: "", description: "", imageUrl: "" })
                    }
                    className="mt-2 bg-customgreen text-white p-2 rounded"
                  >
                    Add Lab
                  </button>
                </div>
              )}
            </FieldArray>
            <FieldArray name="certification">
              {({ push, remove }) => (
                <div>
                  <h3 className="font-semibold mt-4">Certification</h3>
                  {values.certification.map((_, index) => (
                    <div key={index} className="mb-2 space-x-2 w-full">
                      <Field
                        name={`certification.${index}.title`}
                        placeholder="Title"
                        className="p-2 w-[30%] border rounded"
                      />
                      <Field
                        name={`certification.${index}.description`}
                        placeholder="Description"
                        className="p-2 w-[30%]  border rounded"
                      />
                      <Field
                        name={`certification.${index}.image`}
                        placeholder="Image URL"
                        className="p-2 w-[30%]  border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-3 bg-red-500 text-white rounded"
                      >
                        <Icon icon="charm:cross" width="16" height="16" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      push({ title: "", description: "", image: "" })
                    }
                    className="mt-2 bg-customgreen  text-white p-2 rounded"
                  >
                    Add Certification
                  </button>
                </div>
              )}
            </FieldArray>
            <div className="mb-4">
              <label className="block text-sm font-medium">Author</label>
              <div className="w-full flex gap-2 items-center mb-2">
                <Field
                  name="author.title"
                  placeholder="Title"
                  className="w-[50%] p-2 border rounded "
                />
                <Field
                  name="author.imageUrl"
                  placeholder="Image URL"
                  className="w-[50%] p-2 border rounded"
                />{" "}
              </div>
              <Field
                name="author.description"
                placeholder="Description"
                className="w-full p-2 border rounded mb-2"
              />
            </div>
            <FieldArray name="termsAndConditions">
              {({ push, remove }) => (
                <div>
                  <h3 className="font-semibold mt-4">Terms & Conditions</h3>
                  {values.termsAndConditions.map((_, index) => (
                    <div key={index} className="mb-2 flex items-center gap-2">
                      <Field
                        name={`termsAndConditions.${index}`}
                        placeholder="Enter term"
                        className="w-full p-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-3 bg-red-500 text-white rounded"
                      >
                        <Icon icon="charm:cross" width="16" height="16" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => push("")}
                    className="mt-2 bg-customgreen text-white p-2 rounded"
                  >
                    Add Term
                  </button>
                </div>
              )}
            </FieldArray>

            <FieldArray name="howLearn">
              {({ push, remove }) => (
                <div>
                  <h3 className="font-semibold mt-4">What You Learn</h3>
                  {values.howLearn.map((_, index) => (
                    <div key={index} className="mb-2 w-full">
                      <Field
                        name={`howLearn.${index}.title`}
                        placeholder="Title"
                        className="p-2 border rounded  w-full"
                      />
                      <FieldArray name={`howLearn.${index}.points`}>
                        {({ push, remove }) => (
                          <div className=" w-full">
                            {values.howLearn[index].points.map((_, idx) => (
                              <div key={idx} className="flex gap-2">
                                <Field
                                  name={`howLearn.${index}.points.${idx}`}
                                  placeholder="Point"
                                  className="p-2 my-1 border rounded  w-full"
                                />
                                <button
                                  type="button"
                                  onClick={() => remove(idx)}
                                  className="p-3 my-1 bg-red-500 text-white rounded"
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
                              onClick={() => push("")}
                              className="mt-2 bg-customgreen text-white p-2 rounded"
                            >
                              Add Point
                            </button>
                          </div>
                        )}
                      </FieldArray>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-3  bg-red-500 gap-2 flex  items-center  text-white rounded"
                        >
                          <Icon icon="charm:cross" width="16" height="16" />
                          Delete section{" "}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => push({ title: "", points: [""] })}
                    className="mt-2 bg-customgreen text-white p-2 rounded"
                  >
                    Add Section
                  </button>
                </div>
              )}
            </FieldArray>
            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-4 bg-gray-500 text-white p-2 px-6 rounded"
              >
                {id ? "Edit Product" : "Add Product"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductAddPage;
