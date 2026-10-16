import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Lock, MessageCircle } from 'lucide-react';
import { SiteSettings } from '../types/index.js';

interface FooterProps {
  settings: SiteSettings | null;
  onLookupClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onLookupClick }) => {
  const brandName = settings?.brandName || 'পুরুষ রত্ন';
  const hotline = settings?.hotline || '01886338934';
  const whatsapp = settings?.whatsapp || '01886338934';
  const email = settings?.email || 'etishamoni1@gmail.com';
  const address = settings?.footerAddress || 'মতিঝিল বাণিজ্যিক এলাকা, ঢাকা-১০০০, বাংলাদেশ';

  return (
    <footer className="bg-[#030704] text-stone-300 border-t border-amber-500/20 pt-14 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-amber-500/15">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gold text-stone-950 font-serif-luxury font-bold flex items-center justify-center text-sm shadow">
                PR
              </div>
              <span className="font-serif-luxury font-bold text-xl text-amber-300">
                {brandName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              পুরুষ রত্ন হালুয়া এবং Figure Care Night King Massage Oil — প্রিমিয়াম ভেষজ কম্বো প্যাক। প্রাকৃতিক শক্তি, সহনশীলতা ও আত্মবিশ্বাসের স্মার্ট সাপোর্ট।
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>১০০% অরিজিনাল প্রোডাক্ট গ্যারান্টি • ক্যাশ অন ডেলিভারি</span>
            </div>
          </div>

          {/* Quick Contact Matching User Requirements */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-semibold text-gold uppercase tracking-wider text-sm mb-3">
              যোগাযোগ ও হটলাইন
            </h4>

            <a
              href={`tel:${hotline}`}
              className="flex items-center gap-2.5 text-stone-300 hover:text-gold transition-colors"
            >
              <Phone className="w-4 h-4 text-gold shrink-0" />
              <span>হটলাইন: <strong className="font-mono text-white">{hotline}</strong></span>
            </a>

            <a
              href={`https://wa.me/88${whatsapp.replace(/[\s-]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-stone-300 hover:text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>হোয়াটসঅ্যাপ: <strong className="font-mono text-white">{whatsapp}</strong></span>
            </a>

            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2.5 text-stone-300 hover:text-amber-300 transition-colors"
            >
              <Mail className="w-4 h-4 text-gold shrink-0" />
              <span>ইমেইল: <strong className="text-white">{email}</strong></span>
            </a>

            <div className="flex items-start gap-2.5 text-stone-400 pt-1">
              <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
          </div>

          {/* Policies & Links */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-semibold text-gold uppercase tracking-wider text-sm mb-3">
              গ্রাহক সুবিধা ও সহায়তা
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onLookupClick}
                  className="hover:text-gold transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>অর্ডার ট্র্যাক ও বর্তমান স্ট্যাটাস</span>
                </button>
              </li>
              <li>
                <span className="text-stone-300">সারা বাংলাদেশে দ্রুত হোম ডেলিভারি</span>
              </li>
              <li>
                <span className="text-stone-300">ক্যাশ অন ডেলিভারি — পণ্য দেখে টাকা দিন</span>
              </li>
              <li>
                <span className="text-stone-300">৭ দিনের মধ্যে রিটার্ন ও রিপ্লেসমেন্ট পলিসি</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} {brandName}। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-2 text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400/80" />
            <span>সিকিউর চেকআউট ও শতভাগ প্রিমিয়াম কোয়ালিটি গ্যারান্টি</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
