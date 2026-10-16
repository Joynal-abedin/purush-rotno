import React, { useState, useEffect } from 'react';
import { Save, Check, AlertCircle, HelpCircle } from 'lucide-react';
import { SiteSettings } from '../../types/index.js';

export const AdminSettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    brandName: '',
    hotline: '',
    whatsapp: '',
    deliveryDhaka: 70,
    deliveryOutside: 130,
    gtmId: '',
    noticeText: '',
    guaranteeText: '',
    footerAddress: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
      }
    } catch {
      setErrorMessage('সেটিংস লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'সেটিংস আপডেট ব্যর্থ হয়েছে');
      }

      setSuccessMessage('ওয়েবসাইট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'সেটিংস সংরক্ষণে ত্রুটি দেখা দিয়েছে');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-stone-400 text-sm">সেটিংস লোড হচ্ছে...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white font-serif-luxury">
          ওয়েবসাইট ও ট্র্যাকিং সেটিংস
        </h3>
        <p className="text-xs text-stone-400">
          ব্র্যান্ড তথ্য, কন্টাক্ট নম্বর, ডেলিভারি চার্জ এবং Google Tag Manager কনফিগার করুন
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center gap-2 text-xs text-emerald-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 flex items-center gap-2 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-[#062319] border border-amber-500/25 space-y-5 text-xs sm:text-sm">
        
        {/* Brand Name */}
        <div>
          <label className="block text-stone-300 font-semibold mb-1">
            ব্র্যান্ডের নাম
          </label>
          <input
            type="text"
            required
            value={settings.brandName}
            onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
            className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
          />
        </div>

        {/* Contact Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-stone-300 font-semibold mb-1">
              হটলাইন নম্বর (Call)
            </label>
            <input
              type="text"
              required
              value={settings.hotline}
              onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
              className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">
              হোয়াটসঅ্যাপ নম্বর (WhatsApp)
            </label>
            <input
              type="text"
              required
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
            />
          </div>
        </div>

        {/* Delivery Charges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-stone-300 font-semibold mb-1">
              ডেলিভারি চার্জ (ঢাকা সিটি - ৳)
            </label>
            <input
              type="number"
              required
              value={settings.deliveryDhaka}
              onChange={(e) => setSettings({ ...settings, deliveryDhaka: Number(e.target.value) })}
              className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">
              ডেলিভারি চার্জ (ঢাকার বাইরে - ৳)
            </label>
            <input
              type="number"
              required
              value={settings.deliveryOutside}
              onChange={(e) => setSettings({ ...settings, deliveryOutside: Number(e.target.value) })}
              className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
            />
          </div>
        </div>

        {/* Google Tag Manager Container ID */}
        <div className="p-4 rounded-xl bg-black/40 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-amber-300 font-semibold">
              Google Tag Manager (GTM) Container ID
            </label>
            <span className="text-[10px] text-stone-400 font-mono">যেমন: GTM-XXXXXXX</span>
          </div>
          <input
            type="text"
            value={settings.gtmId || ''}
            placeholder="GTM-XXXXXXX"
            onChange={(e) => setSettings({ ...settings, gtmId: e.target.value.trim().toUpperCase() })}
            className="w-full bg-emerald-950/80 border border-amber-500/40 focus:border-amber-400 rounded-xl py-2.5 px-3 font-mono text-amber-300 text-sm outline-none"
          />
          <p className="text-[11px] text-stone-400 leading-relaxed flex items-start gap-1.5 pt-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              সঠিক GTM আইডি প্রদান করলে স্বয়ংক্রিয়ভাবে view_item, begin_checkout এবং purchase ইভেন্ট ডেটালেয়ারে ফায়ার হবে। খালি রাখলে বা GTM-XXXXXXX থাকলে GTM কোড লোড হবে না।
            </span>
          </p>
        </div>

        {/* Notice text */}
        <div>
          <label className="block text-stone-300 font-semibold mb-1">
            টপ ব্যানার নোটিশ (Top Announcement Notice)
          </label>
          <input
            type="text"
            value={settings.noticeText}
            onChange={(e) => setSettings({ ...settings, noticeText: e.target.value })}
            className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
          />
        </div>

        {/* Guarantee text */}
        <div>
          <label className="block text-stone-300 font-semibold mb-1">
            গ্যারান্টি ও ট্রাস্ট টেক্সট
          </label>
          <input
            type="text"
            value={settings.guaranteeText}
            onChange={(e) => setSettings({ ...settings, guaranteeText: e.target.value })}
            className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
          />
        </div>

        {/* Footer address */}
        <div>
          <label className="block text-stone-300 font-semibold mb-1">
            অফিস / ঠিকানা
          </label>
          <input
            type="text"
            value={settings.footerAddress}
            onChange={(e) => setSettings({ ...settings, footerAddress: e.target.value })}
            className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20 text-xs"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সংরক্ষণ করুন'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
