"use client";

import { modifyUserExpense } from "@/api/user-expense/modify-user-expense";
import { modifyUserIncome } from "@/api/user-income/modify-user-income";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  categoryId: string;
  categoryName: string;
  prevAmt: number;
}

export default function UserEditModal({ isOpen, onClose, type, categoryId, categoryName, prevAmt }: ModalProps) {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;

  const [inputValue, setInputValue] = useState(0);

  useEffect(() => {
    if (prevAmt !== undefined) {
      setInputValue(prevAmt);
    }
  }, [prevAmt]);

  const handleSubmit = async () => {
    if (categoryName && inputValue) {
      // onSubmit(selectedOption, inputValue);
      if (type === "income") {
        const data = await modifyUserIncome(user._id, categoryId, inputValue);
        toast.success(data.message);
      }
      if (type === "expense") {
        const data = await modifyUserExpense(user._id, categoryId, inputValue);
        toast.success(data.message);
      }
      setInputValue(0);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-medium text-gray-900">Edit Amount</h2>

        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            value={categoryName}
            disabled
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            placeholder="required*"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Enter Value</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(parseFloat(e.target.value))}
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
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
