import axiosInstance from "@/utils/axios";

export async function createCategory(categoryName: string) {
  try {
    const { data } = await axiosInstance.post(`/ai/category/create-category`, { name: categoryName });
    return data;
  } catch (error: any) {
    return error;
  }
}
