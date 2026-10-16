import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { db } from './src/server/db.js';
import {
  signToken,
  requireAdmin,
  checkLoginRateLimit,
  resetLoginRateLimit,
  TOKEN_COOKIE_NAME,
} from './src/server/auth.js';
import { OrderStatus } from './src/types/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Ensure public/uploads exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage for product images
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanExt = ext || '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `prod-${uniqueSuffix}${cleanExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype.toLowerCase();
    if (allowed.test(ext) && (mime.startsWith('image/') || allowed.test(mime))) {
      cb(null, true);
    } else {
      cb(new Error('শুধুমাত্র ছবি ফাইল (JPG, PNG, WEBP) আপলোড করা যাবে'));
    }
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static file serving for uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// ----------------- PUBLIC API ROUTES -----------------

// Get published products
app.get('/api/products', (_req: Request, res: Response) => {
  try {
    const products = db.getProducts(true);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পণ্য লোড করতে সমস্যা হয়েছে' });
  }
});

// Get single product
app.get('/api/products/:id', (req: Request, res: Response) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product || !product.isPublished) {
      res.status(404).json({ success: false, message: 'পণ্যটি খুঁজে পাওয়া যায়নি' });
      return;
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পণ্য লোড করতে সমস্যা হয়েছে' });
  }
});

// Get site settings
app.get('/api/settings', (_req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'সেটিংস লোড করতে সমস্যা হয়েছে' });
  }
});

// Submit customer order
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { productId, quantity, deliveryLocation, customerName, phone, address, notes } = req.body;

    // Server-side validation
    if (!customerName || !customerName.trim()) {
      res.status(400).json({ success: false, message: 'অনুগ্রহ করে আপনার নাম প্রদান করুন' });
      return;
    }

    if (!phone || !phone.trim()) {
      res.status(400).json({ success: false, message: 'অনুগ্রহ করে মোবাইল নম্বর প্রদান করুন' });
      return;
    }

    // Clean phone number (allow optional +88)
    const cleanedPhone = phone.trim().replace(/[\s-]/g, '');
    const banglaPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    if (!banglaPhoneRegex.test(cleanedPhone)) {
      res.status(400).json({ success: false, message: 'সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)' });
      return;
    }

    if (!address || !address.trim() || address.trim().length < 5) {
      res.status(400).json({ success: false, message: 'অনুগ্রহ করে আপনার পূর্ণ ডেলিভারি ঠিকানা প্রদান করুন' });
      return;
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1 || qty > 50) {
      res.status(400).json({ success: false, message: 'সঠিক পণ্যের পরিমাণ নির্বাচন করুন' });
      return;
    }

    // Snapshot product from DB
    const product = db.getProductById(productId);
    if (!product) {
      res.status(400).json({ success: false, message: 'অর্ডারের জন্য পণ্যটি পাওয়া যায়নি' });
      return;
    }

    if (!product.inStock) {
      res.status(400).json({ success: false, message: 'দুঃখিত, পণ্যটি বর্তমানে স্টকে নেই' });
      return;
    }

    const settings = db.getSettings();
    const isDhaka = deliveryLocation === 'dhaka';
    const deliveryFee = isDhaka ? settings.deliveryDhaka : settings.deliveryOutside;

    const newOrder = db.createOrder({
      productId: product.id,
      productName: product.name,
      quantity: qty,
      unitPrice: product.offerPrice,
      deliveryLocation: isDhaka ? 'dhaka' : 'outside',
      deliveryFee,
      customerName: customerName.trim(),
      phone: cleanedPhone,
      address: address.trim(),
      notes: notes ? String(notes).trim() : undefined,
    });

    res.status(201).json({
      success: true,
      message: 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!',
      order: newOrder,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'অর্ডার প্রক্রিয়াকরণে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' });
  }
});

// Lookup order by ID or orderNumber
app.get('/api/orders/:id', (req: Request, res: Response) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'অর্ডার পাওয়া যায়নি' });
      return;
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'অর্ডার তথ্য লোড করতে সমস্যা হয়েছে' });
  }
});

// ----------------- AUTHENTICATION ROUTES -----------------

