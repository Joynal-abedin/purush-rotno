import React, { useState } from 'react';
import { X, Search, PackageCheck, AlertCircle, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types/index.js';
import { toBanglaNumber, formatBanglaDate } from '../utils/format.js';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusMap: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  Pending: { label: 'অপেক্ষমাণ (Pending)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: Clock },
  Confirmed: { label: 'নিশ্চিত (Confirmed)', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: CheckCircle2 },
  Processing: { label: 'প্রক্রিয়াধীন (Processing)', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30', icon: PackageCheck },
  Shipped: { label: 'শিপড / ট্রানজিটে (Shipped)', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', icon: Truck },
  Delivered: { label: 'ডেলিভার্ড সম্পন্ন (Delivered)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle2 },
  Cancelled: { label: 'বাতিল (Cancelled)', color: 'text-red-400 bg-red-500/10 border-red-500/30', icon: XCircle },
};

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setSearchedOrder(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.order) {
        setError('উক্ত অর্ডার নম্বর দিয়ে কোনো তথ্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক অর্ডার আইডি দিন।');
      } else {
        setSearchedOrder(data.order);
      }
    } catch {
      setError('তথ্য লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#062319] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-lg hover:bg-emerald-900/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl sm:text-2xl font-bold text-white font-serif-luxury mb-2">
          অর্ডার স্ট্যাটাস অনুসন্ধান
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 mb-6">
          আপনার অর্ডার কনফার্মেশনের সময় প্রাপ্ত অর্ডার আইডি (যেমন: PR-2610-xxxx) লিখুন।
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="অর্ডার আইডি দিন..."
            className="flex-1 bg-emerald-950/60 border border-emerald-700/60 focus:border-amber-400 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'খোঁজা হচ্ছে...' : 'অনুসন্ধান'}</span>
          </button>
        </form>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {searchedOrder && (
          <div className="p-4 rounded-xl bg-black/50 border border-amber-500/20 space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-900/50">
              <span className="text-stone-400">অর্ডার নম্বর:</span>
              <span className="font-mono font-bold text-amber-300">{searchedOrder.orderNumber}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-emerald-900/50">
              <span className="text-stone-400">বর্তমান স্ট্যাটাস:</span>
              {(() => {
                const s = statusMap[searchedOrder.status] || statusMap.Pending;
                const Icon = s.icon;
                return (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${s.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {s.label}
                  </span>
                );
              })()}
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-emerald-900/50">
              <span className="text-stone-400">গ্রাহকের নাম:</span>
              <span className="font-medium text-white">{searchedOrder.customerName}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-emerald-900/50">
              <span className="text-stone-400">পণ্য:</span>
              <span className="font-medium text-amber-300">{searchedOrder.productName} ({toBanglaNumber(searchedOrder.quantity)} টি)</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-emerald-900/50">
              <span className="text-stone-400">সর্বমোট প্রদেয় বিল:</span>
              <span className="font-bold text-white">৳{toBanglaNumber(searchedOrder.totalAmount)}</span>
            </div>

            <div className="flex items-center justify-between text-stone-400 text-[11px]">
              <span>অর্ডারের সময়:</span>
              <span>{formatBanglaDate(searchedOrder.createdAt)}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
