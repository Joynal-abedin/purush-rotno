import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Sparkles, ShoppingBag, Truck } from 'lucide-react';
import { Product } from '../types/index.js';
import { toBanglaNumber } from '../utils/format.js';

interface DetailsUsageProps {
  product: Product;
  onOrderClick: () => void;
}

export const DetailsUsage: React.FC<DetailsUsageProps> = ({ product, onOrderClick }) => {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Grid: 2 columns - Left: Product Details, Right: Usage Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column: Product Details & Ingredients */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#062319] to-[#04140e] border border-amber-500/25 shadow-xl">
            <div className="flex items-center gap-2.5 mb-5">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl sm:text-2xl font-bold text-amber-300 font-serif-luxury">
                উপাদান ও পণ্যের বিস্তারিত
              </h3>
            </div>

            <p className="text-sm text-stone-300 mb-6 leading-relaxed">
              পুরুষ রত্ন কম্বো প্যাকটি বহু বছর ধরে প্রচলিত প্রাকৃতিক আয়ুর্বেদিক ও ইউনানী উপাদানের সমন্বয়ে তৈরি। এতে রয়েছে শরীরের প্রাকৃতিক বল ফিরিয়ে আনতে প্রয়োজনীয় পুষ্টি।
            </p>

            <ul className="space-y-3.5">
              {product.details?.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-stone-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-5 border-t border-emerald-900/50 flex items-center justify-between text-xs text-amber-400/80">
              <span>হালুয়া নিট ওজন: ৫০০ গ্রাম</span>
              <span>পাওয়ার অয়েল: জিনসিং ফর্মুলা</span>
            </div>
          </div>

          {/* Right Column: Usage Instructions & Cautions */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#062319] to-[#04140e] border border-amber-500/25 shadow-xl">
            <div className="flex items-center gap-2.5 mb-5">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl sm:text-2xl font-bold text-amber-300 font-serif-luxury">
                ব্যবহারের সঠিক নিয়মাবলী
              </h3>
            </div>

            <div className="space-y-4">
              {product.usage?.map((rule, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-700/20">
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1">
                    নির্দেশনা {idx + 1}
                  </div>
                  <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
                    {rule}
                  </p>
                </div>
              ))}
            </div>

            {/* Caution advisory */}
            <div className="mt-6 p-4 rounded-xl bg-amber-950/30 border border-amber-600/30 flex items-start gap-3 text-xs sm:text-sm text-amber-200/90">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300 block mb-0.5">জরুরি সতর্কতা:</span>
                ম্যাসাজ অয়েল শুধুমাত্র বাহ্যিক ব্যবহারের জন্য। কাটা বা ক্ষতস্থানে ব্যবহার করবেন না। যেকোনো বিশেষ শারীরিক অসুস্থতায় চিকিৎসকের পরামর্শ অনুযায়ী সেবন করুন।
              </div>
            </div>

          </div>

        </div>

        {/* High Converting Details Bottom CTA Banner */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#062319] to-emerald-950 border border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 font-semibold text-xs mb-2">
              <Truck className="w-3.5 h-3.5" />
              ক্যাশ অন হোম ডেলিভারি
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-white font-serif-luxury">
              আসল ও খাঁটি কম্বো প্যাকটি এখনই সংগ্রহ করুন
            </h4>
            <p className="text-stone-300 text-xs sm:text-sm mt-1">
              স্টক শেষ হওয়ার আগেই স্পেশাল অফার মূল্যে ৳{toBanglaNumber(product.offerPrice)} এ অর্ডার কনফার্ম করুন
            </p>
          </div>

          <button
            onClick={onOrderClick}
            className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-base sm:text-lg py-3.5 px-8 rounded-xl shadow-xl shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            <span>অর্ডার করুন (৳{toBanglaNumber(product.offerPrice)})</span>
          </button>
        </div>

      </div>
    </section>
  );
};