// Admin login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (!checkLoginRateLimit(ip)) {
    res.status(429).json({
      success: false,
      message: 'অতিরিক্ত ব্যর্থ চেষ্টার কারণে সাময়িকভাবে লগইন বন্ধ রয়েছে। ১৫ মিনিট পর পুনরায় চেষ্টা করুন।',
    });
    return;
  }

  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ success: false, message: 'ইউজারনেম এবং পাসওয়ার্ড প্রদান করুন' });
    return;
  }

  const admin = db.getAdminByUsername(username);
  if (!admin) {
    res.status(401).json({ success: false, message: 'ভুল ইউজারনেম অথবা পাসওয়ার্ড' });
    return;
  }

  const isMatch = bcrypt.compareSync(password, admin.passwordHash);
  if (!isMatch) {
    res.status(401).json({ success: false, message: 'ভুল ইউজারনেম অথবা পাসওয়ার্ড' });
    return;
  }

  // Reset rate limit on success
  resetLoginRateLimit(ip);

  const token = signToken({ id: admin.id, username: admin.username });

  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    success: true,
    token,
    user: { id: admin.id, username: admin.username },
  });
});

// Admin logout
app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie(TOKEN_COOKIE_NAME);
  res.json({ success: true, message: 'লগআউট সফল হয়েছে' });
});

// Check admin status
app.get('/api/auth/me', requireAdmin, (req: Request, res: Response) => {
  const admin = (req as any).admin;
  res.json({ success: true, user: admin });
});

// Update admin credentials
app.put('/api/auth/profile', requireAdmin, (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const { newUsername, currentPassword, newPassword } = req.body;

    const currentAdmin = db.getAdminByUsername(admin.username);
    if (!currentAdmin) {
      res.status(404).json({ success: false, message: 'এডমিন একাউন্ট পাওয়া যায়নি' });
      return;
    }

    if (currentPassword) {
      const isMatch = bcrypt.compareSync(currentPassword, currentAdmin.passwordHash);
      if (!isMatch) {
        res.status(400).json({ success: false, message: 'বর্তমান পাসওয়ার্ড সঠিক নয়' });
        return;
      }
    } else {
      res.status(400).json({ success: false, message: 'পরিবর্তন নিশ্চিত করতে বর্তমান পাসওয়ার্ড দিন' });
      return;
    }

    db.updateAdminCredentials(admin.id, newUsername, newPassword);
    res.json({ success: true, message: 'এডমিন প্রোফাইল সফলভাবে আপডেট হয়েছে' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে' });
  }
});

// ----------------- PROTECTED ADMIN API ROUTES -----------------

// Get all orders with search, filter, and pagination
app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
  try {
    let orders = db.getOrders();
    const { search, status, page = '1', limit = '10' } = req.query;

    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      orders = orders.filter(
        o =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q)
      );
    }

    const totalOrders = orders.length;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedOrders = orders.slice(startIndex, startIndex + limitNum);

    // Compute stats
    const allOrders = db.getOrders();
    const stats = {
      total: allOrders.length,
      pending: allOrders.filter(o => o.status === 'Pending').length,
      confirmed: allOrders.filter(o => o.status === 'Confirmed').length,
      processing: allOrders.filter(o => o.status === 'Processing').length,
      shipped: allOrders.filter(o => o.status === 'Shipped').length,
      delivered: allOrders.filter(o => o.status === 'Delivered').length,
      cancelled: allOrders.filter(o => o.status === 'Cancelled').length,
      revenue: allOrders
        .filter(o => o.status === 'Delivered' || o.status === 'Confirmed')
        .reduce((sum, o) => sum + o.totalAmount, 0),
    };

    res.json({
      success: true,
      orders: paginatedOrders,
      totalOrders,
      currentPage: pageNum,
      totalPages: Math.ceil(totalOrders / limitNum),
      stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'অর্ডার তালিকা লোড করতে সমস্যা হয়েছে' });
  }
});

// Update order status
app.put('/api/admin/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'অকার্যকর অর্ডার স্ট্যাটাস' });
      return;
    }

    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ success: false, message: 'অর্ডার পাওয়া যায়নি' });
      return;
    }

    res.json({ success: true, order: updated, message: 'অর্ডার স্ট্যাটাস আপডেট হয়েছে' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে' });
  }
});

