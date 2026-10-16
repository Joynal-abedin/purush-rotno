import React from 'react';
import { Check, X, ShieldCheck } from 'lucide-react';

export const Comparison: React.FC = () => {
  const rows = [
    {
      feature: 'উপাদান ও বিশুদ্ধতা',
      normal: 'সাধারণ কেমিক্যাল বা অজানা উপাদান',
      premium: 'খাঁটি সুন্দরবনের মধু, জাফরান ও ভেষজ',
    },
    {
      feature: 'কম্বো সমাধান',
      normal: 'শুধুমাত্র একটি আইটেম',
      premium: 'দ্বৈত অ্যাকশন (হালুয়া ৫০০ গ্রাম + পাওয়ার অয়েল)',
    },
    {
      feature: 'পার্শ্বপ্রতিক্রিয়া',
      normal: 'কৃত্রিম স্টিমুল্যান্টের মারাত্মক ঝুঁকি',
      premium: 'সম্পূর্ণ প্রাকৃতিক ও পার্শ্বপ্রতিক্রিয়াহীন',
    },
    {
      feature: 'প্যাকেজিং ও প্রিজারভেশন',
      normal: 'সাধারণ প্লাস্টিক জার',
      premium: 'ইউভি প্রটেক্টেড সিলড কাচের জার ও বোতল',
    },
    {
      feature: 'ডেলিভারি ও পেমেন্ট',
      normal: 'আগে টাকা দেওয়ার ঝুঁকি',
      premium: 'পার্সেল খুলে দেখে ক্যাশ অন ডেলিভারি',
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-[#070d09] border-t border-amber-500/20">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="text-xs text-gold tracking-widest uppercase mb-2 font-semibold">
            WHY WE ARE DIFFERENT
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 font-serif-luxury text-white">
            <span className="text-gold">সাধারণ পণ্য নয়,</span> প্রিমিয়াম যত্নের অনুভব
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm">
            Ordinary Generic Products vs Premium Purush Rotno Combo
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="rounded-3xl bg-card-luxe border-gold shadow-elegant overflow-hidden">
          
          {/* Table Head */}
          <div className="grid grid-cols-12 bg-black/60 p-4 sm:p-5 border-b border-gold text-xs sm:text-sm font-bold">
            <div className="col-span-4 text-stone-300">বৈশিষ্ট্য</div>
            <div className="col-span-4 text-red-400 text-center">সাধারণ বাজারজাত পণ্য</div>
            <div className="col-span-4 text-amber-300 text-center font-serif-luxury">পুরুষ রত্ন কম্বো 👑</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-amber-500/15 text-xs sm:text-sm">
            {rows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-black/20 transition-colors">
                <div className="col-span-4 font-semibold text-white">
                  {row.feature}
                </div>
                <div className="col-span-4 text-stone-400 text-center px-1 flex items-center justify-center gap-1.5">
                  <X className="w-4 h-4 text-red-400 shrink-0 hidden sm:inline" />
                  <span>{row.normal}</span>
                </div>
                <div className="col-span-4 text-amber-200 font-medium text-center px-1 flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 hidden sm:inline" />
                  <span>{row.premium}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
