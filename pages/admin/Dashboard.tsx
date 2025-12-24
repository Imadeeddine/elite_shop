
import React from 'react';
import { useAppState } from '../../context/AppContext';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  ChevronLeft,
  Phone
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { products, orders, users } = useAppState();

  const stats = [
    { label: 'إجمالي السلع', value: products.length, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%' },
    { label: 'طلبات جديدة', value: orders.length, icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5%' },
    { label: 'المستخدمين', value: users.filter(u => !u.isAdmin).length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+18%' },
    { label: 'المبيعات اليوم', value: '45,000', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+2%' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-right">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">نظرة عامة</h1>
          <p className="text-slate-500 mt-1 font-medium italic">النظام المتكامل • متصل الآن</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl border border-emerald-100 dark:border-emerald-800 animate-pulse">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">خادم النظام نشط</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-dark-900 p-6 rounded-[32px] border border-slate-100 dark:border-dark-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 rounded-2xl ${stat.bg} dark:bg-opacity-10 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                {stat.trend} <ArrowUpRight size={10} className="mr-0.5" />
              </span>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Expanded Recent Activity Section */}
      <div className="bg-white dark:bg-dark-900 rounded-[40px] border border-slate-100 dark:border-dark-800 shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">آخر النشاطات</h3>
            <p className="text-xs text-slate-400 font-bold mt-1">تزامن البيانات يتم كل ثانية</p>
          </div>
          <button className="text-indigo-600 font-black text-xs hover:underline flex items-center bg-indigo-50 dark:bg-dark-800 px-4 py-2 rounded-xl">
            عرض كل المبيعات <ChevronLeft size={14} className="mr-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.slice(0, 6).map((order, idx) => (
            <div key={idx} className="flex items-center gap-4 p-5 rounded-[28px] bg-slate-50 dark:bg-dark-800/40 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-dark-900 overflow-hidden flex-shrink-0 shadow-sm border border-slate-100 dark:border-dark-700">
                <img src={order.items[0]?.image} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-900 dark:text-white text-sm">{order.buyerName}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold mt-0.5">
                  <Phone size={10} />
                  <span>{order.buyerPhone}</span>
                </div>
                <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">ID: #{order.id.substr(-6)} • {order.totalPrice.toLocaleString()} د.ج</p>
              </div>
              <div>
                <span className="px-3 py-1.5 bg-white dark:bg-dark-900 text-indigo-600 text-[9px] font-black rounded-xl border border-indigo-50 dark:border-indigo-900/30">جديد</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="col-span-full text-center py-20">
              <Clock className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-bold">بانتظار تلقي أول طلبية...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