// Delete order
app.delete('/api/admin/orders/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = db.deleteOrder(req.params.id);
    if (!success) {
      res.status(404).json({ success: false, message: 'অর্ডার পাওয়া যায়নি' });
      return;
    }
    res.json({ success: true, message: 'অর্ডার সফলভাবে মুছে ফেলা হয়েছে' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'অর্ডার মুছতে সমস্যা হয়েছে' });
  }
});

// Admin products list
app.get('/api/admin/products', requireAdmin, (_req: Request, res: Response) => {
  try {
    const products = db.getProducts(false);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পণ্য তালিকা লোড করতে সমস্যা হয়েছে' });
  }
});

// Admin create product
app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
  try {
    const { name, subtitle, regularPrice, offerPrice, description, details, usage, images, inStock, isPublished } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'পণ্যের নাম প্রয়োজন' });
      return;
    }

    const newProd = db.addProduct({
      name: name.trim(),
      subtitle: subtitle ? subtitle.trim() : '',
      regularPrice: Number(regularPrice) || 0,
      offerPrice: Number(offerPrice) || 0,
      description: description ? description.trim() : '',
      details: Array.isArray(details) ? details : [],
      usage: Array.isArray(usage) ? usage : [],
      images: Array.isArray(images) ? images : [],
      inStock: inStock !== false,
      isPublished: isPublished !== false,
    });

    res.status(201).json({ success: true, product: newProd, message: 'নতুন পণ্য সফলভাবে যুক্ত হয়েছে' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পণ্য তৈরিতে সমস্যা হয়েছে' });
  }
});

// Admin update product
app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'পণ্য পাওয়া যায়নি' });
      return;
    }
    res.json({ success: true, product: updated, message: 'পণ্য সফলভাবে আপডেট হয়েছে' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পণ্য আপডেট করতে সমস্যা হয়েছে' });
  }
});

// Admin delete product
app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      res.status(404).json({ success: false, message: 'পণ্য পাওয়া যায়নি' });
      return;
    }
    res.json({ success: true, message: 'পণ্য সফলভাবে মুছে ফেলা হয়েছে' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পণ্য মুছতে সমস্যা হয়েছে' });
  }
});

// Admin update settings
app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated, message: 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'সেটিংস সংরক্ষণে সমস্যা হয়েছে' });
  }
});

// Image upload endpoint
app.post('/api/admin/upload', requireAdmin, upload.single('image') as any, (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'কোনো ছবি আপলোড করা হয়নি' });
      return;
    }
    const filename = req.file.filename;
    const imageUrl = `/uploads/${filename}`;

    // Mirror to dist/uploads if it exists
    const distUploads = path.resolve(process.cwd(), 'dist', 'uploads');
    if (fs.existsSync(distUploads)) {
      try {
        fs.copyFileSync(path.resolve(UPLOADS_DIR, filename), path.resolve(distUploads, filename));
      } catch (err) {
        console.warn('Failed to mirror upload to dist/uploads:', err);
      }
    }

    res.json({ success: true, url: imageUrl, filename, message: 'ছবি সফলভাবে আপলোড হয়েছে' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'ছবি আপলোড ব্যর্থ হয়েছে' });
  }
});

// Delete image endpoint
app.post('/api/admin/delete-image', requireAdmin, (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.startsWith('/uploads/')) {
      res.status(400).json({ success: false, message: 'অবৈধ ছবির পাথ' });
      return;
    }
    const filename = path.basename(url);
    const targetPath = path.resolve(UPLOADS_DIR, filename);
    if (fs.existsSync(targetPath)) {
      try { fs.unlinkSync(targetPath); } catch {}
    }
    const distTarget = path.resolve(process.cwd(), 'dist', 'uploads', filename);
    if (fs.existsSync(distTarget)) {
      try { fs.unlinkSync(distTarget); } catch {}
    }
    res.json({ success: true, message: 'ছবি সফলভাবে মোছা হয়েছে' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'ছবি মোছা সম্ভব হয়নি' });
  }
});

// ----------------- VITE / STATIC INTEGRATION -----------------

async function startServer() {
  if (!isProd) {
    // In development mode, mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve built dist files
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [${isProd ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
