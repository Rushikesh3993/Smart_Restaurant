export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'restaurant';
  createdAt: string;
  updatedAt: string;
} 