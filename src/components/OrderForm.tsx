import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  Phone,
  MapPin,
  User,
  Check,
  Copy,
  Printer,
  MessageCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, SiteSettings, Order } from '../types/index.js';
import { toBanglaNumber } from '../utils/format.js';
import { trackBeginCheckout, trackPurchase } from '../utils/gtm.js';

interface OrderFormProps {
  product: Product;
  settings: SiteSettings | null;
}

export const OrderForm: React.FC<OrderFormProps> = ({ product, settings }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [deliveryLocation, setDeliveryLocation] = useState<'dhaka' | 'outside'>('dhaka');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [hasCopiedId, setHasCopiedId] = useState<boolean>(false);
  const [hasTriggeredCheckout, setHasTriggeredCheckout] = useState<boolean>(false);

  const feeDhaka = settings?.deliveryDhaka ?? 70;
  const feeOutside = settings?.deliveryOutside ?? 130;
  const deliveryFee = quantity >= 2 ? 0 : (deliveryLocation === 'dhaka' ? feeDhaka : feeOutside);

  const itemTotal = quantity * product.offerPrice;
  const grandTotal = itemTotal + deliveryFee;

  const handleInteraction = () => {
    if (!hasTriggeredCheckout) {
      setHasTriggeredCheckout(true);
      trackBeginCheckout(product, quantity, grandTotal);
    }
  };

  const validatePhone = (num: string): boolean => {
    const cleaned = num.trim().replace(/[\s-]/g, '');
    const banglaRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    return banglaRegex.test(cleaned);
  };

  // Keyboard navigation: Backspace to reset/clear or step back when empty
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = document.activeElement;
      if (e.key === 'Backspace' && !createdOrder) {
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
          if (target.value === '' && address === '' && phone === '' && customerName === '') {
            // All empty, reset quantity to 1
            setQuantity(1);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createdOrder, address, phone, customerName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);
    handleInteraction();

    if (!customerName.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }

    if (!phone.trim() || !validatePhone(phone)) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 018XXXXXXXX)।');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage('অনুগ্রহ করে আপনার বিস্তারিত ডেলিভারি ঠিকানা দিন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          deliveryLocation,
          customerName: customerName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          notes: notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'অর্ডার সম্পন্ন হতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
      }

      const order: Order = data.order;
      setCreatedOrder(order);
      trackPurchase(order);

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#10B981', '#F59E0B', '#34D399'],
        });
      } catch {}
    } catch (err: any) {
      setErrorMessage(err.message || 'নেটওয়ার্ক সমস্যা। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyOrderNumber = () => {
    if (!createdOrder) return;
    navigator.clipboard.writeText(createdOrder.orderNumber);
    setHasCopiedId(true);
    setTimeout(() => setHasCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // SUCCESS INVOICE (Compact)
  if (createdOrder) {
    return (
      <section id="order-form" className="py-8 sm:py-10">
        <div className="max-w-xl mx-auto px-4">
          <div className="p-5 sm:p-7 rounded-3xl bg-[#062319] border-2 border-gold shadow-2xl text-center">
            
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-emerald-400 stroke-[3]" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-luxury">
              ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-emerald-300">
              আমাদের প্রতিনিধি দ্রুত ফোন করে আপনার অর্ডারটি কনফার্ম করবেন।
            </p>

            <div className="mt-4 p-3 rounded-xl bg-black/60 border border-gold flex items-center justify-between gap-3 text-left">
              <div>
                <span className="text-[11px] text-stone-400 block">অর্ডার আইডি:</span>
                <span className="font-mono font-bold text-base text-gold">
                  {createdOrder.orderNumber}
                </span>
              </div>
              <button
                onClick={copyOrderNumber}
                className="flex items-center gap-1.5 text-xs text-gold hover:text-white py-1 px-2.5 rounded-lg bg-black/70 border border-amber-500/40 transition cursor-pointer"
              >
                {hasCopiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedId ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>

            <div className="mt-4 text-left border border-emerald-900/60 rounded-xl p-3 bg-emerald-950/30 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-emerald-900/40 text-stone-300">
                <span>গ্রাহকের নাম:</span>
                <span className="font-medium text-white">{createdOrder.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-900/40 text-stone-300">
                <span>মোবাইল নম্বর:</span>
                <span className="font-medium text-white font-mono">{createdOrder.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-900/40 text-stone-300">
                <span>ডেলিভারি ঠিকানা:</span>
                <span className="font-medium text-white text-right max-w-[200px] truncate">{createdOrder.address}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-900/40 text-stone-300">
                <span>প্যাকেজ:</span>
                <span className="font-medium text-gold">{toBanglaNumber(createdOrder.quantity)} টি কম্বো প্যাক</span>
              </div>
              <div className="flex justify-between py-1.5 text-sm font-bold text-gold border-t border-amber-500/30">
                <span>সর্বমোট বিল (ক্যাশ অন ডেলিভারি):</span>
                <span>৳{toBanglaNumber(createdOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <a
                href={`https://wa.me/88${(settings?.whatsapp || '01886338934').replace(/[\s-]/g, '')}?text=${encodeURIComponent(`হ্যালো, আমি অর্ডার দিয়েছি। আমার অর্ডার নম্বর: ${createdOrder.orderNumber}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold py-2 px-3.5 rounded-xl transition text-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                <span>হোয়াটসঅ্যাপ মেসেজ</span>
              </a>

              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 py-2 px-3 rounded-xl transition text-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট / সেভ</span>
              </button>

              <button
                onClick={() => {
                  setCreatedOrder(null);
                  setCustomerName('');
                  setPhone('');
                  setAddress('');
                  setNotes('');
                  setQuantity(1);
                }}
                className="flex items-center justify-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 py-2 px-3.5 rounded-xl transition text-xs cursor-pointer"
              >
                <span>নতুন অর্ডার</span>
              </button>
            </div>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="order-form" className="py-6 sm:py-8 bg-[#04140e]/95 scroll-mt-6">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Compact, Clean Order Card */}
        <div className="p-4 sm:p-6 rounded-3xl bg-card-luxe border-2 border-gold shadow-elegant">
          
          {/* Header Row: Title & Hotline pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-amber-500/20">
            <div>
              <div className="flex items-center gap-1.5 text-gold text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 fill-gold" />
                <span>দ্রুত ক্যাশ অন ডেলিভারি অর্ডার</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-luxury">
                অর্ডার ফর্ম (সহজ ও দ্রুত)
              </h2>
            </div>
            
            <a
              href={`tel:${settings?.hotline || '01886338934'}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-semibold self-start sm:self-auto transition cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>ফোনে অর্ডার: {settings?.hotline || '01886338934'}</span>
            </a>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-3 p-3 rounded-xl bg-red-950/70 border border-red-500/50 flex items-center gap-2 text-red-200 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Product Combo Visual Summary */}
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/40 border border-amber-500/25">
              <img
                src={product.images?.[0] || '/uploads/purush_rotno_combo.jpg'}
                alt={product.name}
                className="w-12 h-16 rounded-xl object-contain bg-black/60 border border-amber-500/40 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{product.name}</div>
                <div className="text-[11px] text-amber-300">হালুয়া ৫০০ গ্রাম + পাওয়ার অয়েল কম্বো প্যাক</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-stone-400 line-through">৳{toBanglaNumber(product.regularPrice)}</div>
                <div className="text-sm font-bold text-gold">৳{toBanglaNumber(product.offerPrice)}</div>
              </div>
            </div>

            {/* 1. Compact Package Selector Tabs (1 Row) */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-gold mb-1.5">
                <span>১. প্যাকেজ নির্বাচন করুন:</span>
                <span className="text-[11px] text-emerald-400 font-normal">২+ প্যাকেজে ফ্রি ডেলিভারি</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { num: 1, name: '১টি কম্বো', sub: '১ হালুয়া + ১ তেল', price: product.offerPrice, badge: 'রেগুলার' },
                  { num: 2, name: '২টি কম্বো', sub: '২ হালুয়া + ২ তেল', price: product.offerPrice * 2, badge: 'জনপ্রিয় ★' },
                  { num: 3, name: '৩টি কম্বো', sub: '৩ মাসের সম্পূর্ণ কোর্স', price: product.offerPrice * 3, badge: 'মেগা অফার' },
                ].map(({ num, name, sub, price, badge }) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setQuantity(num);
                      handleInteraction();
                    }}
                    className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between relative ${
                      quantity === num
                        ? 'border-gold bg-amber-500/20 shadow-gold scale-[1.01]'
                        : 'border-amber-500/20 bg-black/40 hover:border-gold/40 text-stone-300'
                    }`}
                  >
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/70 text-amber-300 font-semibold mb-0.5">
                      {badge}
                    </span>
                    <span className="font-bold text-white text-xs sm:text-sm">
                      {name}
                    </span>
                    <span className="text-[10px] text-stone-400 hidden sm:block truncate max-w-full">
                      {sub}
                    </span>
                    <span className="text-xs font-bold text-gold font-serif-luxury mt-1">
                      ৳{toBanglaNumber(price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Compact Delivery Location Pills (1 Row) */}
            <div>
              <label className="block text-xs font-semibold text-gold mb-1.5">
                ২. ডেলিভারি এলাকা:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryLocation('dhaka');
                    handleInteraction();
                  }}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between text-xs ${
                    deliveryLocation === 'dhaka'
                      ? 'border-gold bg-amber-500/20 shadow-gold'
                      : 'border-amber-500/20 bg-black/40 hover:border-gold/30 text-stone-300'
                  }`}
                >
                  <div>
                    <span className="font-semibold text-white block">ঢাকা সিটির ভেতরে</span>
                    <span className="text-[10px] text-stone-400">
                      চার্জ: {quantity >= 2 ? <strong className="text-emerald-400 font-bold">ফ্রি</strong> : `৳${toBanglaNumber(feeDhaka)}`}
                    </span>
                  </div>
                  {deliveryLocation === 'dhaka' && <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryLocation('outside');
                    handleInteraction();
                  }}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between text-xs ${
                    deliveryLocation === 'outside'
                      ? 'border-gold bg-amber-500/20 shadow-gold'
                      : 'border-amber-500/20 bg-black/40 hover:border-gold/30 text-stone-300'
                  }`}
                >
                  <div>
                    <span className="font-semibold text-white block">ঢাকা সিটির বাইরে</span>
                    <span className="text-[10px] text-stone-400">
                      চার্জ: {quantity >= 2 ? <strong className="text-emerald-400 font-bold">ফ্রি</strong> : `৳${toBanglaNumber(feeOutside)}`}
                    </span>
                  </div>
                  {deliveryLocation === 'outside' && <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />}
                </button>
              </div>
            </div>

            {/* 3. Compact Customer Information Inputs */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gold">
                ৩. আপনার ঠিকানা ও ফোন নম্বর দিন:
              </label>

              {/* Name and Phone in 2-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="আপনার নাম লিখুন *"
                      className="w-full bg-black/60 border border-amber-500/30 focus:border-gold rounded-xl py-2 pl-9 pr-3 text-white text-xs sm:text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="মোবাইল নম্বর (১১ ডিজিট) *"
                      className="w-full bg-black/60 border border-amber-500/30 focus:border-gold rounded-xl py-2 pl-9 pr-3 text-white text-xs sm:text-sm outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Full Address */}
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড, এলাকা, থানা ও জেলা) *"
                  className="w-full bg-black/60 border border-amber-500/30 focus:border-gold rounded-xl py-2 pl-9 pr-3 text-white text-xs sm:text-sm outline-none resize-none"
                />
              </div>
            </div>

            {/* Compact Live Price Bar */}
            <div className="p-2.5 rounded-xl bg-black/70 border border-amber-500/30 flex items-center justify-between text-xs">
              <div className="text-stone-300">
                <span>প্যাকেজ: <strong className="text-white">{toBanglaNumber(quantity)} টি</strong></span>
                <span className="mx-1 text-stone-600">•</span>
                <span>ডেলিভারি: <strong className={quantity >= 2 ? 'text-emerald-400' : 'text-stone-200'}>
                  {quantity >= 2 ? 'ফ্রি' : `৳${toBanglaNumber(deliveryFee)}`}
                </strong></span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-stone-400 mr-1.5">সর্বমোট বিল:</span>
                <span className="text-base sm:text-lg font-bold text-gold font-serif-luxury">
                  ৳{toBanglaNumber(grandTotal)}
                </span>
              </div>
            </div>

            {/* Main Compact High-Converting Order CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-cta hover:brightness-110 text-white font-bold py-3.5 px-6 rounded-2xl shadow-glow animate-pulse-glow flex items-center justify-center gap-2 text-base transition cursor-pointer disabled:opacity-75 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>অর্ডার প্রসেসিং হচ্ছে...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                  <span>অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি ৳{toBanglaNumber(grandTotal)})</span>
                </>
              )}
            </button>

            {/* Bottom Trust Note */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-stone-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>কোনো অগ্রিম টাকা নেই</span>
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-gold" />
                <span>পণ্য দেখে মূল্য পরিশোধ</span>
              </span>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};
