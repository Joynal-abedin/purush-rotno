import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'purush-rotno-premium-secret-key-2026';
const TOKEN_COOKIE_NAME = 'admin_token';

export interface AdminPayload {
  id: string;
  username: string;
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

// In-memory rate limiter for login attempts
const loginAttempts: Record<string, { count: number; resetTime: number }> = {};

export function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts[ip];

  if (!record || now > record.resetTime) {
    loginAttempts[ip] = { count: 1, resetTime: now + 15 * 60 * 1000 }; // 15 mins
    return true;
  }

  if (record.count >= 5) {
    return false; // Rate limit exceeded (max 5 tries per 15 mins)
  }

  record.count++;
  return true;
}

export function resetLoginRateLimit(ip: string): void {
  delete loginAttempts[ip];
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  // Check cookie or Authorization Bearer header
  const token = req.cookies?.[TOKEN_COOKIE_NAME] || req.headers.authorization?.replace(/^Bearer\s+/, '');

  if (!token) {
    res.status(401).json({ success: false, message: 'অননুমোদিত প্রবেশাধিকার। অনুগ্রহ করে পুনরায় লগইন করুন।' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ success: false, message: 'সেশন মেয়াদোত্তীর্ণ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।' });
    return;
  }

  (req as any).admin = payload;
  next();
}

export { TOKEN_COOKIE_NAME };
