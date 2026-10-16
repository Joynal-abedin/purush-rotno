/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AnnouncementMarquee } from './components/AnnouncementMarquee.js';
import { Header } from './components/Header.js';
import { Hero } from './components/Hero.js';
import { FeaturedProducts } from './components/FeaturedProducts.js';
import { Benefits } from './components/Benefits.js';
import { Comparison } from './components/Comparison.js';
import { PackagePricing } from './components/PackagePricing.js';
import { OrderForm } from './components/OrderForm.js';
import { Reviews } from './components/Reviews.js';
import { FAQ } from './components/FAQ.js';
import { Footer } from './components/Footer.js';
import { StickyCTA } from './components/StickyCTA.js';
import { OrderModal } from './components/OrderModal.js';
import { OrderLookupModal } from './components/OrderLookupModal.js';
import { AdminLogin } from './components/admin/AdminLogin.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { Product, SiteSettings } from './types/index.js';
import { initGTM, trackViewItem } from './utils/gtm.js';

const DEFAULT_PRODUCT: Product = {
  id: 'prod-rotno-combo',
  name: 'পুরুষ রত্ন হালুয়া + পাওয়ার অয়েল (Ginseng Power Oil)',
  subtitle: 'প্রিমিয়াম ভেষজ ফর্মুলা কম্বো প্যাক — হালুয়া ৫০০ গ্রাম + পাওয়ার অয়েল ১০০ মিলি',
  regularPrice: 1990,
  offerPrice: 1290,
  description: 'শতভাগ খাঁটি ও প্রাকৃতিক উপাদানের সমন্বয়ে প্রস্তুত হেলথ গুড পুরুষ রত্ন হালুয়া (৫০০ গ্রাম) এবং অরিজিনাল জিনসিং পাওয়ার অয়েল। প্রাত্যহিক ক্লান্তি দূর করে শারীরিক শক্তি, সতেজতা ও আত্মবিশ্বাস ফিরিয়ে আনার এক নির্ভরযোগ্য হারবাল কম্বো সলিউশন।',
  details: [
    'খাঁটি সুন্দরবনের মধু, জাফরান, শিমুল মূল ও অশ্বগন্ধা সমন্বিত পুষ্টিকর হালুয়া',
    'কালোজিরা, আমলকী, তালমাখনা ও কাতিলা গামের সমৃদ্ধ প্রাকৃতিক পুষ্টি উপাদান',
    'বাহ্যিক ব্যবহারের জন্য প্রস্তুত বিশেষ ভেষজ নির্যাসযুক্ত নাইট কিং ম্যাসাজ অয়েল',
    'সম্পূর্ণ প্রাকৃতিক ফর্মুলা — ক্ষতিকর কেমিক্যাল বা কৃত্রিম স্টিমুলেটিং উপাদান মুক্ত',
    'কোনো পার্শ্বপ্রতিক্রিয়া ছাড়া প্রাকৃতিক শক্তি ও স্ট্যামিনা বৃদ্ধির সহায়ক',
  ],
  usage: [
    'পুরুষ রত্ন হালুয়া: প্রতিদিন রাতে খাবারের ৩০ মিনিট পর ১ চা চামচ পরিমাণ কুসুম গরম দুধ অথবা পানির সাথে সেব্য।',
    'ম্যাসাজ অয়েল: রাতে ঘুমানোর পূর্বে ৪-৫ ফোঁটা অয়েল নিয়ে আলতো হাতে ২-৩ মিনিট হালকা ম্যাসাজ করুন (শুধুমাত্র বাহ্যিক ব্যবহারের জন্য)।',
    'সংরক্ষণ পদ্ধতি: সরাসরি রোদ ও আর্দ্রতা এড়িয়ে ঠাণ্ডা ও ছায়াযুক্ত স্থানে স্বাভাবিক তাপমাত্রায় সংরক্ষণ করুন।',
  ],
  images: ['/uploads/purush_rotno_combo.jpg'],
  inStock: true,
  isPublished: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_SETTINGS: SiteSettings = {
  brandName: 'পুরুষ রত্ন',
  hotline: '01886338934',
  whatsapp: '01886338934',
  email: 'etishamoni1@gmail.com',
  deliveryDhaka: 70,
  deliveryOutside: 130,
  freeDeliveryThreshold: 2,
  gtmId: '',
  noticeText: 'সীমিত সময়ের স্পেশাল অফার! ক্যাশ অন হোম ডেলিভারিতে পণ্য বুঝে পেয়ে মূল্য পরিশোধ করুন।',
  guaranteeText: '১০০% খাঁটি ভেষজ উপাদান • পার্সেল চেক করে গ্রহণের সুযোগ • কোনো আগাম পেমেন্ট নেই',
  footerAddress: 'মতিঝিল বাণিজ্যিক এলাকা, ঢাকা-১০০০, বাংলাদেশ',
};

const checkIsAdminUrl = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return path.startsWith('/admin') || hash === '#admin' || hash.startsWith('#/admin');
};

