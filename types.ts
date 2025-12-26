
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Category {
  RANKS = 'RANKS',
  COINS = 'COINS',
  KEYS = 'CASES',
  UNBAN = 'UNBAN'
}

export interface Notification {
  id: string;
  userId: string; // 'ALL', 'ADMIN', or specific ID
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface Tariff {
  id: string;
  name: string;
  price: number;
  duration: string;
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  role: UserRole;
  balance: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  image: string;
  active: boolean;
  tariffs: Tariff[];
}

export interface Payment {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  receiptUrl: string;
  status: PaymentStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  userNickname: string;
  contactInfo: string; // TG Username or Phone
  productId: string;
  productName: string;
  tariffName: string;
  price: number;
  status: OrderStatus;
  createdAt: string;
}

export interface SystemConfig {
  siteName: string;
  cardDetails: string;
  telegramSupport: string;
  serverIp: string;
  maintenanceMode: boolean;
  stats: {
    online: number;
    maxPlayers: number;
    cpu: number;
    dBm?: number;
    ram: number;
    ping: number;
  }
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface Broadcast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
}