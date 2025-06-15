"use client";
import React, { useEffect, useState } from "react";
import { CiBadgeDollar } from "react-icons/ci";
import { LuHandCoins } from "react-icons/lu";
import { MdOutlineBalance } from "react-icons/md";
import { GiPiggyBank } from "react-icons/gi";
import Cookies from "js-cookie";
import { CiEdit, CiTrash } from "react-icons/ci";
import Pagination from "@/components/misc/Pagination";
import { getUserIncome } from "@/api/user-income/get-user-income";
import { getUserExpense } from "@/api/user-expense/get-user-expense";
import { getUserBudget } from "@/api/user-budget/get-user-budget";
import UserCategoryModal from "@/components/modals/UserCategoryModal";
import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";
import UserEditModal from "@/components/modals/UserEditModal";
import LineChart from "@/components/d3charts/LineChart";
import BarChart from "@/components/d3charts/BarChart";

const sampleData = [
  { id: 1, name: "Item 1", category: "Food", value: "$10" },
  { id: 2, name: "Item 2", category: "Transport", value: "$20" },
  { id: 3, name: "Item 3", category: "Utilities", value: "$30" },
  { id: 4, name: "Item 4", category: "Entertainment", value: "$40" },
  { id: 5, name: "Item 5", category: "Health", value: "$50" },
];

