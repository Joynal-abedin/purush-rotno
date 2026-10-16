import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  Shield,
  Truck,
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
  Maximize2,
  X,
  Pause,
  Play,
} from 'lucide-react';
import { Product } from '../types/index.js';
import { toBanglaNumber } from '../utils/format.js';

interface HeroProps {
  product: Product;
  onOrderClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ product, onOrderClick }) => {
  const savings = product.regularPrice - product.offerPrice;
  const images = product.images && product.images.length > 0
    ? product.images
    : [
        '/uploads/purush_rotno_combo.jpg',
      ];

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const imageLabels = [
    'পুরুষত্ব শক্তি বৃদ্ধির হালুয়া এবং জিনসিং অয়েল কম্বো প্যাক',
  ];

  // Auto-slide right-to-left with slow, smooth interval
  useEffect(() => {
    if (isPaused || lightboxOpen) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, 4500); // 4.5 seconds slow, relaxed pacing

    return () => clearInterval(interval);
  }, [isPaused, lightboxOpen, images.length]);

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative overflow-hidden bg-hero pt-6 pb-10 md:pt-10 md:pb-14 text-stone-100">
      
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Top Urgency Pill */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-xs text-amber-300 font-semibold shadow-sm animate-pulse">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>সীমিত স্টক • আজ অর্ডারে ফ্রি ডেলিভারি</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Interactive Product Image Gallery with Right-to-Left Slow Sliding Animation */}
          <div
            className="lg:col-span-6 flex flex-col items-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            
            <div className="relative w-full max-w-md sm:max-w-md aspect-[3/4] rounded-3xl overflow-hidden border-2 border-gold shadow-elegant bg-card-luxe p-2 group">
              
              {/* Product Badge */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gold text-stone-950 font-bold text-xs shadow-md">
                  <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
                  কম্বো অফার
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-black/80 border border-amber-500/30 text-amber-300 text-[11px] font-medium backdrop-blur-sm">
                  {product.inStock ? 'স্টকে আছে' : 'স্টক শেষ'}
                </span>
              </div>

              {/* Discount Ribbon */}
              {savings > 0 && (
                <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-md bg-cta text-white font-bold text-xs shadow-glow border border-red-400/40 pointer-events-none">
                  সাশ্রয় ৳{toBanglaNumber(savings)}
                </div>
              )}

              {/* Zoom Trigger Button & Pause Indicator */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-amber-300 border border-amber-500/30 backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
                  title={isPaused ? 'অটো-স্লাইড চালু করুন' : 'অটো-স্লাইড থামান'}
                >
                  {isPaused ? <Play className="w-4 h-4 fill-amber-300" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-amber-300 border border-amber-500/30 backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
                  title="বড় করে দেখুন"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Smooth Right-to-Left Sliding Image Carousel Track */}
              <div className="w-full h-full overflow-hidden rounded-2xl relative">
                <div
                  className="flex w-full h-full transition-transform duration-1000 ease-in-out"
                  style={{
                    transform: `translateX(-${activeImageIndex * 100}%)`,
                  }}
                >
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-full h-full shrink-0 relative cursor-zoom-in flex items-center justify-center bg-black/40"
                      onClick={() => setLightboxOpen(true)}
                    >
                      <img
                        src={img}
                        alt={imageLabels[idx] || product.name}
                        className="w-full h-full object-contain object-center rounded-2xl transition-transform duration-700 hover:scale-[1.02]"
                        loading={idx === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Left / Right Carousel Controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    aria-label="Previous"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-gold text-white hover:text-stone-950 border border-amber-500/40 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-gold text-white hover:text-stone-950 border border-amber-500/40 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-24 z-20 pointer-events-none">
                <span className="inline-block px-3 py-1 rounded-lg bg-black/85 border border-gold text-amber-200 text-xs font-medium backdrop-blur-md truncate max-w-full">
                  {imageLabels[activeImageIndex] || `ছবি ${toBanglaNumber(activeImageIndex + 1)}`}
                </span>
              </div>
            </div>

            {/* Slider progress dots & auto-move status (if multiple images) */}
            {images.length > 1 && (
              <>
                <div className="flex items-center justify-between w-full max-w-md sm:max-w-lg mt-2.5 px-1 text-[11px] text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-400 animate-pulse'}`} />
                    <span>{isPaused ? 'স্লাইড পজ করা আছে' : 'ডান থেকে বামে অটো-স্লাইড হচ্ছে'}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {images.slice(0, 3).map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setActiveImageIndex(dotIdx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          activeImageIndex === dotIdx ? 'w-6 bg-gold' : 'w-2 bg-stone-600 hover:bg-stone-400'
                        }`}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Interactive Thumbnails */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-3 w-full max-w-md sm:max-w-lg">
                  {images.slice(0, 3).map((img, idx) => {
                    const isActive = activeImageIndex === idx;
                    const shortNames = ['কম্বো সেট', 'হালুয়া জার', 'ম্যাসাজ অয়েল'];
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative rounded-2xl overflow-hidden p-1 transition-all cursor-pointer text-left flex flex-col items-center ${
                          isActive
                            ? 'border-2 border-gold bg-amber-500/20 shadow-gold scale-[1.02]'
                            : 'border border-amber-500/20 bg-black/40 hover:border-gold/50 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-black/50">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[11px] font-semibold text-stone-200 mt-1 truncate px-1 text-center">
                          {shortNames[idx] || `ছবি ${toBanglaNumber(idx + 1)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

          </div>

          {/* Right Column: Reference 3-Line Headline & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-gold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>১০০% প্রাকৃতিক ভেষজ উপাদানের নিশ্চয়তা</span>
            </div>

            {/* The Reference 3-Line Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight font-serif-luxury tracking-normal space-y-1">
              <span className="block text-white">প্রতিদিনের প্রাণশক্তি,</span>
              <span className="block text-gold">ভালোবাসার উষ্ণতা,</span>
              <span className="block text-stone-200 text-2xl sm:text-3xl md:text-4xl font-normal pt-1">
                নিজের যত্নে প্রিমিয়াম পুষ্টির ছোঁয়া
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base text-stone-300 leading-relaxed font-medium">
              পুরুষ রত্ন হালুয়া + Figure Care Night King Massage Oil — প্রিমিয়াম ভেষজ কম্বো প্যাক, দৈনন্দিন শক্তি, সহনশীলতা ও আত্মবিশ্বাসের স্মার্ট সাপোর্ট।
            </p>

            {/* Pricing Box */}
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-card-luxe border-gold shadow-elegant">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-xs sm:text-sm text-stone-400 font-medium">অফার মূল্য:</span>
                <span className="text-3xl sm:text-4xl font-extrabold text-gold font-serif-luxury tracking-tight">
                  ৳{toBanglaNumber(product.offerPrice)}
                </span>
                <span className="text-lg sm:text-xl text-stone-400 line-through font-serif-luxury">
                  ৳{toBanglaNumber(product.regularPrice)}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/30 font-semibold">
                  সাশ্রয় ৳{toBanglaNumber(savings)}
                </span>
              </div>
              <p className="mt-2 text-xs text-amber-200/90 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>পার্সেল খুলে চেক করে টাকা পরিশোধের পূর্ণ নিশ্চয়তা (ক্যাশ অন ডেলিভারি)</span>
              </p>
            </div>

            {/* Main Primary CTA Button */}
            <div className="mt-6">
              <button
                onClick={onOrderClick}
                className="w-full flex items-center justify-center gap-3 bg-cta hover:brightness-110 text-white font-bold text-lg sm:text-xl py-4 px-8 rounded-2xl shadow-glow animate-pulse-glow active:scale-[0.98] transition-all cursor-pointer"
              >
                <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
                <span>এখনই অর্ডার করুন</span>
              </button>
            </div>

            {/* 4-Item Reference Trust Badges */}
            <div className="mt-6 pt-5 border-t border-amber-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="flex flex-col items-center p-2 rounded-xl bg-black/30 border border-amber-500/15">
                <Truck className="w-5 h-5 text-gold mb-1" />
                <span className="text-xs text-stone-200 font-medium">ফ্রি ডেলিভারি</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-black/30 border border-amber-500/15">
                <CheckCircle2 className="w-5 h-5 text-gold mb-1" />
                <span className="text-xs text-stone-200 font-medium">ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-black/30 border border-amber-500/15">
                <Shield className="w-5 h-5 text-gold mb-1" />
                <span className="text-xs text-stone-200 font-medium">১০০% অরিজিনাল</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-black/30 border border-amber-500/15">
                <Clock className="w-5 h-5 text-gold mb-1" />
                <span className="text-xs text-stone-200 font-medium">দ্রুত কনফার্মেশন</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Lightbox Zoom Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 p-2 text-stone-300 hover:text-white rounded-full bg-black/60 border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="rounded-3xl overflow-hidden border-2 border-gold shadow-2xl">
              <img
                src={images[activeImageIndex]}
                alt=""
                className="w-full max-h-[80vh] object-contain bg-black"
              />
            </div>
            <div className="text-center mt-3 text-sm text-gold font-semibold">
              {imageLabels[activeImageIndex]}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
