import axiosInstance from "@/utils/axios";

export async function getUserExpense(_id: string, startIndex: number, rowsPerPage: number) {
  try {
    const reqBody = {
      userId: _id,
      startIndex: startIndex,
      rowsPerPage: rowsPerPage,
    };
    const { data } = await axiosInstance.post("/ai/user-expense/get-user-expense", reqBody);
    return data;
  } catch (error: any) {
    return error;
  }
}
