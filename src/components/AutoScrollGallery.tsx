import React, { useRef } from 'react';
import { ShoppingBag, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { toBanglaNumber } from '../utils/format.js';

interface AutoScrollGalleryProps {
  onOrderClick: (qty?: number) => void;
  offerPrice: number;
}

export const AutoScrollGallery: React.FC<AutoScrollGalleryProps> = ({ onOrderClick, offerPrice }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const items = [
    {
      title: 'পুরুষ রত্ন হালুয়া + পাওয়ার অয়েল',
      subtitle: 'হালুয়া ৫০০ গ্রাম + ম্যাসাজ অয়েল ১০০ মিলি',
      image: '/uploads/purush_rotno_combo.jpg',
      badge: '★ স্পেশাল অফার প্যাক',
      qty: 1,
      regularPrice: 1990,
      price: offerPrice,
      savings: 'সাশ্রয় ৳৭০০',
      features: ['সম্পূর্ণ ১ মাসের প্যাকেজ', 'হালুয়া ও তেল একসাথে', 'ক্যাশ অন ডেলিভারি'],
    },
  ];

  // Repeat items to allow seamless infinite loop
  const displayItems = [...items, ...items];

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-10 md:py-16 bg-[#040906] border-y border-amber-500/25 relative overflow-hidden select-none">
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-gold fill-gold animate-pulse" />
              <span className="text-xs font-bold text-gold uppercase tracking-widest">
                লাইভ প্রোডাক্ট স্লাইডার • ডান থেকে বামে
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
              আমাদের সকল প্রিমিয়াম কম্বো ও প্রোডাক্ট
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1">
              যেকোনো প্রোডাক্টে ক্লিক করে সরাসরি স্টেপ-বাই-স্টেপ অর্ডার ফর্ম ওপেন করুন
            </p>
          </div>

          {/* Controls: Manual Scroll Buttons & Direction Hint */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleManualScroll('left')}
              className="p-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-black/90 transition cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleManualScroll('right')}
              className="p-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-black/90 transition cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Seamless Right-to-Left Auto-Scrolling Carousel */}
      <div
        ref={scrollContainerRef}
        className="relative w-full overflow-x-auto no-scrollbar group"
      >
        <div className="animate-marquee hover:[animation-play-state:paused] flex gap-4 sm:gap-6 px-4 py-2">
          {displayItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onOrderClick(item.qty)}
              className="w-72 sm:w-80 shrink-0 rounded-3xl bg-card-luxe border-2 border-amber-500/30 shadow-elegant p-4 flex flex-col justify-between hover:border-gold hover:shadow-gold hover:scale-[1.02] transition-all cursor-pointer group/card"
            >
              <div>
                {/* Product Image Box */}
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-black/60 mb-3 border border-amber-500/25 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-gold text-stone-950 font-bold text-[11px] shadow-md">
                    {item.badge}
                  </div>
                  {item.savings && (
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 font-semibold text-[10px]">
                      {item.savings}
                    </div>
                  )}
                </div>

                {/* Product Title & Subtitle */}
                <h3 className="font-bold text-white text-base font-serif-luxury group-hover/card:text-gold transition-colors truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-1">
                  {item.subtitle}
                </p>

                {/* Features list */}
                <div className="mt-2.5 space-y-1">
                  {item.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-stone-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="mt-4 pt-3 border-t border-amber-500/20">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-stone-400 line-through mr-1.5">
                      ৳{toBanglaNumber(item.regularPrice)}
                    </span>
                    <span className="text-xl font-bold text-gold font-serif-luxury">
                      ৳{toBanglaNumber(item.price)}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    {item.qty >= 2 ? 'ফ্রি ডেলিভারি' : 'ক্যাশ অন ডেলিভারি'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOrderClick(item.qty);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-cta hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow active:scale-95 transition cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>অর্ডার করুন (পপআপ ফর্ম)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-[11px] text-stone-400">
          * মাউস রাখলে স্লাইডার থেমে যাবে • যেকোনো কার্ডে ক্লিক করে সরাসরি অর্ডার করুন
        </p>
      </div>
    </section>
  );
};
