export interface Product {
  id: string;
  name: string;
  subtitle: string;
  regularPrice: number;
  offerPrice: number;
  description: string;
  details: string[];
  usage: string[];
  images: string[];
  inStock: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  deliveryLocation: 'dhaka' | 'outside';
  deliveryFee: number;
  totalAmount: number;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  status: OrderStatus;
  paymentMethod: 'Cash on Delivery';
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  brandName: string;
  hotline: string;
  whatsapp: string;
  email?: string;
  deliveryDhaka: number;
  deliveryOutside: number;
  gtmId: string;
  noticeText: string;
  guaranteeText: string;
  footerAddress: string;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

export interface CreateOrderPayload {
  productId: string;
  quantity: number;
  deliveryLocation: 'dhaka' | 'outside';
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
}
