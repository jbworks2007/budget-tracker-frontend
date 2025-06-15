import axiosInstance from "@/utils/axios";

export async function getUserIncome(_id: string, startIndex: number, rowsPerPage: number) {
  try {
    const reqBody = {
      userId: _id,
      startIndex: startIndex,
      rowsPerPage: rowsPerPage,
    };
    const { data } = await axiosInstance.post("/ai/user-income/get-user-income", reqBody);
    return data;
  } catch (error: any) {
    return error;
  }
}
