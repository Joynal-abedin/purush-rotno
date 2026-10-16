import React from 'react';
import { Zap, Heart, Brain, Sparkles, Feather, ShieldCheck, ShoppingBag } from 'lucide-react';
import { toBanglaNumber } from '../utils/format.js';

interface BenefitsProps {
  onOrderClick: () => void;
  offerPrice: number;
}

export const Benefits: React.FC<BenefitsProps> = ({ onOrderClick, offerPrice }) => {
  const items = [
    {
      icon: '⚡',
      title: 'দৈনন্দিন এনার্জি সাপোর্ট',
      desc: 'সকাল থেকে রাত — শরীরের স্বাভাবিক ক্লান্তি দূর করে প্রাকৃতিক প্রাণশক্তি প্রদান করে।',
    },
    {
      icon: '❤️',
      title: 'স্ট্যামিনা ও ভাইটালিটি',
      desc: 'সুন্দরবনের খাঁটি মধু ও জাফরানের পুষ্টিকর সমন্বয়ে দীর্ঘমেয়াদী শারীরিক দৃঢ়তা।',
    },
    {
      icon: '🧠',
      title: 'মানসিক প্রশান্তি ও ফোকাস',
      desc: 'অশ্বগন্ধা ও ভেষজ উপাদানের সহায়তায় কাজের চাপ ও মানসিক অবসাদ মুক্ত স্বস্তি।',
    },
    {
      icon: '🌿',
      title: '১০০% প্রাকৃতিক ভেষজ উপাদান',
      desc: 'শিমুল মূল, কালোজিরা, তালমাখনা ও কাতিলা গামের সমৃদ্ধ প্রাকৃতিক পুষ্টি উপাদান।',
    },
    {
      icon: '✨',
      title: 'বাহ্যিক ম্যাসাজ কমফোর্ট',
      desc: 'Figure Care Night King Massage Oil এর আলতো ম্যাসাজে পেশির আরাম ও রক্তসঞ্চালন বৃদ্ধি।',
    },
    {
      icon: '👑',
      title: 'সামগ্রিক আত্মবিশ্বাস পুনরুদ্ধার',
      desc: 'প্রাকৃতিক নিয়মে সম্পূর্ণ সুস্থতা, সতেজতা ও আত্মবিশ্বাসের নতুন অনুভব।',
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-[#050b08] border-t border-amber-500/20">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-xs text-gold tracking-widest uppercase mb-2 font-semibold">
            KEY BENEFITS
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3 font-serif-luxury">
            <span className="text-gold">প্রিমিয়াম বেনিফিট প্যাকেজ</span>
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto">
            এক সাথে হালুয়া ও ম্যাসাজ অয়েলের পূর্ণাঙ্গ ওয়েলনেস সাপোর্ট
          </p>
        </div>

        {/* 6-Card Grid matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-card-luxe border-gold shadow-elegant hover:border-amber-400/60 transition-all hover:scale-[1.02] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-black/50 border border-gold flex items-center justify-center text-2xl mb-4 shadow">
                  {item.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-serif-luxury mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="mt-12 text-center">
          <button
            onClick={onOrderClick}
            className="inline-flex items-center gap-2.5 bg-cta hover:brightness-110 text-white font-bold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-glow active:scale-95 transition cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            <span>এই প্রিমিয়াম যত্ন আজই নিন — মাত্র ৳{toBanglaNumber(offerPrice)}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
