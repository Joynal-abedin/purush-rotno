import React, { useState } from 'react';
import { Lock, User, AlertCircle, ArrowLeft, Shield } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: { id: string; username: string }) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok && data.success) {
          localStorage.setItem('admin_session_user', JSON.stringify(data.user));
          onLoginSuccess(data.user);
          return;
        } else {
          throw new Error(data.message || 'লগইন ব্যর্থ হয়েছে');
        }
      }
      throw new Error('FALLBACK_AUTH');
    } catch (err: any) {
      // Cloudflare Pages / Static deployment fallback authentication
      const savedUser = localStorage.getItem('admin_auth_user') || 'admin';
      const savedPass = localStorage.getItem('admin_auth_pass') || 'admin123';

      if (username.trim() === savedUser && password === savedPass) {
        const localUser = { id: 'admin-local', username: savedUser };
        localStorage.setItem('admin_session_user', JSON.stringify(localUser));
        onLoginSuccess(localUser);
        return;
      }

      if (err.message && err.message !== 'FALLBACK_AUTH') {
        setError(err.message);
      } else {
        setError('ভুল ইউজারনেম বা পাসওয়ার্ড দেওয়া হয়েছে');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#03130c] flex flex-col justify-center items-center p-4">
      
      {/* Back button */}
      <div className="w-full max-w-md mb-4">
        <button
          onClick={onBackToSite}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 transition-colors cursor-pointer py-1.5 px-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ল্যান্ডিং পেজে ফিরে যান</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-[#062319] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-[2px] mx-auto mb-3 shadow-lg shadow-amber-950/50">
            <div className="w-full h-full bg-[#03130c] rounded-[10px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-luxury">
            এডমিন ড্যাশবোর্ড
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            সুরক্ষিত এডমিন প্যানেলে লগইন করুন
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              ইউজারনেম
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] cursor-pointer text-sm"
          >
            {isLoading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-emerald-900/60 text-center">
          <p className="text-[11px] text-amber-400/80">
            প্রাথমিক ইউজারনেম: <code className="bg-black/50 px-1.5 py-0.5 rounded text-white">admin</code> | পাসওয়ার্ড: <code className="bg-black/50 px-1.5 py-0.5 rounded text-white">admin123</code>
          </p>
          <span className="text-[10px] text-stone-400 block mt-1">
            (লগইন করার পর সেটিংস ট্যাব থেকে পাসওয়ার্ড পরিবর্তন করতে পারেন)
          </span>
        </div>

      </div>
    </div>
  );
};
