import React from 'react';

export const AnnouncementMarquee: React.FC = () => {
  const text = "✦ সারা বাংলাদেশে ফ্রি ডেলিভারি ✦ ক্যাশ অন ডেলিভারি ✦ ১০,০০০+ সন্তুষ্ট গ্রাহক ✦ ১০০% অরিজিনাল প্রোডাক্ট গ্যারান্টি ✦ আজকের অর্ডারে স্পেশাল অফার ✦";

  return (
    <div className="w-full bg-[#0a120c] border-b border-amber-500/20 py-2 overflow-hidden select-none">
      <div className="animate-marquee whitespace-nowrap flex text-xs sm:text-sm font-semibold tracking-wide text-amber-300/90">
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
      </div>
    </div>
  );
};
