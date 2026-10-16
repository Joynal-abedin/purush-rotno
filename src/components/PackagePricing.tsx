import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, Zap, Sparkles } from 'lucide-react';
import { toBanglaNumber } from '../utils/format.js';

interface PackagePricingProps {
  onSelectPackage: (quantity: number) => void;
  baseOfferPrice: number;
  baseRegularPrice: number;
}

export const PackagePricing: React.FC<PackagePricingProps> = ({
  onSelectPackage,
  baseOfferPrice = 1290,
  baseRegularPrice = 1990,
}) => {
  // Live ticking countdown timer
  const [secondsLeft, setSecondsLeft] = useState<number>(3 * 3600 + 42 * 60 + 15);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 4 * 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const packages = [
    {
      id: '1-combo',
      quantity: 1,
      title: 'পুরুষ রত্ন হালুয়া + পাওয়ার অয়েল',
      subtitle: 'হালুয়া ৫০০ গ্রাম + পাওয়ার অয়েল ১০০ মিলি কম্বো প্যাক',
      price: baseOfferPrice,
      oldPrice: baseRegularPrice,
      badge: '★ স্পেশাল অফার প্যাক',
      popular: true,
      perks: [
        'সারা বাংলাদেশ ফ্রি ডেলিভারি',
        'ক্যাশ অন ডেলিভারি সুবিধা',
        '১০০% খাঁটি ও প্রাকৃতিক ভেষজ উপাদান',
        'পার্সেল চেক করে গ্রহণের সুযোগ'
      ],
    },
  ];

  return (
    <section id="pricing" className="py-12 md:py-20 bg-[#050b08] border-t border-amber-500/20">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-xs text-red-300 font-semibold mb-4 animate-pulse">
            <Zap className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>সীমিত সময়ের জন্য বিশেষ সুযোগ</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-3 font-serif-luxury">
            <span className="text-gold">আজকের বিশেষ অফার</span>
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto mb-6">
            সীমিত সময়ের জন্য — প্রিমিয়াম কম্বো অফারটি লুফে নিন
          </p>

          {/* Countdown timer blocks */}
          <div className="inline-flex items-center gap-2 sm:gap-3">
            {[
              { val: hours, label: 'ঘণ্টা' },
              { val: minutes, label: 'মিনিট' },
              { val: seconds, label: 'সেকেন্ড' },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="bg-card-luxe border-gold rounded-2xl px-4 py-2.5 min-w-[70px] shadow-elegant text-center"
              >
                <div className="text-xl sm:text-2xl font-bold font-mono text-gold">
                  {toBanglaNumber(unit.val)}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">{unit.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                pkg.popular
                  ? 'bg-card-luxe border-2 border-gold shadow-gold-glow scale-[1.03] z-10'
                  : 'bg-card-luxe border border-gold/40 shadow-elegant hover:border-gold'
              }`}
            >
              {/* Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span
                  className={`px-3.5 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wider ${
                    pkg.popular
                      ? 'bg-gold text-stone-950 shadow-gold'
                      : 'bg-black/80 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {pkg.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-serif-luxury mt-2">
                  {pkg.title}
                </h3>
                <p className="text-xs text-stone-400 mt-1 mb-5">
                  {pkg.subtitle}
                </p>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/20 mb-6 text-center">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-gold font-serif-luxury">
                      ৳{toBanglaNumber(pkg.price)}
                    </span>
                    <span className="text-stone-400 line-through text-sm sm:text-base font-serif-luxury">
                      ৳{toBanglaNumber(pkg.oldPrice)}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium block mt-1">
                    ক্যাশ অন ডেলিভারি (পণ্য পেয়ে টাকা দিন)
                  </span>
                </div>

                {/* Perks Checklist */}
                <ul className="space-y-3 text-xs sm:text-sm text-stone-300 mb-6">
                  {pkg.perks.map((perk, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Button */}
              <button
                onClick={() => onSelectPackage(pkg.quantity)}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                  pkg.popular
                    ? 'bg-cta hover:brightness-110 text-white shadow-glow animate-pulse-glow'
                    : 'bg-gold hover:brightness-110 text-stone-950 shadow'
                }`}
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span>এখনই অর্ডার করুন</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
