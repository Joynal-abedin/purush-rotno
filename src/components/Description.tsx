import React from 'react';
import { Leaf, Award, HeartPulse, ShoppingBag } from 'lucide-react';
import { Product } from '../types/index.js';
import { toBanglaNumber } from '../utils/format.js';

interface DescriptionProps {
  product: Product;
  onOrderClick: () => void;
}

export const Description: React.FC<DescriptionProps> = ({ product, onOrderClick }) => {
  return (
    <section className="py-10 bg-[#04140e]/70 border-y border-amber-500/15">
      <div className="max-w-4xl mx-auto px-4 text-center">
        
        {/* Section Heading */}
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <Leaf className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
            বিশুদ্ধ ও খাঁটি ভেষজ যত্ন
          </span>
          <Leaf className="w-5 h-5 text-amber-400 transform -scale-x-100" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
          পুরুষ রত্ন হালুয়া ও ম্যাসাজ অয়েলের বিশেষত্ব
        </h2>

        {/* Short, honest description text */}
        <p className="mt-4 text-stone-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
          {product.description}
        </p>

        {/* 3 Concise highlight cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-amber-500/20 backdrop-blur-sm">
            <Award className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="font-semibold text-amber-200 text-sm">খাঁটি প্রাকৃতিক ফর্মুলা</h3>
            <p className="text-stone-300 text-xs mt-1">
              উচ্চমানের ভেষজ উপাদান ও প্রাকৃতিক পুষ্টিগুণে সমৃদ্ধ, যা দৈনন্দিন সুস্থতায় কার্যকর।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/40 border border-amber-500/20 backdrop-blur-sm">
            <HeartPulse className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="font-semibold text-amber-200 text-sm">দ্বৈত কম্বো অ্যাকশন</h3>
            <p className="text-stone-300 text-xs mt-1">
              একসাথে পুষ্টিকর হালুয়া এবং আরামদায়ক এক্সটার্নাল ম্যাসাজ অয়েলের অনন্য মেলবন্ধন।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/40 border border-amber-500/20 backdrop-blur-sm">
            <Leaf className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="font-semibold text-amber-200 text-sm">নিরাপদ ও নির্ভরযোগ্য</h3>
            <p className="text-stone-300 text-xs mt-1">
              কোনো ক্ষতিকর রাসায়নিক বা ভেজাল উপাদান ছাড়া সম্পূর্ণ বিশ্বস্ত উপায়ে প্রস্তুত।
            </p>
          </div>
        </div>

        {/* High Converting Direct CTA Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOrderClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-base sm:text-lg py-3.5 px-8 rounded-xl shadow-xl shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            <span>অর্ডার করুন — মাত্র ৳{toBanglaNumber(product.offerPrice)}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
