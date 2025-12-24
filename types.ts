
export enum OrderStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  SHIPPED = 'Shipped',
  COMPLETED = 'Completed'
}

export type PaymentMethod = 'Wallet' | 'COD';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  isAdmin: boolean;
  avatar?: string;
  balance: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  reviewsCount: number;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  date: string;
  isRated?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}
