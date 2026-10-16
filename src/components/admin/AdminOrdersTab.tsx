import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  PackageCheck,
  Truck,
  XCircle,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  X,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/index.js';
import { toBanglaNumber, formatBanglaDate } from '../../utils/format.js';

const statusBadgeClasses: Record<OrderStatus, string> = {
  Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  Processing: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  Shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  Delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const statusBangla: Record<OrderStatus, string> = {
  Pending: 'পেন্ডিং',
  Confirmed: 'কনফার্মড',
  Processing: 'প্রসেসিং',
  Shipped: 'শিপড',
  Delivered: 'ডেলিভার্ড',
  Cancelled: 'বাতিল',
};

export const AdminOrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0,
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const fetchOrders = async (page = 1) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: '10',
        search: search.trim(),
        status: statusFilter,
      });

      const res = await fetch(`/api/admin/orders?${queryParams.toString()}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages || 1);
          if (data.stats) {
            setStats(data.stats);
          }
          return;
        }
      }
      throw new Error('Fallback to local orders');
    } catch {
      // Static Cloudflare Pages fallback: retrieve orders from localStorage
      try {
        const stored = localStorage.getItem('site_orders');
        let list: Order[] = stored ? JSON.parse(stored) : [];

        if (statusFilter !== 'all') {
          list = list.filter(o => o.status === statusFilter);
        }
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          list = list.filter(o =>
            o.customerName.toLowerCase().includes(q) ||
            o.phone.includes(q) ||
            o.orderNumber.toLowerCase().includes(q)
          );
        }

        setOrders(list);
        setCurrentPage(1);
        setTotalPages(1);

        const allStored = localStorage.getItem('site_orders');
        const allList: Order[] = allStored ? JSON.parse(allStored) : [];
        setStats({
          total: allList.length,
          pending: allList.filter(o => o.status === 'Pending').length,
          confirmed: allList.filter(o => o.status === 'Confirmed').length,
          processing: allList.filter(o => o.status === 'Processing').length,
          shipped: allList.filter(o => o.status === 'Shipped').length,
          delivered: allList.filter(o => o.status === 'Delivered').length,
          cancelled: allList.filter(o => o.status === 'Cancelled').length,
          revenue: allList.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        });
      } catch {}
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(1);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setOrders(prev => prev.map(o => (o.id === orderId ? data.order : o)));
          if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(data.order);
          }
          fetchOrders(currentPage);
          return;
        }
      }
    } catch {
      // Local fallback
    }

    try {
      const stored = localStorage.getItem('site_orders');
      if (stored) {
        const list: Order[] = JSON.parse(stored);
        const updated = list.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        localStorage.setItem('site_orders', JSON.stringify(updated));
        setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch {}
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderToDelete.id}`, {
        method: 'DELETE',
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setOrderToDelete(null);
          fetchOrders(currentPage);
          return;
        }
      }
    } catch {
      // Local fallback
    }

    try {
      const stored = localStorage.getItem('site_orders');
      if (stored) {
        const list: Order[] = JSON.parse(stored);
        const updated = list.filter(o => o.id !== orderToDelete.id);
        localStorage.setItem('site_orders', JSON.stringify(updated));
        setOrderToDelete(null);
        fetchOrders(currentPage);
      }
    } catch {} finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Orders */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/70 to-[#062319] border border-amber-500/25">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>মোট অর্ডার</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-serif-luxury">
            {toBanglaNumber(stats.total)}
          </div>
        </div>

        {/* Pending Orders */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/70 to-[#062319] border border-amber-500/25">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>অপেক্ষমাণ (Pending)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-serif-luxury">
            {toBanglaNumber(stats.pending)}
          </div>
        </div>

        {/* Completed / Delivered */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/70 to-[#062319] border border-amber-500/25">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>ডেলিভার্ড সফল</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-serif-luxury">
            {toBanglaNumber(stats.delivered)}
          </div>
        </div>

        {/* Revenue */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/70 to-[#062319] border border-amber-500/25">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>কনফার্মড বিক্রয়</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-serif-luxury">
            ৳{toBanglaNumber(stats.revenue)}
          </div>
        </div>

      </div>

      {/* 2. Filters & Search Bar */}
      <div className="p-4 rounded-xl bg-[#062319] border border-emerald-800/40 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="অর্ডার আইডি, গ্রাহকের নাম বা মোবাইল দিয়ে খুঁজুন..."
            className="w-full bg-emerald-950/60 border border-emerald-800/60 focus:border-amber-400 rounded-xl py-2 pl-10 pr-4 text-white text-xs outline-none"
          />
        </form>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: 'সব' },
            { id: 'Pending', label: 'পেন্ডিং' },
            { id: 'Confirmed', label: 'কনফার্মড' },
            { id: 'Processing', label: 'প্রসেসিং' },
            { id: 'Shipped', label: 'শিপড' },
            { id: 'Delivered', label: 'ডেলিভার্ড' },
            { id: 'Cancelled', label: 'বাতিল' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setStatusFilter(item.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === item.id
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'bg-emerald-950/60 text-stone-300 hover:text-white border border-emerald-800/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>

      {/* 3. Orders Table (Desktop) / Cards (Mobile) */}
      <div className="bg-[#062319] border border-amber-500/20 rounded-xl overflow-hidden shadow-xl">
        
        {isLoading ? (
          <div className="py-16 text-center text-stone-400 text-sm">
            অর্ডার লোড হচ্ছে...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-stone-400 text-sm">
            কোনো অর্ডার খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#03130c] text-amber-300/80 uppercase font-semibold border-b border-emerald-900/60">
                  <tr>
                    <th className="py-3 px-4">অর্ডার আইডি ও তারিখ</th>
                    <th className="py-3 px-4">গ্রাহকের বিবরণ</th>
                    <th className="py-3 px-4">পণ্য ও পরিমাণ</th>
                    <th className="py-3 px-4">মোট বিল</th>
                    <th className="py-3 px-4">বর্তমান স্ট্যাটাস</th>
                    <th className="py-3 px-4 text-right">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40 text-stone-200">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-emerald-950/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium">
                        <div className="text-amber-300 font-bold">{ord.orderNumber}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">{formatBanglaDate(ord.createdAt)}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{ord.customerName}</div>
                        <div className="text-stone-300">{ord.phone}</div>
                        <div className="text-[11px] text-stone-400 truncate max-w-xs">{ord.address}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-amber-200">{ord.productName}</div>
                        <div className="text-stone-400">{toBanglaNumber(ord.quantity)} টি প্যাক ({ord.deliveryLocation === 'dhaka' ? 'ঢাকা' : 'ঢাকার বাইরে'})</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white font-serif-luxury text-sm">
                        ৳{toBanglaNumber(ord.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                          className={`text-xs font-semibold py-1 px-2.5 rounded-lg border outline-none cursor-pointer bg-[#03130c] ${statusBadgeClasses[ord.status]}`}
                        >
                          <option value="Pending">পেন্ডিং</option>
                          <option value="Confirmed">কনফার্মড</option>
                          <option value="Processing">প্রসেসিং</option>
                          <option value="Shipped">শিপড</option>
                          <option value="Delivered">ডেলিভার্ড</option>
                          <option value="Cancelled">বাতিল</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            title="বিস্তারিত দেখুন"
                            className="p-1.5 text-stone-300 hover:text-amber-300 rounded hover:bg-emerald-900/50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setOrderToDelete(ord)}
                            title="অর্ডার মুছুন"
                            className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-emerald-900/40">
              {orders.map((ord) => (
                <div key={ord.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-amber-300 text-sm block">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {formatBanglaDate(ord.createdAt)}
                      </span>
                    </div>
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className={`text-xs font-semibold py-1 px-2 rounded-lg border outline-none bg-[#03130c] ${statusBadgeClasses[ord.status]}`}
                    >
                      <option value="Pending">পেন্ডিং</option>
                      <option value="Confirmed">কনফার্মড</option>
                      <option value="Processing">প্রসেসিং</option>
                      <option value="Shipped">শিপড</option>
                      <option value="Delivered">ডেলিভার্ড</option>
                      <option value="Cancelled">বাতিল</option>
                    </select>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-white">{ord.customerName} • {ord.phone}</div>
                    <div className="text-stone-300 text-[11px]">{ord.address}</div>
                    <div className="text-amber-200/90 pt-1">
                      {ord.productName} ({toBanglaNumber(ord.quantity)} টি)
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-emerald-900/30">
                      <span className="text-stone-400">মোট মূল্য:</span>
                      <span className="font-bold text-white font-serif-luxury text-sm">৳{toBanglaNumber(ord.totalAmount)}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="flex items-center gap-1 text-xs text-amber-300 bg-emerald-950 border border-emerald-700/50 py-1.5 px-3 rounded-lg"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>বিস্তারিত</span>
                    </button>
                    <button
                      onClick={() => setOrderToDelete(ord)}
                      className="flex items-center gap-1 text-xs text-red-400 bg-red-950/40 border border-red-800/50 py-1.5 px-3 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-3 bg-[#03130c] border-t border-emerald-900/60 flex items-center justify-between text-xs text-stone-300">
            <span>পৃষ্ঠা {toBanglaNumber(currentPage)} / {toBanglaNumber(totalPages)}</span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => fetchOrders(currentPage - 1)}
                className="p-1.5 rounded-lg border border-emerald-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-900/50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => fetchOrders(currentPage + 1)}
                className="p-1.5 rounded-lg border border-emerald-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-900/50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#062319] border border-amber-500/40 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-emerald-900/50"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white font-serif-luxury mb-4">
              অর্ডারের পূর্ণাঙ্গ বিবরণী
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-emerald-900/40">
                <span className="text-stone-400">অর্ডার নম্বর:</span>
                <span className="font-mono font-bold text-amber-300">{selectedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-900/40">
                <span className="text-stone-400">তারিখ ও সময়:</span>
                <span className="text-stone-200">{formatBanglaDate(selectedOrder.createdAt)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-900/40">
                <span className="text-stone-400">গ্রাহকের নাম:</span>
                <span className="font-semibold text-white">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-900/40">
                <span className="text-stone-400">মোবাইল নম্বর:</span>
                <a href={`tel:${selectedOrder.phone}`} className="font-semibold text-amber-400 hover:underline">
                  {selectedOrder.phone}
                </a>
              </div>
              <div className="py-1.5 border-b border-emerald-900/40">
                <span className="text-stone-400 block mb-1">পূর্ণ ঠিকানা:</span>
                <span className="text-white block bg-black/40 p-2.5 rounded-lg border border-emerald-900/50">
                  {selectedOrder.address}
                </span>
              </div>
              {selectedOrder.notes && (
                <div className="py-1.5 border-b border-emerald-900/40">
                  <span className="text-stone-400 block mb-1">কাস্টমার নোট:</span>
                  <span className="text-amber-200/90 block bg-black/40 p-2 rounded-lg text-xs italic">
                    "{selectedOrder.notes}"
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-emerald-900/40">
                <span className="text-stone-400">পণ্য:</span>
                <span className="text-amber-300 font-medium">{selectedOrder.productName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-900/40">
                <span className="text-stone-400">পরিমাণ:</span>
                <span className="text-white">{toBanglaNumber(selectedOrder.quantity)} টি</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-900/40">
                <span className="text-stone-400">ডেলিভারি ফি:</span>
                <span className="text-white">৳{toBanglaNumber(selectedOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between py-2 text-base font-bold text-amber-400">
                <span>সর্বমোট মূল্য:</span>
                <span>৳{toBanglaNumber(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <a
                href={`tel:${selectedOrder.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl text-xs"
              >
                <Phone className="w-4 h-4" />
                <span>গ্রাহককে কল করুন</span>
              </a>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 py-2.5 px-4 rounded-xl text-xs cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#062319] border border-red-500/40 rounded-2xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">অর্ডার ডিলিট নিশ্চিত করুন</h3>
            <p className="text-xs text-stone-300 mb-5 leading-relaxed">
              আপনি কি নিশ্চিতভাবে অর্ডার <span className="font-mono font-bold text-amber-300">{orderToDelete.orderNumber}</span> মুছে ফেলতে চান? এটি স্থায়ীভাবে ডাটাবেজ থেকে মুছে যাবে।
            </p>
            <div className="flex gap-2">
              <button
                disabled={actionLoading}
                onClick={handleDeleteOrder}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {actionLoading ? 'মুছে ফেলা হচ্ছে...' : 'হ্যাঁ, মুছে ফেলুন'}
              </button>
              <button
                onClick={() => setOrderToDelete(null)}
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
