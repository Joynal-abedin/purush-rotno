import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';

export const AdminMediaTab: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const loadUploadedImages = () => {
    try {
      const stored = localStorage.getItem('uploaded_media_list');
      const list = stored ? JSON.parse(stored) : ['/uploads/purush_rotno_combo.jpg'];
      setImages(list);
    } catch {
      setImages(['/uploads/purush_rotno_combo.jpg']);
    }
  };

  useEffect(() => {
    loadUploadedImages();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setMessage('ছবি আপলোড হচ্ছে...');

    const newUploaded: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 8 * 1024 * 1024) {
        continue;
      }

      try {
        const body = new FormData();
        body.append('image', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body,
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.url) {
            newUploaded.push(data.url);
            continue;
          }
        }

        // Fallback to FileReader dataURL
        const base64Url = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newUploaded.push(base64Url);
      } catch {
        // FileReader fallback on error
        try {
          const base64Url = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          newUploaded.push(base64Url);
        } catch {}
      }
    }

    if (newUploaded.length > 0) {
      const updated = [...newUploaded, ...images];
      setImages(updated);
      try {
        localStorage.setItem('uploaded_media_list', JSON.stringify(updated));
      } catch {}
      setMessage(`${newUploaded.length}টি ছবি সফলভাবে আপলোড করা হয়েছে!`);
    } else {
      setMessage('ছবি আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    }

    setIsUploading(false);
    setTimeout(() => setMessage(null), 4000);
    e.target.value = '';
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDeleteImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updated);
    try {
      localStorage.setItem('uploaded_media_list', JSON.stringify(updated));
    } catch {}
    setMessage('ছবি সফলভাবে মুছে ফেলা হয়েছে।');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header card */}
      <div className="p-6 rounded-3xl bg-[#062319] border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold font-serif-luxury text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-amber-400" />
            <span>মিডিয়া ও ইমেজ আপলোড ম্যানেজার</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            আপনার ইচ্ছমতো যেকোনো ছবি আপলোড করুন, লিংক কপি করুন এবং পণ্যে ব্যবহার করুন।
          </p>
        </div>

        <label className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-5 py-3 rounded-xl shadow-lg transition cursor-pointer shrink-0">
          <Upload className="w-5 h-5" />
          <span>{isUploading ? 'আপলোড হচ্ছে...' : 'নতুন ছবি আপলোড করুন'}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            className="group relative rounded-2xl bg-[#051c14] border border-emerald-900/60 overflow-hidden shadow-md flex flex-col"
          >
            <div className="aspect-square bg-black/50 overflow-hidden relative">
              <img
                src={imgUrl}
                alt={`Uploaded ${idx}`}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              {idx === 0 && (
                <span className="absolute top-2 left-2 bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                  প্রধান ছবি
                </span>
              )}
            </div>

            <div className="p-3 flex items-center justify-between gap-2 bg-[#062319]/90 border-t border-emerald-900/40">
              <span className="text-[11px] font-mono text-stone-300 truncate">
                {imgUrl.split('/').pop()}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(imgUrl)}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black text-amber-300 border border-amber-500/30 transition cursor-pointer"
                  title="লিংক কপি করুন"
                >
                  {copiedUrl === imgUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteImage(idx)}
                  className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/40 transition cursor-pointer"
                  title="ছবি মুছুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="py-16 text-center text-stone-400 text-sm bg-[#062319]/40 rounded-2xl border border-dashed border-emerald-900">
          কোনো ছবি আপলোড করা হয়নি। উপরে "নতুন ছবি আপলোড করুন" বাটনে ক্লিক করে ছবি যুক্ত করুন।
        </div>
      )}

    </div>
  );
};