export default function Page() {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;

  const [currentIncomePage, setCurrentIncomePage] = useState(0);
  const [currentExpensePage, setCurrentExpensePage] = useState(0);
  const [userBudget, setUserBudget] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [incomeCategory, setIncomeCategory] = useState<UserCategory[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [expenseCategory, setExpenseCategory] = useState<UserCategory[]>([]);
  const [showUCM, setShowUCM] = useState(false);
  const [showUEM, setShowUEM] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [prevAmount, setPrevAmount] = useState(0);
  const [type, setType] = useState("");

  const fetchIncomeData = async () => {
    const income_data = await getUserIncome(user._id, currentIncomePage, 5);
    console.log("🚀 ~ fetchIncomeData ~ income_data:", income_data);
    setTotalIncome(income_data.totalAmount);
    setIncomeCategory(income_data.category);
  };

  useEffect(() => {
    fetchIncomeData();
  }, [currentIncomePage]);

  const fetchExpenseData = async () => {
    const expense_data = await getUserExpense(user._id, currentExpensePage, 5);
    console.log("🚀 ~ fetchExpenseData ~ expense_data:", expense_data);
    setTotalExpense(expense_data.totalAmount);
    setExpenseCategory(expense_data.category);
  };

  useEffect(() => {
    fetchExpenseData();
  }, [currentExpensePage]);

  const fetchBudget = async () => {
    const data = await getUserBudget(user._id);
    console.log("🚀 ~ fetchBudget ~ data:", typeof data.amount);
    setUserBudget(data.amount);
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const deleteUserCategory = async (type: string, categoryId: string) => {
    const reqBody = {
      userId: user._id,
      categoryId: categoryId,
    };
    if (type === "income") {
      try {
        const { data } = await axiosInstance.post("/ai/user-income/delete-user-income", reqBody);
        toast.success(data.message);
      } catch (error: any) {
        toast.error(error);
      }
    }
    if (type === "expense") {
      try {
        const { data } = await axiosInstance.post("/ai/user-expense/delete-user-expense", reqBody);
        toast.success(data.message);
      } catch (error: any) {
        toast.error(error);
      }
    }
    fetchIncomeData();
    fetchExpenseData();
  };

  return (
    <div>
      <div className="my-3">
        <div className="flex justify-between items-center border-t border-b border-gray-300 py-2 overflow-auto">
          <div className="card p-4">
            <div className="flex items-center">
              <div className="icon w-10 h-10 rounded-full bg-gray-100 flex justify-center items-center">
                <CiBadgeDollar size={25} className="text-green-500" />
              </div>
              <div className="data ml-5">
                <div className="text-lg tracking-wider font-semibold">Earnings</div>
                <div className="text-lg">
                  <span className="text-gray-400">total</span>
                  <span className="mx-5 text-green-500">{totalIncome.toFixed(2) ?? 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-300 h-10 mx-5 my-auto"></div>

          <div className="card p-4">
            <div className="flex items-center">
              <div className="icon w-10 h-10 rounded-full bg-gray-100 flex justify-center items-center">
                <CiBadgeDollar size={25} className="text-red-500" />
              </div>
              <div className="data ml-5">
                <div className="text-lg tracking-wider font-semibold">Expense</div>
                <div className="text-lg">
                  <span className="text-gray-400">total</span>
                  <span className="mx-5 text-red-500">{totalExpense.toFixed(2) ?? 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-300 h-10 mx-5 my-auto"></div>

          <div className="card p-4">
            <div className="flex items-center">
              <div className="icon w-10 h-10 rounded-full bg-gray-100 flex justify-center items-center">
                <MdOutlineBalance size={25} className="text-blue-500" />
              </div>
              <div className="data ml-5">
                <div className="text-lg tracking-wider font-semibold">Balance</div>
                <div className="text-lg">
                  <span className="text-gray-400">total</span>
                  <span className="mx-5 text-blue-500">{(totalIncome - totalExpense).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-300 h-10 mx-5 my-auto"></div>

          <div className="card p-4">
            <div className="flex items-center">
              <div className="icon w-10 h-10 rounded-full bg-gray-100 flex justify-center items-center">
                <LuHandCoins size={25} className="text-amber-500" />
              </div>
              <div className="data ml-5">
                <div className="text-lg tracking-wider font-semibold">Budget</div>
                <div className="text-lg">
                  <span className="text-gray-400">total</span>
                  <span className="mx-5 text-amber-500">{userBudget.toFixed(2) ?? 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-300 h-10 mx-5 my-auto"></div>

          <div className="card p-4">
            <div className="flex items-center">
              <div className="icon w-10 h-10 rounded-full bg-gray-100 flex justify-center items-center">
                <GiPiggyBank size={25} className="text-purple-500" />
              </div>
              <div className="data ml-5">
                <div className="text-lg tracking-wider font-semibold">Savings</div>
                <div className="text-lg">
                  <span className="text-gray-400">total</span>
                  <span className="mx-5 text-purple-500">{(totalIncome - totalExpense - userBudget).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          {/* card flex ends */}
        </div>

        {/* CHARTS START HERE */}
        <div className="conatiner">
          <div className="grid lg:grid-cols-2 lg:gap-2">
            <div className="chart1">
              <LineChart data={incomeCategory} />
            </div>
            <div className="chart2">
              <BarChart data={incomeCategory} />
            </div>
          </div>
        </div>

        {/* Table start here */}
        <div className="container">
          <div className="grid lg:grid-cols-2 lg:gap-2">
            {/* EARNING TABLE */}
            <div className="earning-table">
              <div className="w-full mx-auto md:p-4">
                <div className="header py-2 flex justify-between items-center">
                  <div className="title text-xl font-semibold">Income & Earnings</div>
                  <div className="add-btn">
                    <button
                      className="bg-green-200 font-medium hover:bg-green-300 px-3 text-sm rounded-lg"
                      onClick={() => {
                        setShowUCM(!showUCM), setType("income");
                      }}
                    >
                      add income
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto max-h-[200px]">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">#</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">Category</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">Value</th>
                        <th className="px-3 py-2 text-center font-semibold text-gray-600">Edit</th>
                        <th className="px-3 py-2 text-center font-semibold text-gray-600">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {incomeCategory &&
                        incomeCategory.map((item, index) => (
                          <tr key={index}>
                            <td className="px-3 py-3">{index + 1}</td>
                            <td className="px-3 py-3">{item.name}</td>
                            <td className="px-3 py-3">{item.amount}</td>
                            <td className="px-3 py-3 text-center">
                              <button
                                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200"
                                onClick={() => {
                                  setShowUEM(!showUEM);
                                  setType("income");
                                  setCategoryId(item.categoryId);
                                  setCategoryName(item.name);
                                  setPrevAmount(item.amount);
                                }}
                              >
                                <CiEdit size={16} className="text-blue-600" />
                              </button>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                className="p-2 rounded-full bg-red-100 hover:bg-red-200"
                                onClick={() => deleteUserCategory("income", item.categoryId)}
                              >
                                <CiTrash size={16} className="text-red-600" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <Pagination
                  totalEntries={50}
                  rowsPerPage={5}
                  onPageChange={(page) => setCurrentIncomePage(page * 5 - 5)}
                />
              </div>
            </div>

            {/* EXPENSE TABLE */}
            <div className="expense-table">
              <div className="w-full mx-auto md:p-4">
                <div className="header py-2 flex justify-between items-center">
                  <div className="title text-xl font-semibold">Expenses & Payables</div>
                  <div className="add-btn">
                    <button
                      className="bg-red-200 font-medium hover:bg-red-300 px-3 text-sm rounded-lg"
                      onClick={() => {
                        setShowUCM(!showUCM), setType("expense");
                      }}
                    >
                      add expense
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto max-h-[200px]">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">#</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">Category</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">Value</th>
                        <th className="px-3 py-2 text-center font-semibold text-gray-600">Edit</th>
                        <th className="px-3 py-2 text-center font-semibold text-gray-600">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {expenseCategory &&
                        expenseCategory.map((item, index) => (
                          <tr key={index}>
                            <td className="px-3 py-3">{index + 1}</td>
                            <td className="px-3 py-3">{item.name}</td>
                            <td className="px-3 py-3">{item.amount}</td>
                            <td className="px-3 py-3 text-center">
                              <button
                                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200"
                                onClick={() => {
                                  setShowUEM(!showUEM);
                                  setType("expense");
                                  setCategoryId(item.categoryId);
                                  setCategoryName(item.name);
                                  setPrevAmount(item.amount);
                                }}
                              >
                                <CiEdit size={16} className="text-blue-600" />
                              </button>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                className="p-2 rounded-full bg-red-100 hover:bg-red-200"
                                onClick={() => deleteUserCategory("expense", item.categoryId)}
                              >
                                <CiTrash size={16} className="text-red-600" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <Pagination
                  totalEntries={50}
                  rowsPerPage={5}
                  onPageChange={(page) => setCurrentExpensePage(page * 5 - 5)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* USER CATEGORY MODAL */}
      <UserCategoryModal
        isOpen={showUCM}
        onClose={() => {
          setShowUCM(false);
          fetchIncomeData();
          fetchExpenseData();
        }}
        type={type}
      />

      {/* USER EDIT MODAL */}
      <UserEditModal
        isOpen={showUEM}
        onClose={() => {
          setShowUEM(false);
          fetchIncomeData();
          fetchExpenseData();
        }}
        type={type}
        categoryId={categoryId}
        categoryName={categoryName}
        prevAmt={prevAmount}
      />
    </div>
  );
}
