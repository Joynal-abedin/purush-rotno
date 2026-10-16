import React from 'react';
import { Phone, MessageCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '../types/index.js';

interface HeaderProps {
  settings: SiteSettings | null;
  onOrderClick: () => void;
  onLookupClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ settings, onOrderClick, onLookupClick }) => {
  const hotline = settings?.hotline || '01886338934';
  const whatsapp = settings?.whatsapp || '01886338934';
  const brandName = settings?.brandName || 'পুরুষ রত্ন';

  return (
    <header className="relative z-20 bg-[#070d09] border-b border-amber-500/25">
      <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Brand Logo & Name */}
        <a href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-[1.5px] shadow-lg shadow-black/60">
            <div className="w-full h-full bg-[#07130b] rounded-[10px] flex items-center justify-center">
              <span className="font-serif-luxury text-amber-400 font-bold text-lg sm:text-xl group-hover:scale-105 transition-transform">
                PR
              </span>
            </div>
          </div>
          <div>
            <span className="block font-serif-luxury font-bold text-lg sm:text-2xl text-amber-300 tracking-wide">
              {brandName}
            </span>
            <span className="block text-[10px] sm:text-xs text-amber-400/80 tracking-wider uppercase font-medium">
              Figure Care Night King
            </span>
          </div>
        </a>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Order Tracker Link */}
          <button
            onClick={onLookupClick}
            className="hidden lg:flex items-center gap-1 text-xs text-amber-300/80 hover:text-amber-200 py-2 px-3 rounded-lg border border-amber-500/20 hover:border-amber-500/40 transition-colors"
          >
            অর্ডার ট্র্যাক
          </button>

          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/88${whatsapp.replace(/[\s-]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-white text-xs font-semibold shadow hover:scale-[1.03] active:scale-95 transition"
          >
            <MessageCircle className="w-4 h-4 fill-white text-transparent" />
            <span>হোয়াটসঅ্যাপ</span>
          </a>

          {/* Hotline Call Button */}
          <a
            href={`tel:${hotline}`}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-900 bg-gold px-3 py-2 rounded-lg font-bold shadow hover:scale-[1.03] active:scale-95 transition"
          >
            <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden md:inline font-mono">{hotline}</span>
            <span className="md:hidden">কল দিন</span>
          </a>

          {/* Main CTA Button */}
          <button
            onClick={onOrderClick}
            className="flex items-center gap-1.5 bg-cta text-white font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-2.5 rounded-xl shadow-glow animate-pulse-glow active:scale-95 transition cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span>এখনই অর্ডার করুন</span>
          </button>

        </div>

      </div>
    </header>
  );
};
