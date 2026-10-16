import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Truck,
  Phone,
  User,
  MapPin,
  Check,
  Copy,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, SiteSettings, Order } from '../types/index.js';
import { toBanglaNumber } from '../utils/format.js';
import { trackPurchase } from '../utils/gtm.js';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  settings: SiteSettings | null;
  initialQuantity?: number;
}

type ModalStep = 1 | 2 | 3; // 1: Package Selection, 2: Customer Details, 3: Processing & Review

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  product,
  settings,
  initialQuantity = 1,
}) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>(1);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [deliveryLocation, setDeliveryLocation] = useState<'dhaka' | 'outside'>('dhaka');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [hasCopiedId, setHasCopiedId] = useState<boolean>(false);

  // Sync initialQuantity
  useEffect(() => {
    if (initialQuantity) {
      setQuantity(initialQuantity);
    }
  }, [initialQuantity]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setCreatedOrder(null);
      setErrorMessage(null);
      setIsSubmitting(false);
      setProcessingStage('');

      // Push history state so browser Back button navigates step-by-step
      try {
        window.history.pushState({ modal: 'order', step: 1 }, '');
      } catch {}
    }
  }, [isOpen]);

  // Step-by-Step Back Navigation Function
  const handleGoBack = () => {
    setErrorMessage(null);
    if (currentStep === 3) {
      setCurrentStep(2);
      try {
        window.history.pushState({ modal: 'order', step: 2 }, '');
      } catch {}
    } else if (currentStep === 2) {
      setCurrentStep(1);
      try {
        window.history.pushState({ modal: 'order', step: 1 }, '');
      } catch {}
    } else {
      // Step 1: Close modal
      onClose();
    }
  };

  // Listen to browser Back button (popstate)
  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = (e: PopStateEvent) => {
      const state = e.state;
      if (state && state.modal === 'order') {
        setCurrentStep((state.step as ModalStep) || 1);
      } else {
        // Closed or navigated back out of modal
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOpen, onClose]);

  // Keyboard navigation: Backspace & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = document.activeElement;
      const isInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable);

      // If user presses Backspace when not actively typing into a non-empty text input
      if (e.key === 'Backspace') {
        if (!isInput) {
          e.preventDefault();
          handleGoBack();
        } else if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
          // If the field is empty and user presses Backspace, navigate back to previous step
          if (target.value === '') {
            e.preventDefault();
            handleGoBack();
          }
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleGoBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, onClose]);

  if (!isOpen) return null;

  const feeDhaka = settings?.deliveryDhaka ?? 70;
  const feeOutside = settings?.deliveryOutside ?? 130;
  // Free delivery for 2 or 3 combos
  const deliveryFee = quantity >= 2 ? 0 : (deliveryLocation === 'dhaka' ? feeDhaka : feeOutside);

  const itemTotal = quantity * product.offerPrice;
  const grandTotal = itemTotal + deliveryFee;

  const validatePhone = (num: string): boolean => {
    const cleaned = num.trim().replace(/[\s-]/g, '');
    const banglaRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    return banglaRegex.test(cleaned);
  };

  // Advance from Step 1 to Step 2
  const goToStep2 = () => {
    setErrorMessage(null);
    setCurrentStep(2);
    try {
      window.history.pushState({ modal: 'order', step: 2 }, '');
    } catch {}
  };

  // Advance from Step 2 to Step 3 (Review & Processing)
  const goToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার নাম দিন।');
      return;
    }

    if (!phone.trim() || !validatePhone(phone)) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 018XXXXXXXX)।');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage('অনুগ্রহ করে বিস্তারিত ঠিকানা দিন (বাসা, এলাকা, থানা, জেলা)।');
      return;
    }

    setCurrentStep(3);
    try {
      window.history.pushState({ modal: 'order', step: 3 }, '');
    } catch {}
  };

  // Final Order Submission with real-time processing feedback
  const handleFinalSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setProcessingStage('অর্ডার ডেটা যাচাই করা হচ্ছে...');

    try {
      await new Promise((res) => setTimeout(res, 350));
      setProcessingStage('ডাটাবেজে সুরক্ষিতভাবে প্রসেসিং হচ্ছে...');

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
        throw new Error(data.message || 'অর্ডার সম্পন্ন হতে ব্যর্থ হয়েছে।');
      }

      setProcessingStage('অর্ডার নিশ্চিত হয়েছে!');
      await new Promise((res) => setTimeout(res, 200));

      const order: Order = data.order;
      setCreatedOrder(order);
      trackPurchase(order);

      try {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F3BA25', '#10B981', '#E52E3D', '#34D399'],
        });
      } catch {}
    } catch (err: any) {
      setErrorMessage(err.message || 'নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
      setProcessingStage('');
    }
  };

  const copyOrderNumber = () => {
    if (!createdOrder) return;
    navigator.clipboard.writeText(createdOrder.orderNumber);
    setHasCopiedId(true);
    setTimeout(() => setHasCopiedId(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      tabIndex={-1}
    >
      <div className="relative w-full max-w-[410px] max-h-[92vh] flex flex-col bg-[#07100b] border border-amber-500/40 rounded-2xl p-3 sm:p-4.5 my-auto shadow-2xl text-left animate-fade-in overflow-y-auto">
        
        {/* Top Header Bar: Compact Back Button, Stepper, and Close */}
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-amber-500/20 shrink-0">
          
          {/* Back Button */}
          {!createdOrder ? (
            <button
              type="button"
              onClick={handleGoBack}
              className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-white bg-black/50 hover:bg-black/80 px-2 py-1 rounded-lg border border-amber-500/30 transition-all cursor-pointer active:scale-95"
              title="ব্যাকে যান (Backspace)"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-gold" />
              <span className="font-medium">
                {currentStep === 1 ? 'বন্ধ করুন' : 'ব্যাকে যান'}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>অর্ডার গৃহীত হয়েছে</span>
            </div>
          )}

          {/* Stepper Progress Indicator */}
          {!createdOrder && (
            <div className="flex items-center gap-1 text-[10px] font-semibold text-stone-400">
              <span
                onClick={() => setCurrentStep(1)}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] cursor-pointer transition-colors ${
                  currentStep === 1 ? 'bg-gold text-stone-950 font-bold shadow-sm' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                }`}
                title="স্টেপ ১"
              >
                ১
              </span>
              <span className="text-stone-600 text-[10px]">→</span>
              <span
                onClick={() => {
                  if (currentStep > 2) setCurrentStep(2);
                }}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-colors ${
                  currentStep === 2
                    ? 'bg-gold text-stone-950 font-bold shadow-sm'
                    : currentStep > 2
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30 cursor-pointer'
                    : 'bg-stone-900 text-stone-500'
                }`}
                title="স্টেপ ২"
              >
                ২
              </span>
              <span className="text-stone-600 text-[10px]">→</span>
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 3 ? 'bg-gold text-stone-950 font-bold shadow-sm' : 'bg-stone-900 text-stone-500'
                }`}
                title="স্টেপ ৩"
              >
                ৩
              </span>
            </div>
          )}

          {/* Close Icon Button */}
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg bg-black/40 hover:bg-black/70 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Step Breadcrumb */}
        {!createdOrder && (
          <div className="mb-2.5 bg-black/40 border border-amber-500/15 rounded-lg py-1 px-2.5 flex items-center justify-between text-[10px] text-stone-400 shrink-0">
            <span className={currentStep === 1 ? 'text-gold font-bold' : ''}>১. প্যাকেজ</span>
            <span className="text-stone-600">›</span>
            <span className={currentStep === 2 ? 'text-gold font-bold' : ''}>২. ঠিকানা</span>
            <span className="text-stone-600">›</span>
            <span className={currentStep === 3 ? 'text-gold font-bold' : ''}>৩. কনফার্ম</span>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && (
          <div className="mb-2.5 p-2 rounded-lg bg-red-950/70 border border-red-500/50 flex items-center gap-1.5 text-[11px] text-red-200 animate-shake shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* SUCCESS INVOICE VIEW */}
        {createdOrder ? (
          <div className="text-center py-1">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-2">
              <Check className="w-6 h-6 text-emerald-400 stroke-[3]" />
            </div>

            <h3 className="text-lg font-bold text-white font-serif-luxury">
              অর্ডার সফলভাবে গ্রহণ করা হয়েছে!
            </h3>
            <p className="text-[11px] text-stone-300 mt-0.5">
              আমাদের প্রতিনিধি ফোনে যোগাযোগ করে অর্ডার কনফার্ম করবেন।
            </p>

            <div className="mt-3 p-3 rounded-xl bg-black/60 border border-amber-500/30 text-left space-y-1.5 text-[11px]">
              <div className="flex justify-between pb-1.5 border-b border-amber-500/20">
                <span className="text-stone-400">অর্ডার আইডি:</span>
                <span className="font-mono font-bold text-gold">{createdOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-amber-500/10">
                <span className="text-stone-400">গ্রাহকের নাম:</span>
                <span className="text-white font-medium">{createdOrder.customerName}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-amber-500/10">
                <span className="text-stone-400">মোবাইল নম্বর:</span>
                <span className="text-white font-medium font-mono">{createdOrder.phone}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-amber-500/10">
                <span className="text-stone-400">ঠিকানা:</span>
                <span className="text-white font-medium text-right max-w-[170px] truncate">{createdOrder.address}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-amber-500/10">
                <span className="text-stone-400">প্যাকেজ:</span>
                <span className="text-gold font-medium">{toBanglaNumber(createdOrder.quantity)} টি কম্বো প্যাক</span>
              </div>
              <div className="flex justify-between pt-1.5 text-xs font-bold text-gold">
                <span>সর্বমোট বিল:</span>
                <span>৳{toBanglaNumber(createdOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <a
                href={`https://wa.me/88${(settings?.whatsapp || '01886338934').replace(/[\s-]/g, '')}?text=${encodeURIComponent(`হ্যালো, আমি অর্ডার দিয়েছি। অর্ডার আইডি: ${createdOrder.orderNumber}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold py-2.5 px-3 rounded-xl text-xs transition"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white text-transparent" />
                <span>WhatsApp এ কনফার্ম করুন</span>
              </a>

              <button
                type="button"
                onClick={copyOrderNumber}
                className="w-full flex items-center justify-center gap-1.5 bg-black/50 border border-amber-500/30 text-amber-300 py-2 px-3 rounded-xl text-[11px] hover:bg-black/80 transition cursor-pointer"
              >
                {hasCopiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedId ? 'আইডি কপি হয়েছে' : 'অর্ডার আইডি কপি করুন'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-stone-400 text-[11px] py-1 hover:text-white cursor-pointer"
              >
                উইন্ডো বন্ধ করুন
              </button>
            </div>
          </div>
        ) : currentStep === 1 ? (
          /* STEP 1: COMPACT PACKAGE SELECTION */
          <div className="space-y-2.5">
            {/* Product image and quick badge */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/50 border border-amber-500/25">
              <img
                src={product.images?.[0] || '/uploads/purush_rotno_combo.jpg'}
                alt={product.name}
                className="w-11 h-15 rounded-lg object-contain bg-black/60 border border-amber-500/35 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-bold text-white truncate">{product.name}</h4>
                <p className="text-[10px] text-amber-300">হালুয়া ৫০০ গ্রাম + পাওয়ার অয়েল কম্বো সেট</p>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-gold font-semibold uppercase tracking-wider block">
                ধাপ ১ / ৩ • প্যাকেজ বেছে নিন
              </span>
              <h3 className="text-sm font-bold text-white font-serif-luxury mt-0.5">
                পছন্দের কম্বো প্যাকেজ নির্বাচন করুন
              </h3>
            </div>

            <div className="space-y-1.5">
              {[
                {
                  q: 1,
                  title: '১টি ফুল কম্বো প্যাক',
                  desc: '১টি হালুয়া ৫০০ গ্রাম + ১টি পাওয়ার অয়েল',
                  price: product.offerPrice,
                  badge: '১ মাস কোর্স',
                  isPop: false,
                },
                {
                  q: 2,
                  title: '২টি কম্বো প্যাক (দ্বৈত)',
                  desc: '২টি হালুয়া + ২টি অয়েল • ফ্রি ডেলিভারি',
                  price: product.offerPrice * 2,
                  badge: 'সবচেয়ে জনপ্রিয় ★',
                  isPop: true,
                },
                {
                  q: 3,
                  title: '৩টি কম্বো সেভার প্যাক',
                  desc: '৩টি হালুয়া + ৩টি অয়েল • ফ্রি ডেলিভারি',
                  price: product.offerPrice * 3,
                  badge: 'বেস্ট ভ্যালু',
                  isPop: false,
                },
              ].map((pkg) => (
                <div
                  key={pkg.q}
                  onClick={() => setQuantity(pkg.q)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    quantity === pkg.q
                      ? 'bg-amber-500/20 border-gold shadow-sm text-white'
                      : 'bg-black/40 border-amber-500/20 text-stone-300 hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      quantity === pkg.q ? 'border-gold bg-gold text-stone-950' : 'border-stone-500'
                    }`}>
                      {quantity === pkg.q && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white flex items-center gap-1.5">
                        <span>{pkg.title}</span>
                        {pkg.badge && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                            pkg.isPop ? 'bg-gold text-stone-950' : 'bg-black/60 text-amber-300 border border-amber-500/30'
                          }`}>
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-400">{pkg.desc}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <div className="text-xs sm:text-sm font-bold text-gold font-serif-luxury">
                      ৳{toBanglaNumber(pkg.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal & Free Delivery Badge */}
            <div className="p-2 rounded-lg bg-black/50 border border-amber-500/15 text-[11px] text-stone-300 flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Truck className="w-3.5 h-3.5 shrink-0" />
                <span>{quantity >= 2 ? 'সারাদেশে ফ্রি ডেলিভারি!' : 'ক্যাশ অন ডেলিভারি'}</span>
              </span>
              <span className="font-serif-luxury font-bold text-gold text-xs">
                সাবটোটাল: ৳{toBanglaNumber(itemTotal)}
              </span>
            </div>

            {/* Next Step & Back Action Buttons */}
            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={handleGoBack}
                className="flex-1 bg-black/60 hover:bg-black/90 text-stone-300 font-medium py-2.5 px-2 rounded-xl border border-amber-500/30 text-[11px] transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>বন্ধ করুন</span>
              </button>

              <button
                type="button"
                onClick={goToStep2}
                className="flex-[2] bg-cta hover:brightness-110 text-white font-bold py-2.5 px-3 rounded-xl shadow-glow text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <span>পরবর্তী ধাপ (ঠিকানা)</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>
        ) : currentStep === 2 ? (
          /* STEP 2: COMPACT CUSTOMER & DELIVERY INFORMATION */
          <form onSubmit={goToStep3} className="space-y-2.5">
            <div>
              <span className="text-[10px] text-gold font-semibold uppercase tracking-wider block">
                ধাপ ২ / ৩ • কাস্টমার তথ্য
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white font-serif-luxury mt-0.5">
                আপনার নাম ও ডেলিভারি ঠিকানা লিখুন
              </h3>
            </div>

            {/* Delivery area selector */}
            <div>
              <label className="block text-[10px] font-semibold text-gold uppercase tracking-wider mb-1">
                ডেলিভারি এলাকা:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setDeliveryLocation('dhaka')}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium cursor-pointer transition-all ${
                    deliveryLocation === 'dhaka'
                      ? 'bg-gold text-stone-950 border-gold font-bold shadow'
                      : 'bg-black/40 border-amber-500/20 text-stone-300'
                  }`}
                >
                  ঢাকার ভেতরে ({quantity >= 2 ? 'ফ্রি' : `৳${toBanglaNumber(feeDhaka)}`})
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryLocation('outside')}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium cursor-pointer transition-all ${
                    deliveryLocation === 'outside'
                      ? 'bg-gold text-stone-950 border-gold font-bold shadow'
                      : 'bg-black/40 border-amber-500/20 text-stone-300'
                  }`}
                >
                  ঢাকার বাইরে ({quantity >= 2 ? 'ফ্রি' : `৳${toBanglaNumber(feeOutside)}`})
                </button>
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-[11px] font-medium text-stone-300 mb-0.5">
                আপনার নাম <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-2.5 top-2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                  className="w-full bg-black/60 border border-amber-500/30 focus:border-gold rounded-lg py-1.5 pl-8 pr-2.5 text-white text-[11px] outline-none"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-[11px] font-medium text-stone-300 mb-0.5">
                মোবাইল নম্বর <span className="text-amber-400">* (১১ ডিজিট)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-black/60 border border-amber-500/30 focus:border-gold rounded-lg py-1.5 pl-8 pr-2.5 text-white text-[11px] outline-none font-mono"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[11px] font-medium text-stone-300 mb-0.5">
                সম্পূর্ণ ঠিকানা <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2 w-3.5 h-3.5 text-stone-400" />
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="বাসা/রোড নং, এলাকা, থানা ও জেলা"
                  className="w-full bg-black/60 border border-amber-500/30 focus:border-gold rounded-lg py-1.5 pl-8 pr-2.5 text-white text-[11px] outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Action Buttons: Back + Proceed to Step 3 */}
            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={handleGoBack}
                className="flex-1 bg-black/60 hover:bg-black/90 text-stone-300 font-medium py-2.5 px-2 rounded-xl border border-amber-500/30 text-[11px] transition flex items-center justify-center gap-1 cursor-pointer"
                title="আগের ধাপে ফিরুন (Backspace)"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>আগের ধাপ</span>
              </button>

              <button
                type="submit"
                className="flex-[2] bg-cta hover:brightness-110 text-white font-bold py-2.5 px-3 rounded-xl shadow-glow text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-[0.98]"
              >
                <span>রিভিউ ও কনফার্ম</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </form>
        ) : (
          /* STEP 3: PROCESSING & FINAL CONFIRMATION REVIEW */
          <div className="space-y-2.5">
            <div>
              <span className="text-[10px] text-gold font-semibold uppercase tracking-wider block">
                ধাপ ৩ / ৩ • পর্যালোচনা ও কনফার্ম
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white font-serif-luxury mt-0.5">
                অর্ডার বিবরণী দেখে নিশ্চিত করুন
              </h3>
            </div>

            {/* Summary Review Card */}
            <div className="p-2.5 rounded-xl bg-black/70 border border-amber-500/30 space-y-1.5 text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-amber-500/15 text-stone-300">
                <span>নির্বাচিত প্যাকেজ:</span>
                <span className="font-bold text-white">{toBanglaNumber(quantity)} টি কম্বো প্যাক</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-amber-500/15 text-stone-300">
                <span>গ্রাহকের নাম:</span>
                <span className="font-medium text-white">{customerName}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-amber-500/15 text-stone-300">
                <span>মোবাইল নম্বর:</span>
                <span className="font-medium text-white font-mono">{phone}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-amber-500/15 text-stone-300">
                <span>ডেলিভারি ঠিকানা:</span>
                <span className="font-medium text-white text-right max-w-[170px] truncate">{address}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-amber-500/15 text-stone-300">
                <span>ডেলিভারি চার্জ:</span>
                <span className={quantity >= 2 ? 'text-emerald-400 font-bold' : 'text-white'}>
                  {quantity >= 2 ? 'ফ্রি ডেলিভারি' : `৳${toBanglaNumber(deliveryFee)}`}
                </span>
              </div>
              <div className="flex justify-between pt-1 text-xs font-bold text-gold">
                <span>সর্বমোট প্রদেয় বিল:</span>
                <span className="font-serif-luxury text-sm">৳{toBanglaNumber(grandTotal)}</span>
              </div>
            </div>

            {/* Processing State Banner */}
            {isSubmitting ? (
              <div className="p-2.5 rounded-lg bg-amber-500/15 border border-gold/40 text-[11px] text-amber-200 flex items-center gap-2 animate-pulse">
                <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="font-semibold">{processingStage || 'অর্ডার প্রসেসিং হচ্ছে...'}</span>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-600/30 text-[10px] text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>ক্যাশ অন ডেলিভারি: পার্সেল হাতে পেয়ে টাকা পরিশোধ করবেন।</span>
              </div>
            )}

            {/* Action Buttons: Back + Confirm Submit */}
            <div className="pt-1 flex gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleGoBack}
                className="flex-1 bg-black/60 hover:bg-black/90 text-stone-300 font-medium py-2.5 px-2 rounded-xl border border-amber-500/30 text-[11px] transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                title="তথ্য পরিবর্তন করতে আগের ধাপে ফিরুন (Backspace)"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>আগের ধাপ</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="flex-[2] bg-cta hover:brightness-110 text-white font-bold py-2.5 px-3 rounded-xl shadow-glow text-xs flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-70 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>প্রসেসিং...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>অর্ডার নিশ্চিত করুন (৳{toBanglaNumber(grandTotal)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
