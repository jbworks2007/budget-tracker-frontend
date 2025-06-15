"use client";

import { getAllCategory } from "@/api/category/get-all-category";
import { addUserIncome } from "@/api/user-income/add-user-income";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { addUserExpense } from "@/api/user-expense/add-user-expense";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
}

export default function UserCategoryModal({ isOpen, onClose, type }: ModalProps) {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;

  const [show, setShow] = useState(false);
  const [options, setOptions] = useState<UserCategory[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedid, setSelectedId] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async () => {
    if (selectedOption && inputValue) {
      // onSubmit(selectedOption, inputValue);
      if (type === "income") {
        const data = await addUserIncome(user._id, selectedid, parseFloat(inputValue));
        toast.success(data.message);
      }
      if (type === "expense") {
        const data = await addUserExpense(user._id, selectedid, parseFloat(inputValue));
        toast.success(data.message);
      }
      setSelectedOption("");
      setInputValue("");
      onClose();
    }
  };

  const getCategory = async () => {
    const data = await getAllCategory();
    console.log("🚀 ~ getCategory ~ data:", data);
    setOptions(data);
  };

  useEffect(() => {
    getCategory();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-medium text-gray-900">Add Value</h2>

        {/* <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Select Option</label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="">-- Select --</option>
            {options.map((option, idx) => (
              <option key={idx} value={option}>
                {option.name}
              </option>
            ))}
          </select>
        </div> */}

        <div className="mt-4 relative inline-block text-left w-full">
          <div className="w-full">
            <button
              type="button"
              className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setShow(!show)}
            >
              {selectedOption ? selectedOption : "Select"} {/* Show selected option or default text */}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.292 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {show && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {options.map((option, idx) => (
                  <span
                    key={idx}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedOption(option.name);
                      setSelectedId(option._id);
                      setShow(false);
                    }}
                  >
                    {option.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Enter Amount</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            placeholder="0.00"
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
