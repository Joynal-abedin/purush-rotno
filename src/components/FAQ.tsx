import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShoppingBag, Phone } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  onOrderClick: () => void;
  hotline?: string;
}

const faqs: FAQItem[] = [
  {
    question: 'ডেলিভারি পেতে কতদিন সময় লাগবে?',
    answer: 'ঢাকা সিটির ভেতরে অর্ডার কনফার্মেশনের ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকা সিটির বাইরে ২ থেকে ৩ কার্যদিবসের মধ্যে আপনার ঠিকানায় সরাসরি পৌঁছে দেওয়া হবে।',
  },
  {
    question: 'আমি কি পার্সেল খুলে চেক করে টাকা পরিশোধ করতে পারব?',
    answer: 'হ্যাঁ, অবশ্যই। ডেলিভারিম্যানের সামনে পার্সেলটি চেক করে সঠিক পণ্য বুঝে পেয়ে তারপর মূল্য পরিশোধ করার পূর্ণ সুযোগ রয়েছে।',
  },
  {
    question: 'এই কম্বো প্যাকটিতে কী কী পণ্য রয়েছে?',
    answer: 'এই স্পেশাল কম্বো অফারে রয়েছে এক জার পুরুষ রত্ন পুষ্টিকর হালুয়া (৫০০ গ্রাম) এবং এক বোতল অরিজিনাল জিনসিং পাওয়ার অয়েল (POWER OIL)।',
  },
  {
    question: 'পণ্যগুলোর কোনো ক্ষতিকর পার্শ্বপ্রতিক্রিয়া আছে কি?',
    answer: 'না, এগুলো খাঁটি প্রাকৃতিক ভেষজ উপাদানের সমন্বয়ে প্রস্তুত। কোনো ক্ষতিকর কেমিক্যাল বা নিষিদ্ধ কৃত্রিম উপাদান ব্যবহার করা হয় না। তবে যাদের কোনো ক্রনিক রোগ রয়েছে, তারা চিকিৎসকের পরামর্শ নিয়ে ব্যবহার করতে পারেন।',
  },
  {
    question: 'অর্ডারের পর কীভাবে কনফার্মেশন জানব?',
    answer: 'অর্ডার সাবমিট করার সাথে সাথেই আপনি একটি ইউনিক অর্ডার আইডি (Order ID) পাবেন। এছাড়াও আমাদের কাস্টমার সাপোর্ট টিম দ্রুত ফোনে কল করে আপনার ঠিকানা যাচাই ও ডেলিভারি নিশ্চিত করবে।',
  },
];

export const FAQ: React.FC<FAQProps> = ({ onOrderClick, hotline = '01712-345678' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#04140e]/60 border-t border-amber-500/15">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/15 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>সাধারণ জিজ্ঞাসা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
            সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
          </h2>
          <p className="mt-2 text-stone-300 text-sm">
            আপনার প্রয়োজনীয় প্রশ্নের উত্তর নিচে জেনে নিন
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-emerald-900/60 bg-emerald-950/30 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-stone-100 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-stone-300 leading-relaxed border-t border-emerald-900/40 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ Bottom High-Converting Action Card */}
        <div className="mt-10 p-6 rounded-2xl bg-[#062319] border border-amber-500/30 text-center space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-white font-serif-luxury">
            আর কোনো দ্বিধা নয়! ঘরে বসেই ক্যাশ অন ডেলিভারিতে অর্ডার করুন
          </h3>
          <p className="text-xs sm:text-sm text-stone-300">
            পণ্য হাতে পেয়ে শতভাগ নিশ্চিন্ত হয়ে মূল্য পরিশোধ করুন।
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOrderClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-base py-3 px-8 rounded-xl shadow-xl shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              <span>সরাসরি অর্ডার করুন</span>
            </button>
            <a
              href={`tel:${hotline}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-950 border border-emerald-700/60 hover:bg-emerald-900/60 text-amber-300 font-semibold text-sm py-3 px-6 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>ফোনে অর্ডার: {hotline}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
