import axiosInstance from "@/utils/axios";

export async function getAllCategory() {
  try {
    const { data } = await axiosInstance.get(`/ai/category/get-all-category`);
    return data;
  } catch (error: any) {
    return error;
  }
}
