import axiosInstance from "@/utils/axios";

export async function modifyUserBudget(_id: string, amount: number) {
  const reqBody = {
    userId: _id,
    amount: amount,
  };
  try {
    const { data } = await axiosInstance.post("/ai/user-budget/modify-user-budget", reqBody);
    return data;
  } catch (error: any) {
    return error;
  }
}
