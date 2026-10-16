import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Product, Order, SiteSettings, AdminUser, OrderStatus } from '../types/index.js';

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  settings: SiteSettings;
  admins: AdminUser[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const defaultProducts: Product[] = [
  {
    id: 'prod-rotno-combo',
    name: 'পুরুষ রত্ন হালুয়া + পাওয়ার অয়েল (Ginseng Power Oil)',
    subtitle: 'প্রিমিয়াম ভেষজ ফর্মুলা কম্বো প্যাক — হালুয়া ৫০০ গ্রাম + পাওয়ার অয়েল ১০০ মিলি',
    regularPrice: 1990,
    offerPrice: 1290,
    description: 'শতভাগ খাঁটি ও প্রাকৃতিক উপাদানের সমন্বয়ে প্রস্তুত হেলথ গুড পুরুষ রত্ন হালুয়া (৫০০ গ্রাম) এবং অরিজিনাল জিনসিং পাওয়ার অয়েল। প্রাত্যহিক ক্লান্তি দূর করে শারীরিক শক্তি, সতেজতা ও আত্মবিশ্বাস ফিরিয়ে আনার এক নির্ভরযোগ্য হারবাল কম্বো সলিউশন।',
    details: [
      'খাঁটি সুন্দরবনের মধু, জাফরান, শিমুল মূল ও অশ্বগন্ধা সমন্বিত পুষ্টিকর হালুয়া',
      'কালোজিরা, আমলকী, তালমাখনা ও কাতিলা গামের সমৃদ্ধ প্রাকৃতিক পুষ্টি উপাদান',
      'বাহ্যিক ব্যবহারের জন্য প্রস্তুত বিশেষ ভেষজ নির্যাসযুক্ত নাইট কিং ম্যাসাজ অয়েল',
      'সম্পূর্ণ প্রাকৃতিক ফর্মুলা — ক্ষতিকর কেমিক্যাল বা কৃত্রিম স্টিমুলেটিং উপাদান মুক্ত',
      'কোনো পার্শ্বপ্রতিক্রিয়া ছাড়া প্রাকৃতিক শক্তি ও স্ট্যামিনা বৃদ্ধির সহায়ক'
    ],
    usage: [
      'পুরুষ রত্ন হালুয়া: প্রতিদিন রাতে খাবারের ৩০ মিনিট পর ১ চা চামচ পরিমাণ কুসুম গরম দুধ অথবা পানির সাথে সেব্য।',
      'ম্যাসাজ অয়েল: রাতে ঘুমানোর পূর্বে ৪-৫ ফোঁটা অয়েল নিয়ে আলতো হাতে ২-৩ মিনিট হালকা ম্যাসাজ করুন (শুধুমাত্র বাহ্যিক ব্যবহারের জন্য)।',
      'সংরক্ষণ পদ্ধতি: সরাসরি রোদ ও আর্দ্রতা এড়িয়ে ঠাণ্ডা ও ছায়াযুক্ত স্থানে স্বাভাবিক তাপমাত্রায় সংরক্ষণ করুন।'
    ],
    images: [
      '/uploads/purush_rotno_combo.jpg'
    ],
    inStock: true,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const defaultSettings: SiteSettings = {
  brandName: 'পুরুষ রত্ন (Purush Rotno)',
  hotline: '01886338934',
  whatsapp: '01886338934',
  email: 'etishamoni1@gmail.com',
  deliveryDhaka: 70,
  deliveryOutside: 130,
  gtmId: '',
  noticeText: 'সীমিত সময়ের স্পেশাল অফার! ক্যাশ অন হোম ডেলিভারিতে পণ্য বুঝে পেয়ে মূল্য পরিশোধ করুন।',
  guaranteeText: '১০০% খাঁটি ভেষজ উপাদান • পার্সেল চেক করে গ্রহণের সুযোগ • কোনো আগাম পেমেন্ট নেই',
  footerAddress: 'মতিঝিল বাণিজ্যিক এলাকা, ঢাকা-১০০০, বাংলাদেশ',
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.init();
  }

  private init(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all keys exist
        return {
          products: parsed.products || defaultProducts,
          orders: parsed.orders || [],
          settings: { ...defaultSettings, ...(parsed.settings || {}) },
          admins: parsed.admins && parsed.admins.length > 0 ? parsed.admins : this.createDefaultAdmin(),
        };
      } catch (err) {
        console.error('Failed to parse database file, re-initializing:', err);
      }
    }

    const initial: DatabaseSchema = {
      products: defaultProducts,
      orders: [],
      settings: defaultSettings,
      admins: this.createDefaultAdmin(),
    };
    this.saveDirect(initial);
    return initial;
  }

  private createDefaultAdmin(): AdminUser[] {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin123', salt);
    return [
      {
        id: 'admin-1',
        username: 'admin',
        passwordHash: hash,
        createdAt: new Date().toISOString(),
      }
    ];
  }

  private saveDirect(data: DatabaseSchema): void {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  public save(): void {
    this.saveDirect(this.data);
  }

  // --- Products ---
  public getProducts(onlyPublished = false): Product[] {
    if (onlyPublished) {
      return this.data.products.filter(p => p.isPublished);
    }
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const id = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    const now = new Date().toISOString();
    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: now,
    };
    this.save();
    return this.data.products[index];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Orders ---
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.orderNumber === id);
  }

  public createOrder(orderData: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    deliveryLocation: 'dhaka' | 'outside';
    deliveryFee: number;
    customerName: string;
    phone: string;
    address: string;
    notes?: string;
  }): Order {
    const id = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const orderNumber = `PR-${datePrefix}-${randomSuffix}`;
    const totalAmount = (orderData.quantity * orderData.unitPrice) + orderData.deliveryFee;

    const newOrder: Order = {
      id,
      orderNumber,
      productId: orderData.productId,
      productName: orderData.productName,
      quantity: orderData.quantity,
      unitPrice: orderData.unitPrice,
      deliveryLocation: orderData.deliveryLocation,
      deliveryFee: orderData.deliveryFee,
      totalAmount,
      customerName: orderData.customerName,
      phone: orderData.phone,
      address: orderData.address,
      notes: orderData.notes,
      status: 'Pending',
      paymentMethod: 'Cash on Delivery',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  public updateOrderStatus(id: string, status: OrderStatus): Order | null {
    const order = this.data.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.save();
    return order;
  }

  public deleteOrder(id: string): boolean {
    const initialLen = this.data.orders.length;
    this.data.orders = this.data.orders.filter(o => o.id !== id && o.orderNumber !== id);
    if (this.data.orders.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Settings ---
  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
    };
    this.save();
    return this.data.settings;
  }

  // --- Admin ---
  public getAdminByUsername(username: string): AdminUser | undefined {
    return this.data.admins.find(a => a.username.toLowerCase() === username.toLowerCase());
  }

  public updateAdminCredentials(id: string, newUsername?: string, newPassword?: string): boolean {
    const admin = this.data.admins.find(a => a.id === id);
    if (!admin) return false;
    if (newUsername && newUsername.trim()) {
      admin.username = newUsername.trim();
    }
    if (newPassword && newPassword.trim()) {
      admin.passwordHash = bcrypt.hashSync(newPassword.trim(), 10);
    }
    this.save();
    return true;
  }
}

export const db = new Database();