export default function App() {
  const [isAdminView, setIsAdminView] = useState<boolean>(checkIsAdminUrl);
  const [adminUser, setAdminUser] = useState<{ id: string; username: string } | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const [products, setProducts] = useState<Product[]>([DEFAULT_PRODUCT]);
  const [settings, setSettings] = useState<SiteSettings | null>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [isLookupOpen, setIsLookupOpen] = useState<boolean>(false);

  // Check admin session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            if (data.success && data.user) {
              setAdminUser(data.user);
              setIsCheckingAuth(false);
              return;
            }
          }
        }
      } catch {
        // Not authenticated on server
      }

      // Check localStorage fallback for Cloudflare Pages static hosting
      try {
        const localSession = localStorage.getItem('admin_session_user');
        if (localSession) {
          setAdminUser(JSON.parse(localSession));
        }
      } catch {}

      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  // Handle URL change via pathname or hash (URL system for admin)
  useEffect(() => {
    const handleUrlChange = () => {
      setIsAdminView(checkIsAdminUrl());
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Fetch products and settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, setRes] = await Promise.all([
          fetch('/api/products').catch(() => null),
          fetch('/api/settings').catch(() => null),
        ]);

        if (prodRes && prodRes.ok) {
          const contentType = prodRes.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const prodData = await prodRes.json();
            if (prodData.success && prodData.products && prodData.products.length > 0) {
              setProducts(prodData.products);
              localStorage.setItem('custom_products', JSON.stringify(prodData.products));
              trackViewItem(prodData.products[0]);
            }
          }
        } else {
          const savedProds = localStorage.getItem('custom_products');
          if (savedProds) {
            try {
              const list = JSON.parse(savedProds);
              if (Array.isArray(list) && list.length > 0) {
                setProducts(list);
                trackViewItem(list[0]);
              }
            } catch {}
          }
        }

        if (setRes && setRes.ok) {
          const contentType = setRes.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const setData = await setRes.json();
            if (setData.success && setData.settings) {
              setSettings(setData.settings);
              if (setData.settings.gtmId) {
                initGTM(setData.settings.gtmId);
              }
            }
          }
        } else {
          const savedSet = localStorage.getItem('site_settings');
          if (savedSet) {
            try {
              const parsed = JSON.parse(savedSet);
              if (parsed) setSettings(parsed);
            } catch {}
          }
        }
      } catch (err) {
        console.warn('API fetch warning, using defaults:', err);
      }
    };

    fetchData();
  }, []);

  const navigateToSite = () => {
    if (window.location.hash) {
      window.history.pushState({}, '', window.location.pathname);
    }
    window.history.pushState({}, '', '/');
    setIsAdminView(false);
  };

  // Open modal or scroll to form
  const handleOpenOrder = (qty = 1) => {
    setSelectedQuantity(qty);
    setIsOrderModalOpen(true);
  };

  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsOrderModalOpen(true);
    }
  };

  // If Admin View
  if (isAdminView) {
    if (isCheckingAuth) {
      return (
        <div className="min-h-screen bg-[#03130c] flex items-center justify-center text-amber-400 text-sm">
          এডমিন সেশন যাচাই করা হচ্ছে...
        </div>
      );
    }

    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => setAdminUser(user)}
          onBackToSite={navigateToSite}
        />
      );
    }

    return (
      <AdminDashboard
        user={adminUser}
        onLogout={() => setAdminUser(null)}
        onBackToSite={navigateToSite}
      />
    );
  }

  // Public Landing Page View
  const mainProduct = products[0];

  return (
    <div className="min-h-screen bg-[#060a08] text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* 1. Ticker Marquee Strip */}
      <AnnouncementMarquee />

      {/* 2. Premium Header */}
      <Header
        settings={settings}
        onOrderClick={() => handleOpenOrder(1)}
        onLookupClick={() => setIsLookupOpen(true)}
      />

      <main className="flex-1">
        {isLoading || !mainProduct ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-amber-200/80 text-sm">প্রিমিয়াম কম্বো লোড হচ্ছে...</p>
          </div>
        ) : (
          <>
            {/* 3. Reference Hero Section */}
            <Hero
              product={mainProduct}
              onOrderClick={() => handleOpenOrder(1)}
            />

            {/* 4. Compact Quick Order Form (High Placement for Fast Ordering) */}
            <OrderForm product={mainProduct} settings={settings} />

            {/* 6. Featured Product Views (Alternating 3 Blocks) */}
            <FeaturedProducts
              onOrderClick={() => handleOpenOrder(1)}
              offerPrice={mainProduct.offerPrice}
            />

            {/* 7. Benefits Grid (6 Cards) */}
            <Benefits
              onOrderClick={() => handleOpenOrder(1)}
              offerPrice={mainProduct.offerPrice}
            />

            {/* 8. Comparison Table */}
            <Comparison />

            {/* 9. Special Offer & Packages (3 Pricing Cards) */}
            <PackagePricing
              baseOfferPrice={mainProduct.offerPrice}
              baseRegularPrice={mainProduct.regularPrice}
              onSelectPackage={(qty) => handleOpenOrder(qty)}
            />

            {/* 10. Verified Customer Reviews & Chat Proof */}
            <Reviews />

            {/* 10. Frequently Asked Questions */}
            <FAQ
              onOrderClick={() => handleOpenOrder(1)}
              hotline={settings?.hotline || '01886338934'}
            />
          </>
        )}
      </main>

      {/* 11. Site Footer with contact details */}
      <Footer
        settings={settings}
        onLookupClick={() => setIsLookupOpen(true)}
      />

      {/* 12. Floating Sticky CTA Controls (WhatsApp, Phone, Mobile bottom bar & scroll progress) */}
      {mainProduct && (
        <StickyCTA
          onOrderClick={() => handleOpenOrder(1)}
          offerPrice={mainProduct.offerPrice}
          whatsapp={settings?.whatsapp || '01886338934'}
          hotline={settings?.hotline || '01886338934'}
        />
      )}

      {/* 13. Instant Order Confirmation Modal (Opens on any CTA click) */}
      {mainProduct && (
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          product={mainProduct}
          settings={settings}
          initialQuantity={selectedQuantity}
        />
      )}

      {/* 14. Order Status Tracking Modal */}
      <OrderLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />

    </div>
  );
}
