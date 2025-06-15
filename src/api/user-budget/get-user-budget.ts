import axiosInstance from "@/utils/axios";

export async function getUserBudget(_id: string) {
  try {
    const { data } = await axiosInstance.get(`/ai/user-budget/get-user-budget/${_id}`);
    return data;
  } catch (error: any) {
    return error;
  }
}
