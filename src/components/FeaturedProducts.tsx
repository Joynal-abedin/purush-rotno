import React from 'react';
import { ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import { toBanglaNumber } from '../utils/format.js';

interface FeaturedProductsProps {
  onOrderClick: () => void;
  offerPrice: number;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onOrderClick, offerPrice }) => {
  const blocks = [
    {
      title: 'প্রিমিয়াম কম্বো সেট ভিউ',
      kicker: 'ব্লক ১',
      badge: 'পুরুষ রত্ন হালুয়া + পাওয়ার অয়েল (Ginseng Power Oil)',
      desc: 'মাল্টিলেয়ার ড্রপার ক্যাপ অয়েল বোতল এবং ৫০০ গ্রাম অর্গানিক পুরুষ রত্ন হালুয়া জার — অভ্যন্তরীণ পুষ্টি ও বাহ্যিক সুস্থতার সম্পূর্ণ প্রাকৃতিক প্যাকেজ।',
      image: '/uploads/purush_rotno_combo.jpg',
      perks: ['ড্রপার ক্যাপ সহ বোতল', '৫০০ গ্রাম বড় সাইজ হালুয়া জার', '১০০% খাঁটি জিনসিং ও ভেষজ নির্যাস'],
    },
    {
      title: 'পুরুষ রত্ন পুষ্টিকর হালুয়া (৫০০ গ্রাম)',
      kicker: 'ব্লক ২',
      badge: 'খাঁটি সুন্দরবনের মধু, জাফরান ও অশ্বগন্ধা ফর্মুলা',
      desc: 'সুন্দরবনের খাঁটি মধু, জাফরান, অশ্বগন্ধা, শিমুল মূল ও কালোজিরার পুষ্টিকর সংমিশ্রণ — কোনো ক্ষতিকর রাসায়নিক ছাড়া প্রাকৃতিক প্রাণশক্তি ফিরিয়ে আনে।',
      image: '/uploads/purush_rotno_combo.jpg',
      perks: ['৫০০ গ্রাম বড় সাইজ জার', 'সুস্বাদু ও পুষ্টিকর ফর্মুলা', 'সম্পূর্ণ পার্শ্বপ্রতিক্রিয়াহীন'],
    },
    {
      title: 'পাওয়ার অয়েল / ম্যাসাজ অয়েল',
      kicker: 'ব্লক ৩',
      badge: 'Ginseng Power Oil (১০০ মিলি ড্রপার বোতল)',
      desc: 'ভেষজ উদ্ভিজ্জ নির্যাসে সমৃদ্ধ পাওয়ার অয়েল। সহজে শোষিত হয়ে রক্ত সঞ্চালন স্বাভাবিক রাখে এবং মানসিক প্রশান্তি ও আত্মবিশ্বাস পুনরুদ্ধারে সাহায্য করে।',
      image: '/uploads/purush_rotno_combo.jpg',
      perks: ['১০০ মিলি ড্রপার ক্যাপ বোতল', 'সহজে ত্বকে শোষিত হয়', '১০০% প্রাকৃতিক ভেষজ নির্যাস'],
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-[#070d09] border-t border-amber-500/20">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-xs text-gold tracking-widest uppercase mb-2 font-semibold">
            VIEW HERE
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3 font-serif-luxury">
            <span className="text-gold">প্রিমিয়াম প্রোডাক্ট ভিউ</span>
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto">
            ভেতর থেকে দেখুন আপনার দৈনন্দিন প্রিমিয়াম ভেষজ যত্নের উপাদান ও প্যাকেজিং
          </p>
        </div>

        {/* Alternating Feature Blocks */}
        <div className="space-y-12 md:space-y-16">
          {blocks.map((b, idx) => (
            <div
              key={idx}
              className={`flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-10 md:items-center ${
                idx % 2 === 1 ? 'md:[&>div:first-child]:order-2' : ''
              }`}
            >
              
              {/* Image Card */}
              <div className="md:col-span-6 flex justify-center">
                <div className="relative w-full max-w-sm sm:max-w-md aspect-[3/4] rounded-3xl overflow-hidden border-2 border-gold shadow-elegant bg-card-luxe p-2 group flex items-center justify-center bg-black/40">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-contain rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-gold text-stone-950 font-bold text-xs shadow">
                    {b.badge}
                  </div>
                </div>
              </div>

              {/* Text Card */}
              <div className="md:col-span-6 space-y-4 text-left">
                <div className="text-xs text-gold tracking-widest uppercase font-semibold">
                  {b.kicker}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white font-serif-luxury">
                  {b.title}
                </h3>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                  {b.desc}
                </p>

                {/* Perk checkmarks */}
                <div className="space-y-2 pt-2">
                  {b.perks.map((p, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>

                {/* Direct CTA button */}
                <div className="pt-3">
                  <button
                    onClick={onOrderClick}
                    className="inline-flex items-center gap-2 bg-cta hover:brightness-110 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-glow active:scale-95 transition cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>এখনই অর্ডার করুন — ৳{toBanglaNumber(offerPrice)}</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
