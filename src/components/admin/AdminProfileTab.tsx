import React, { useState } from 'react';
import { KeyRound, Check, AlertCircle, Shield } from 'lucide-react';

export const AdminProfileTab: React.FC = () => {
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError('নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newUsername: newUsername.trim() || undefined,
          currentPassword,
          newPassword: newPassword || undefined,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'আপডেট করতে ব্যর্থ হয়েছে');
        }
      } else {
        // Static hosting fallback
        const savedPass = localStorage.getItem('admin_auth_pass') || 'admin123';
        if (currentPassword !== savedPass) {
          throw new Error('বর্তমান পাসওয়ার্ড সঠিক নয়');
        }
      }

      if (newUsername.trim()) {
        localStorage.setItem('admin_auth_user', newUsername.trim());
      }
      if (newPassword) {
        localStorage.setItem('admin_auth_pass', newPassword);
      }

      setSuccess('এডমিন ক্রেডেনশিয়াল সফলভাবে আপডেট হয়েছে!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setNewUsername('');
    } catch (err: any) {
      setError(err.message || 'ত্রুটি দেখা দিয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white font-serif-luxury">
          সিকিউরিটি ও এডমিন প্রোফাইল
        </h3>
        <p className="text-xs text-stone-400">
          এডমিন ইউজারনেম এবং পাসওয়ার্ড নিরাপদে পরিবর্তন করুন
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center gap-2 text-xs text-emerald-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 flex items-center gap-2 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#062319] border border-amber-500/25 space-y-4 text-xs sm:text-sm">
        
        <div>
          <label className="block text-stone-300 font-semibold mb-1">
            নতুন ইউজারনেম (পরিবর্তন করতে চাইলে লিখুন)
          </label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="ইউজারনেম অপরিবর্তিত রাখতে খালি রাখুন"
            className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
          />
        </div>

        <div className="pt-2 border-t border-emerald-900/50">
          <label className="block text-stone-300 font-semibold mb-1">
            বর্তমান পাসওয়ার্ড * (যাচাই করার জন্য আবশ্যক)
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="বর্তমান পাসওয়ার্ড লিখুন"
            className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-stone-300 font-semibold mb-1">
            নতুন পাসওয়ার্ড (পরিবর্তন করতে চাইলে)
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="নতুন পাসওয়ার্ড দিন"
            className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-stone-300 font-semibold mb-1">
            নতুন পাসওয়ার্ড পুনরায় লিখুন
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="নতুন পাসওয়ার্ড পুনরায় লিখুন"
            className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
          />
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20 text-xs"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isLoading ? 'আপডেট হচ্ছে...' : 'ক্রেডেনশিয়াল আপডেট করুন'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
