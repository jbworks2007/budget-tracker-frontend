import axiosInstance from "@/utils/axios";

export async function modifyUserExpense(_id: string, categoryId: string, amount: number) {
  try {
    const reqBody = {
      userId: _id,
      categoryId: categoryId,
      newAmount: amount,
    };
    const { data } = await axiosInstance.post("/ai/user-expense/modify-user-expense", reqBody);
    return data;
  } catch (error: any) {
    return error;
  }
}
