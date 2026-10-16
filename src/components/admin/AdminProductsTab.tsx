import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Check,
  X,
  AlertTriangle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Star,
  Sparkles,
  Cloud,
  GitBranch,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '../../types/index.js';
import { toBanglaNumber } from '../../utils/format.js';

export const AdminProductsTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    regularPrice: 1990,
    offerPrice: 1290,
    description: '',
    detailsText: '',
    usageText: '',
    images: ['/uploads/purush_rotno_combo.jpg'],
    inStock: true,
    isPublished: true,
  });

  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quickMessage, setQuickMessage] = useState<string | null>(null);
  const [quickUploading, setQuickUploading] = useState<boolean>(false);
  const [showDeployGuide, setShowDeployGuide] = useState<boolean>(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsCreating(false);
    setFormData({
      name: prod.name,
      subtitle: prod.subtitle || '',
      regularPrice: prod.regularPrice,
      offerPrice: prod.offerPrice,
      description: prod.description,
      detailsText: (prod.details || []).join('\n'),
      usageText: (prod.usage || []).join('\n'),
      images: prod.images && prod.images.length > 0 ? prod.images : ['/uploads/purush_rotno_combo.jpg'],
      inStock: prod.inStock,
      isPublished: prod.isPublished,
    });
    setError(null);
  };

  const openCreate = () => {
    setIsCreating(true);
    setEditingProduct(null);
    setFormData({
      name: '',
      subtitle: '',
      regularPrice: 1990,
      offerPrice: 1290,
      description: '',
      detailsText: '',
      usageText: '',
      images: ['/uploads/purush_rotno_combo.jpg'],
      inStock: true,
      isPublished: true,
    });
    setError(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 8 * 1024 * 1024) continue;

      const body = new FormData();
      body.append('image', file);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body,
        });
        const data = await res.json();
        if (res.ok && data.success && data.url) {
          newUrls.push(data.url);
        } else {
          // Base64 fallback
          const b64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          newUrls.push(b64);
        }
      } catch {
        const b64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newUrls.push(b64);
      }
    }

    if (newUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...newUrls, ...prev.images],
      }));
    }
    setUploadingImage(false);
    e.target.value = '';
  };

  const handleSetPrimaryImageInForm = (index: number) => {
    setFormData(prev => {
      const selected = prev.images[index];
      const rest = prev.images.filter((_, idx) => idx !== index);
      return { ...prev, images: [selected, ...rest] };
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleRemoveAllDemoImagesInForm = () => {
    const isDemo = (img: string) =>
      img.includes('purush_rotno_combo') ||
      img.includes('purush_rotno_halua') ||
      img.includes('figure_care');

    const nonDemo = formData.images.filter(img => !isDemo(img));
    if (nonDemo.length === 0) {
      alert('সতর্কতা: অনুগ্রহ করে আগে আপনার নিজস্ব অন্তত একটি নতুন ছবি আপলোড করুন, তারপর ডেমো ছবি মুছতে পারবেন।');
      return;
    }
    setFormData(prev => ({ ...prev, images: nonDemo }));
  };

  // Quick Direct Handlers for the Main Product on the overview screen
  const handleQuickUploadForProduct = async (product: Product, file: File) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('ছবির সাইজ ৮ মেগাবাইটের কম হতে হবে');
      return;
    }

    setQuickUploading(true);
    setQuickMessage('ছবি আপলোড ও গিটহাবে সেভের জন্য প্রস্তুত করা হচ্ছে...');
    const body = new FormData();
    body.append('image', file);

    try {
      let newImageUrl = '';
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        newImageUrl = data.url;
      } else {
        newImageUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      const updatedImages = [newImageUrl, ...(product.images || [])];
      const putRes = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          images: updatedImages,
        }),
      });
      if (putRes.ok) {
        setQuickMessage('নতুন ছবি সফলভাবে আপলোড ও প্রধান লাইভ ছবি হিসেবে যুক্ত হয়েছে!');
        fetchProducts();
      } else {
        setQuickMessage('ছবি আপলোড হয়েছে কিন্তু পণ্য আপডেট ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      setQuickMessage('আপলোড ত্রুটি: ' + (err.message || 'ব্যর্থ হয়েছে'));
    } finally {
      setQuickUploading(false);
      setTimeout(() => setQuickMessage(null), 4000);
    }
  };

  const handleQuickSetPrimary = async (product: Product, index: number) => {
    if (!product.images || index <= 0) return;
    const selected = product.images[index];
    const rest = product.images.filter((_, idx) => idx !== index);
    const updatedImages = [selected, ...rest];

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          images: updatedImages,
        }),
      });
      if (res.ok) {
        setQuickMessage('প্রধান ছবি সফলভাবে পরিবর্তন করা হয়েছে!');
        fetchProducts();
      }
    } catch {
      setQuickMessage('ছবি আপডেট ব্যর্থ হয়েছে');
    }
    setTimeout(() => setQuickMessage(null), 3000);
  };

  const handleQuickDeleteImage = async (product: Product, index: number) => {
    if (!confirm('আপনি কি এই ছবিটি পণ্য থেকে মুছে ফেলতে চান?')) return;
    const targetUrl = product.images[index];
    const updatedImages = product.images.filter((_, idx) => idx !== index);

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          images: updatedImages.length > 0 ? updatedImages : ['/uploads/purush_rotno_combo.jpg'],
        }),
      });
      if (res.ok) {
        if (targetUrl && targetUrl.startsWith('/uploads/')) {
          try {
            await fetch('/api/admin/delete-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: targetUrl }),
            });
          } catch {}
        }
        setQuickMessage('ছবি সফলভাবে মোছা হয়েছে!');
        fetchProducts();
      }
    } catch {
      setQuickMessage('ছবি মোছা সম্ভব হয়নি');
    }
    setTimeout(() => setQuickMessage(null), 3000);
  };

  const handleQuickRemoveDemoImages = async (product: Product) => {
    const isDemo = (img: string) =>
      img.includes('purush_rotno_combo') ||
      img.includes('purush_rotno_halua') ||
      img.includes('figure_care');

    const nonDemo = (product.images || []).filter(img => !isDemo(img));
    if (nonDemo.length === 0) {
      alert('সতর্কতা: অনুগ্রহ করে আগে আপনার নিজস্ব অন্তত একটি নতুন ছবি আপলোড করুন। তারপর ডেমো ছবি মুছতে পারবেন, যাতে ওয়েবসাইট কখনোই ছবিহীন না থাকে।');
      return;
    }

    if (!confirm('আপনি কি পূর্বের সব ডেমো ছবি মুছে শুধুমাত্র আপনার নতুন আপলোড করা ছবিগুলো রাখতে চান?')) return;

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          images: nonDemo,
        }),
      });
      if (res.ok) {
        setQuickMessage('সব ডেমো ছবি সফলভাবে সরানো হয়েছে! এখন শুধুমাত্র আপনার আপলোড করা ছবি লাইভ রয়েছে।');
        fetchProducts();
      }
    } catch {
      setQuickMessage('ডেমো ছবি সরাতে সমস্যা হয়েছে');
    }
    setTimeout(() => setQuickMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('পণ্যের নাম প্রদান করুন');
      return;
    }

    setSaveLoading(true);
    setError(null);

    const payload = {
      name: formData.name.trim(),
      subtitle: formData.subtitle.trim(),
      regularPrice: Number(formData.regularPrice),
      offerPrice: Number(formData.offerPrice),
      description: formData.description.trim(),
      details: formData.detailsText.split('\n').map(s => s.trim()).filter(Boolean),
      usage: formData.usageText.split('\n').map(s => s.trim()).filter(Boolean),
      images: formData.images.length > 0 ? formData.images : ['/uploads/purush_rotno_combo.jpg'],
      inStock: formData.inStock,
      isPublished: formData.isPublished,
    };

    try {
      const url = isCreating ? '/api/admin/products' : `/api/admin/products/${editingProduct?.id}`;
      const method = isCreating ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'সংরক্ষণ ব্যর্থ হয়েছে');
      }

      setEditingProduct(null);
      setIsCreating(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || 'পণ্য সংরক্ষণ করতে ত্রুটি হয়েছে');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProductToDelete(null);
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white font-serif-luxury">
            পণ্য ব্যবস্থাপনা
          </h3>
          <p className="text-xs text-stone-400">
            পণ্যের নাম, ছবি, মূল্যছাড় ও স্টক স্ট্যাটাস আপডেট করুন
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পণ্য যোগ করুন</span>
        </button>
      </div>

      {/* Toast Notification */}
      {quickMessage && (
        <div className="p-3.5 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-200 text-xs sm:text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{quickMessage}</span>
          </div>
          <button onClick={() => setQuickMessage(null)} className="text-stone-400 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* QUICK IMAGE & MEDIA MANAGER CARD */}
      {products.length > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0c271b] via-[#081a12] to-[#040e09] border-2 border-amber-500/40 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <h4 className="text-base sm:text-lg font-bold text-white font-serif-luxury">
                  ছবি আপলোড ও লাইভ ইমেজ কন্ট্রোল (Media Manager)
                </h4>
              </div>
              <p className="text-xs text-stone-300 mt-1">
                আপনার নতুন ছবি আপলোড করুন, প্রধান ছবি পরিবর্তন করুন এবং চাইলে পূর্বের ডেমো ছবি এক ক্লিকে মুছে ফেলুন
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleQuickRemoveDemoImages(products[0])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                title="পূর্বের ডেমো ছবি রিমুভ করুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>সব ডেমো ছবি মুছুন</span>
              </button>

              <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/25">
                <Upload className="w-4 h-4" />
                <span>{quickUploading ? 'আপলোড হচ্ছে...' : 'নতুন ছবি আপলোড করুন'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={quickUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleQuickUploadForProduct(products[0], file);
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Current Live Images Gallery */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-amber-300 mb-2.5">
              <span>বর্তমানে ব্যবহৃত লাইভ ছবিসমূহ ({products[0].images?.length || 0}):</span>
              <span className="text-[11px] text-stone-400">স্টার (★) চিহ্নিত ছবিটি হোমপেজের প্রধান কভার</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {(products[0].images || []).map((img, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all p-2 bg-black/60 flex flex-col justify-between ${
                    idx === 0 ? 'border-amber-400 shadow-gold' : 'border-emerald-800/60 hover:border-amber-500/50'
                  }`}
                >
                  <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-black/40 flex items-center justify-center mb-2">
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-white/10">
                    <div className="flex items-center justify-between text-[11px]">
                      {idx === 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold flex items-center gap-1 text-[10px]">
                          <Star className="w-3 h-3 fill-stone-950" />
                          প্রধান কভার
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuickSetPrimary(products[0], idx)}
                          className="px-2 py-0.5 rounded-md bg-emerald-900/80 hover:bg-amber-500 hover:text-stone-950 text-amber-300 text-[10px] font-medium transition-colors cursor-pointer"
                        >
                          প্রধান করুন
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleQuickDeleteImage(products[0], idx)}
                        className="p-1 rounded bg-red-950 hover:bg-red-600 text-red-300 hover:text-white transition-colors cursor-pointer"
                        title="ছবি মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment info & Git instructions */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-300">
            <div className="flex items-start sm:items-center gap-2.5">
              <GitBranch className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <strong className="text-white">GitHub ও Cloudflare Pages রেডি:</strong> আপলোডকৃত সব ছবি <code className="bg-black/60 px-1.5 py-0.5 rounded text-amber-300 font-mono">public/uploads/</code> এ সেভ হচ্ছে। গিট পুশ করলে ছবিগুলো গিটহাব রিপোজিটরিতে চলে যাবে।
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDeployGuide(!showDeployGuide)}
              className="text-amber-400 hover:text-amber-300 text-xs font-semibold underline cursor-pointer shrink-0"
            >
              {showDeployGuide ? 'গাইড বন্ধ করুন' : 'ডেপ্লয় নির্দেশিকা দেখুন →'}
            </button>
          </div>

          {/* Expandable Deploy Guide */}
          {showDeployGuide && (
            <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 text-xs text-stone-300 space-y-3">
              <h5 className="font-bold text-white text-sm flex items-center gap-1.5 text-amber-300">
                <Cloud className="w-4 h-4" />
                GitHub ও Cloudflare Pages এ হোস্ট করার নির্দেশিকা:
              </h5>
              
              <ol className="list-decimal list-inside space-y-1.5 text-stone-300 leading-relaxed">
                <li>
                  <strong className="text-white">GitHub এ কোড ও ছবি পুশ:</strong>
                  <pre className="bg-stone-950 p-2 rounded-lg text-amber-300 font-mono text-[11px] mt-1 overflow-x-auto">
                    git add .{'\n'}
                    git commit -m "Upload new images and updates"{'\n'}
                    git push origin main
                  </pre>
                  (আপনার <code className="text-amber-300 font-mono">public/uploads</code> ফোল্ডারটি গিট ট্র্যাকিংয়ে সুরক্ষিত আছে।)
                </li>
                <li>
                  <strong className="text-white">Cloudflare Pages ডেপ্লয়মেন্ট:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5 text-stone-400">
                    <li>Build command: <code className="text-amber-300 font-mono">npm run build</code></li>
                    <li>Build output directory: <code className="text-amber-300 font-mono">dist</code></li>
                    <li><code className="text-amber-300 font-mono">public/_redirects</code> ফাইলটি ইতিমধ্যে যুক্ত করা আছে যাতে <code className="text-amber-300 font-mono">/admin</code> পেজে কোনো ৪০৪ না আসে।</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-white">এডমিন প্যানেলে লগইন:</strong> পাবলিক ফ্রন্ট সাইটে কোনো এডমিন বাটন নেই। সরাসরি ব্রাউজারে ইউআরএল দিন: <code className="text-amber-300 font-mono">https://your-domain.com/admin</code>
                </li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="p-4 sm:p-5 rounded-2xl bg-[#062319] border border-amber-500/25 flex flex-col justify-between space-y-4"
          >
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-amber-500/30 shrink-0 bg-black/40">
                <img
                  src={p.images?.[0] || '/uploads/purush_rotno_combo.jpg'}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      p.inStock ? 'bg-emerald-400' : 'bg-red-400'
                    }`}
                  />
                  <span className="text-[11px] font-semibold text-stone-300">
                    {p.inStock ? 'ইন স্টক' : 'স্টক আউট'}
                  </span>
                  <span className="text-stone-600">·</span>
                  <span className="text-[11px] text-stone-400">
                    {p.isPublished ? 'পাবলিশড' : 'ড্রাফট'}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm sm:text-base truncate">
                  {p.name}
                </h4>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-amber-400 font-serif-luxury">
                    ৳{toBanglaNumber(p.offerPrice)}
                  </span>
                  <span className="text-xs text-stone-400 line-through font-serif-luxury">
                    ৳{toBanglaNumber(p.regularPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-emerald-900/50 flex items-center justify-between text-xs">
              <span className="text-stone-400 text-[11px]">
                ছবি: {p.images?.length || 1} টি
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(p)}
                  className="flex items-center gap-1 text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/30 py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>সম্পাদনা</span>
                </button>
                {products.length > 1 && (
                  <button
                    onClick={() => setProductToDelete(p)}
                    className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/40 border border-red-800/40 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Product Modal */}
      {(editingProduct || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#062319] border border-amber-500/40 rounded-2xl p-6 sm:p-8 my-8 shadow-2xl">
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsCreating(false);
              }}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-lg hover:bg-emerald-900/50"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-serif-luxury mb-4">
              {isCreating ? 'নতুন পণ্য যোগ করুন' : 'পণ্য তথ্য সম্পাদনা করুন'}
            </h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-xs text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Product Name */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  পণ্যের পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  সাবটাইটেল / সংক্ষিপ্ত বিবরণ
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
                />
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    রেগুলার প্রাইস (Regular Price ৳)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.regularPrice}
                    onChange={(e) => setFormData({ ...formData, regularPrice: Number(e.target.value) })}
                    className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    অফার প্রাইস (Offer Price ৳)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.offerPrice}
                    onChange={(e) => setFormData({ ...formData, offerPrice: Number(e.target.value) })}
                    className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  সংক্ষিপ্ত বিবরণ (Short Description)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none resize-none"
                />
              </div>

              {/* Details & Ingredients (one per line) */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  উপাদান ও বৈশিষ্ট্য (প্রতি লাইনে ১টি)
                </label>
                <textarea
                  rows={3}
                  value={formData.detailsText}
                  onChange={(e) => setFormData({ ...formData, detailsText: e.target.value })}
                  placeholder="খাঁটি সুন্দরবনের মধু ও জাফরান..."
                  className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none resize-none"
                />
              </div>

              {/* Usage Instructions (one per line) */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  ব্যবহারের নিয়মাবলী (প্রতি লাইনে ১টি)
                </label>
                <textarea
                  rows={3}
                  value={formData.usageText}
                  onChange={(e) => setFormData({ ...formData, usageText: e.target.value })}
                  placeholder="প্রতিদিন রাতে ১ চামচ হালুয়া..."
                  className="w-full bg-emerald-950/60 border border-emerald-800/70 focus:border-amber-400 rounded-xl py-2 px-3 text-white outline-none resize-none"
                />
              </div>

              {/* Product Images */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-stone-300 font-semibold text-xs sm:text-sm">
                    পণ্যের ছবিসমূহ (Product Images)
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveAllDemoImagesInForm}
                    className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>সব ডেমো ছবি মুছুন</span>
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3 items-center mb-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-28 rounded-xl overflow-hidden border border-amber-500/40 group bg-black/50 flex flex-col justify-between">
                      <img src={img} alt="" className="w-full h-20 object-contain p-1" />
                      
                      <div className="p-1 bg-black/80 flex items-center justify-between text-[10px]">
                        {idx === 0 ? (
                          <span className="text-amber-400 flex items-center gap-0.5 font-bold">
                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                            প্রধান
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImageInForm(idx)}
                            className="text-stone-300 hover:text-amber-300 cursor-pointer text-[10px]"
                            title="প্রধান ছবি হিসেবে সেট করুন"
                          >
                            প্রধান করুন
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 bg-red-600/80 hover:bg-red-600 text-white rounded cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <label className="w-24 h-28 rounded-xl border-2 border-dashed border-emerald-700 hover:border-amber-400 flex flex-col items-center justify-center text-stone-400 hover:text-amber-300 cursor-pointer transition-colors bg-emerald-950/30">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px] text-center px-1 font-semibold">{uploadingImage ? 'আপলোড হচ্ছে...' : 'নতুন ছবি যোগ করুন'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[11px] text-stone-400">
                  * প্রথম ছবিটি ওয়েবসাইটে প্রধান কভার ছবি হিসেবে প্রদর্শিত হবে। এক বা একাধিক ছবি সিলেক্ট করে আপলোড করতে পারেন।
                </p>
              </div>

              {/* Toggles */}
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="rounded border-emerald-700 text-amber-500 focus:ring-amber-400 w-4 h-4"
                  />
                  <span className="text-stone-300 text-xs">স্টকে আছে (In Stock)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded border-emerald-700 text-amber-500 focus:ring-amber-400 w-4 h-4"
                  />
                  <span className="text-stone-300 text-xs">ওয়েবসাইটে দৃশ্যমান (Published)</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-emerald-900/60 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreating(false);
                  }}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 py-2.5 px-4 rounded-xl cursor-pointer text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 px-6 rounded-xl cursor-pointer text-xs shadow-lg shadow-amber-500/20"
                >
                  {saveLoading ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#062319] border border-red-500/40 rounded-2xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">পণ্য মুছে ফেলা নিশ্চিত করুন</h3>
            <p className="text-xs text-stone-300 mb-5 leading-relaxed">
              আপনি কি নিশ্চিতভাবে <span className="font-bold text-amber-300">{productToDelete.name}</span> মুছে ফেলতে চান?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 py-2.5 rounded-xl text-xs cursor-pointer"
              >
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
