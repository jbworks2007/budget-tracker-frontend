"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { createCategory } from "@/api/category/create-category";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddNewCategoryModal({ isOpen, onClose }: ModalProps) {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;

  const [submitting, setSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    if (inputValue) {
      // onSubmit(selectedOption, inputValue);
      const data = await createCategory(inputValue);
      toast.success(data.message);
      setInputValue("");
      onClose();
    }
    setSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-medium text-gray-900">Add Category</h2>

        {/* <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            value={categoryName}
            disabled
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            placeholder="required*"
          />
        </div> */}

        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Enter Category Name</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            placeholder="Enter value"
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
