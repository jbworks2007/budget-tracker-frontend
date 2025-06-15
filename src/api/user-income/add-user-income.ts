import axiosInstance from "@/utils/axios";

export async function addUserIncome(_id: string, categoryId: string, amount: number) {
  try {
    const reqBody = {
      userId: _id,
      categoryId: categoryId,
      amount: amount,
    };
    const { data } = await axiosInstance.post("/ai/user-income/add-user-income", reqBody);
    console.log("🚀 ~ addUserIncome ~ data:", data);
    return data;
  } catch (error: any) {
    return error;
  }
}
