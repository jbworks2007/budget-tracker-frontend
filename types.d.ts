declare global {
  interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    image: string;
  }
  interface UserCategory {
    _id: string;
    categoryId: string;
    name: string;
    amount: number;
  }
}
export {};
