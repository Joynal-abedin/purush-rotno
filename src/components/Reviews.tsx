import React from 'react';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';
import { toBanglaNumber } from '../utils/format.js';

export const Reviews: React.FC = () => {
  const counters = [
    { num: '১০,০০০+', label: 'সন্তুষ্ট গ্রাহক' },
    { num: '৪.৯/৫', label: 'গড় রেটিং' },
    { num: '৭৩%', label: 'রিপিট বায়ার' },
    { num: '২০০+', label: 'দৈনিক অর্ডার' },
  ];

  const reviews = [
    {
      name: 'রফিকুল ইসলাম',
      loc: 'ধানমন্ডি, ঢাকা',
      rating: 5,
      date: '৩ দিন আগে',
      text: 'অর্ডার দেওয়ার পরদিনই ঢাকার মধ্যে হাতে পেয়েছি। হালুয়ার স্বাদ খুব প্রাকৃতিক এবং ম্যাসাজ অয়েলটি খুবই রিল্যাক্সিং। সত্যি বলতে দারুণ কম্বো প্যাক!',
    },
    {
      name: 'তানভীর হাসান',
      loc: 'খুলনা সদর',
      rating: 5,
      date: '১ সপ্তাহ আগে',
      text: 'পার্সেল খুলে দেখে চেক করে টাকা দিয়েছি। খাঁটি উপাদান — কোনো কৃত্রিম গন্ধ বা কেমিক্যাল নেই। এনার্জি অনেক বেড়েছে।',
    },
    {
      name: 'আব্দুল কাদের',
      loc: 'সিলেট',
      rating: 5,
      date: '২ সপ্তাহ আগে',
      text: 'প্যাকেজিং খুবই প্রিমিয়াম, কাঁচের জার ও ড্রপার বোতল। প্রতিদিন রাতে খাবার পর খাচ্ছি, শারীরিক ক্লান্তি অনেকটাই কমে গেছে।',
    },
    {
      name: 'মোশাররফ হোসেন',
      loc: 'চট্টগ্রাম',
      rating: 5,
      date: '৫ দিন আগে',
      text: 'প্রথমে দ্বিধায় ছিলাম, কিন্তু ডেলিভারি পাওয়ার পর ব্যবহার করে মুগ্ধ। কাস্টমার সার্ভিসের ব্যবহারও খুব ভালো।',
    },
  ];

  const chatThreads = [
    {
      platform: 'WhatsApp',
      name: 'রফিকুল ইসলাম (ঢাকা)',
      time: '১০:৪২ AM',
      messages: [
        { from: 'agent', text: 'আসসালামু আলাইকুম। আপনার পুরুষ রত্ন কম্বো প্যাক অর্ডারটি কনফার্ম করছি ✅' },
        { from: 'user', text: 'জি ভাই, কনফার্ম করেন। ক্যাশ অন ডেলিভারি।' },
        { from: 'agent', text: 'ধন্যবাদ! ২৪ ঘণ্টার মধ্যে ডেলিভারিম্যান আপনার ঠিকানায় নিয়ে যাবে 🚚' },
        { from: 'user', text: 'পার্সেল চেক করে নেওয়া যাবে তো? 😊' },
        { from: 'agent', text: 'জি অবশ্যই, পার্সেল চেক করে পণ্য বুঝে নিয়ে টাকা পরিশোধ করবেন 🇧🇩' },
      ],
    },
    {
      platform: 'WhatsApp',
      name: 'তানভীর হাসান (খুলনা)',
      time: '০২:১৫ PM',
      messages: [
        { from: 'user', text: 'ভাইয়া, ১ সপ্তাহ খেয়ে মেসেজ দিচ্ছি — শারীরিক ক্লান্তি অনেক কমেছে 💪' },
        { from: 'agent', text: 'অসাধারণ! আপনার ফিডব্যাক শুনে খুবই ভালো লাগলো ❤️' },
        { from: 'user', text: 'অয়েলটা মালিশ করলে খুব আরাম লাগে। আরেকটা কম্বো লাগবে।' },
        { from: 'agent', text: 'অবশ্যই! আপনার পূর্বের ঠিকানায় আজই পাঠিয়ে দিচ্ছি ✅' },
      ],
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-[#070d09] border-t border-amber-500/20">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="text-xs text-gold tracking-widest uppercase mb-2 font-semibold">
            CUSTOMER TRUST
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3 font-serif-luxury">
            <span className="text-gold">১০,০০০+ সন্তুষ্ট গ্রাহকের আস্থা</span>
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto">
            আসল গ্রাহকদের সরাসরি অভিজ্ঞতা ও নির্ভরযোগ্য রিভিউ
          </p>
        </div>

        {/* 4 Counter Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {counters.map((c, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-card-luxe border-gold shadow-elegant text-center"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-gold font-serif-luxury mb-1">
                {c.num}
              </div>
              <div className="text-xs text-stone-300 font-medium">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Verified Customer Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-card-luxe border border-gold/40 shadow-elegant space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-base flex items-center gap-2">
                    <span>{r.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      ভেরিফাইড ক্রেতা
                    </span>
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">{r.loc} • {r.date}</div>
                </div>

                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed italic">
                "{r.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Realistic Chat Proof Threads matching reference */}
        <div className="mt-8">
          <div className="text-center mb-6">
            <span className="text-xs font-semibold text-gold tracking-wider uppercase flex items-center justify-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              হোয়াটসঅ্যাপ কাস্টমার ফিডব্যাক স্ক্রিনশট কনভার্সন
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chatThreads.map((thread, tIdx) => (
              <div
                key={tIdx}
                className="rounded-3xl bg-[#0b140e] border border-emerald-800/60 p-4 sm:p-5 shadow-elegant text-xs space-y-3 font-sans"
              >
                {/* Chat Header */}
                <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-xs">
                      WA
                    </div>
                    <div>
                      <div className="font-semibold text-white">{thread.name}</div>
                      <div className="text-[10px] text-emerald-400">অনলাইন • {thread.time}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400">অর্ডার কনফার্মেশন</span>
                </div>

                {/* Messages */}
                <div className="space-y-2 pt-1">
                  {thread.messages.map((msg, mIdx) => (
                    <div
                      key={mIdx}
                      className={`flex ${msg.from === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                          msg.from === 'agent'
                            ? 'bg-[#005c4b] text-white rounded-tr-none'
                            : 'bg-[#202c33] text-stone-200 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
