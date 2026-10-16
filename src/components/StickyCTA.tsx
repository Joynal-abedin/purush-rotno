import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, ShoppingBag } from 'lucide-react';
import { toBanglaNumber } from '../utils/format.js';

interface StickyCTAProps {
  onOrderClick: () => void;
  offerPrice: number;
  whatsapp?: string;
  hotline?: string;
}

export const StickyCTA: React.FC<StickyCTAProps> = ({
  onOrderClick,
  offerPrice = 1290,
  whatsapp = '01886338934',
  hotline = '01886338934',
}) => {
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const [showBottomBar, setShowBottomBar] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentPercent = (window.scrollY / totalScroll) * 100;
        setScrollPercent(currentPercent);
        setShowBottomBar(window.scrollY > 250);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. Top Reading Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent pointer-events-none">
        <div
          className="h-full bg-gold transition-all duration-150"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* 2. Floating Quick Contact Action Buttons (Bottom Right) */}
      <div className="fixed right-3.5 bottom-20 md:bottom-8 z-40 flex flex-col gap-2.5">
        
        {/* WhatsApp Round Floating Button */}
        <a
          href={`https://wa.me/88${whatsapp.replace(/[\s-]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-elegant hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-white text-transparent group-hover:scale-110 transition-transform" />
        </a>

        {/* Hotline Round Floating Button */}
        <a
          href={`tel:${hotline}`}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gold text-stone-950 shadow-gold hover:scale-110 active:scale-95 transition-all cursor-pointer"
          aria-label="Call Now"
        >
          <Phone className="w-5 h-5 stroke-[2.5]" />
        </a>

      </div>

      {/* 3. Sticky Bottom Floating Order Bar (Mobile only, triggers after 250px scroll) */}
      {showBottomBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#070d09]/95 backdrop-blur-md border-t border-gold px-3 py-2.5 shadow-2xl animate-fade-in">
          <button
            onClick={onOrderClick}
            className="w-full bg-cta text-white font-bold py-3 px-4 rounded-xl shadow-glow animate-pulse-glow flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span>🛒 এখনই অর্ডার করুন — ৳{toBanglaNumber(offerPrice)}</span>
          </button>
        </div>
      )}
    </>
  );
};
