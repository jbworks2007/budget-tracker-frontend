import axiosInstance from "@/utils/axios";

export async function addUserExpense(_id: string, categoryId: string, amount: number) {
  try {
    const reqBody = {
      userId: _id,
      categoryId: categoryId,
      amount: amount,
    };
    const { data } = await axiosInstance.post("/ai/user-expense/add-user-expense", reqBody);
    console.log("🚀 ~ addUserIExpense ~ data:", data);
    return data;
  } catch (error: any) {
    return error;
  }
}
