"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import Breadcrubs from "@/components/admin/breadcrubs";

// ✅ Updated Yup validation schema
const validationSchema = Yup.object({
  product: Yup.string().required("Product selection is required"),
  labInstructions: Yup.array().of(Yup.string().required("Required")),
  tasks: Yup.array().of(
    Yup.object().shape({
      task: Yup.array().of(Yup.string().required("Task is required")),
      solution: Yup.string().required("Solution is required"),
      imageurl: Yup.string().url("Enter a valid URL").notRequired(),
    })
  ),
});

const LabForm = () => {
  const [initialValues, setInitialValues] = useState({
    product: "",
    labInstructions: [""],
    tasks: [{ task: [""], solution: "", imageurl: "" }],
  });
  const [manualid, setId] = useState(null);
  const [products, setProducts] = useState([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setId(urlParams.get("id"));
    }
  }, []);

  useEffect(() => {
    fetchlabManuals();
    fetchProducts();
  }, [manualid]);

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

  const fetchlabManuals = async () => {
    if (manualid) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/labManuals/product/${manualid}`
        );
        const result = await response.json();
        if (result.success) {
          setInitialValues(result.data[0]);
        }
      } catch (error) {
        console.error("Error fetching lab manual:", error);
      }
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    // Use different endpoints based on whether it's an update or create
    const url = manualid
      ? `${API_BASE_URL}/api/v1/labManuals/update`
      : `${API_BASE_URL}/api/v1/labManuals/create`;

    try {
      const response = await fetch(url, {
        method: manualid ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(`Manual ${manualid ? "updated" : "created"} successfully!`);
        window.location.href = "list";
        resetForm();
      } else {
        console.error("Error response:", result);
        toast.error(`Failed to ${manualid ? "update" : "create"} manual`);
      }
    } catch (error) {
      console.error(`Error ${manualid ? "updating" : "creating"} manual:`, error.message);
      toast.error(`An error occurred while ${manualid ? "updating" : "creating"} manual.`);
    }
  };

  return (
    <div>
      <Breadcrubs title="Add Lab Manual" />

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form className="max-w-6xl p-6 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Lab Form</h2>

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

            {/* Lab Instructions */}
            <FieldArray name="labInstructions">
              {({ push, remove }) => (
                <div>
                  <h3 className="font-semibold mb-2">Lab Instructions</h3>
                  {values.labInstructions.map((_, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Field
                        name={`labInstructions.${index}`}
                        className="border p-2 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="px-3 py-1 bg-red-500 text-white"
                      >
                        <Icon icon="charm:cross" width="16" height="16" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => push("")}
                    className="px-3 py-1 bg-customgreen text-white"
                  >
                    Add More
                  </button>
                </div>
              )}
            </FieldArray>

            {/* Tasks */}
            <FieldArray name="tasks">
              {({ push, remove }) => (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Tasks</h3>
                  {values.tasks.map((taskItem, taskIndex) => (
                    <div key={taskIndex} className="border p-3 mb-3 rounded">
                      <FieldArray name={`tasks.${taskIndex}.task`}>
                        {({ push, remove }) => (
                          <div>
                            <h4 className="font-medium">Task Steps</h4>
                            {taskItem.task.map((_, stepIndex) => (
                              <div key={stepIndex} className="flex gap-2 mb-2">
                                <Field
                                  name={`tasks.${taskIndex}.task.${stepIndex}`}
                                  className="border p-2 w-full"
                                />
                                <button
                                  type="button"
                                  onClick={() => remove(stepIndex)}
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
                              onClick={() => push("")}
                              className="px-3 py-1 bg-customgreen text-white"
                            >
                              Add Task Step
                            </button>
                          </div>
                        )}
                      </FieldArray>

                      {/* Solution */}
                      <div className="mt-2">
                        <label className="block font-medium">Solution</label>
                        <Field
                          name={`tasks.${taskIndex}.solution`}
                          className="border p-2 w-full"
                        />
                        {errors.tasks?.[taskIndex]?.solution &&
                          touched.tasks?.[taskIndex]?.solution && (
                            <p className="text-red-500 text-sm">
                              {errors.tasks[taskIndex].solution}
                            </p>
                          )}
                      </div>

                      {/* Video URL */}
                      <div className="mt-2">
                        <label className="block font-medium">Image URL (optional)</label>
                        <Field
                          name={`tasks.${taskIndex}.imageurl`}
                          className="border p-2 w-full"
                          placeholder="https://example.com/image"
                        />
                        {errors.tasks?.[taskIndex]?.imageurl &&
                          touched.tasks?.[taskIndex]?.imageurl && (
                            <p className="text-red-500 text-sm">
                              {errors.tasks[taskIndex].imageurl}
                            </p>
                          )}
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(taskIndex)}
                        className="mt-2 px-3 py-1 bg-red-500 text-white"
                      >
                        Remove Task
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => push({ task: [""], solution: "", imageurl: "" })}
                    className="px-3 py-1 bg-green-500 text-white"
                  >
                    Add Task
                  </button>
                </div>
              )}
            </FieldArray>

            {/* Submit Button */}
            <div className="flex justify-end items-center">
              <button
                type="submit"
                className="mt-4 px-6 rounded-xl py-2 bg-green-600 text-white"
              >
                {manualid ? "UPDATE" : "ADD"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LabForm;