export interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "manager" | "cashier" | "inventory";
  createdAt: string;
  updatedAt: string;
}