
import React from 'react';
import { useAppState } from '../../context/AppContext';
import { Bell, ShoppingBag, Package, Info, CheckCircle2, Trash2 } from 'lucide-react';

const AdminNotifications: React.FC = () => {
  const { notifications, orders } = useAppState();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag size={20} className="text-emerald-600" />;
      case 'stock': return <Package size={20} className="text-amber-600" />;
      default: return <Info size={20} className="text-indigo-600" />;
    }
  };

  // توليد تنبيهات بناءً على الطلبات الحقيقية
  const adminAlerts = orders.slice(0, 5).map(order => ({
    id: `order-${order.id}`,
    title: 'طلب شراء جديد',
    message: `لقد تلقيت طلباً من ${order.buyerName} (الهاتف: ${order.buyerPhone}) بقيمة ${order.totalPrice.toLocaleString()} د.ج`,
    date: 'منذ قليل',
    type: 'order',
    isRead: false
  }));

  // إضافة بعض التنبيهات الثابتة للنظام
  const systemAlerts = [
    { id: 'sys-1', title: 'تنبيه المخزون', message: 'بعض السلع أوشكت على النفاذ، يرجى مراجعة المخزون.', date: 'اليوم', type: 'stock', isRead: true },
    { id: 'sys-2', title: 'تحديث النظام', message: 'تم تحسين سرعة إرسال الطلبات لتكون فورية تماماً.', date: 'منذ يومين', type: 'info', isRead: true },
  ];

  const allAlerts = [...adminAlerts, ...systemAlerts];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">التنبيهات</h1>
          <p className="text-slate-500 mt-1 font-medium">ابقَ على اطلاع بكل ما يحدث في متجرك</p>
        </div>
        <button className="text-indigo-600 font-black text-sm flex items-center gap-2 hover:underline">
          <CheckCircle2 size={16} /> تحديد الكل كمقروء
        </button>
      </div>

      <div className="bg-white dark:bg-dark-900 rounded-[40px] border border-slate-100 dark:border-dark-800 shadow-sm overflow-hidden">
        {allAlerts.length > 0 ? (
          <div className="divide-y divide-slate-50 dark:divide-dark-800">
            {allAlerts.map((n) => (
              <div key={n.id} className={`p-8 flex items-start gap-6 hover:bg-slate-50/50 dark:hover:bg-dark-800/30 transition-all group ${!n.isRead ? 'border-r-4 border-r-indigo-600' : ''}`}>
                <div className={`p-4 rounded-2xl ${!n.isRead ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-slate-50 dark:bg-dark-800'} transition-all group-hover:scale-110`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-lg font-black ${!n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                      {n.title}
                    </h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{n.date}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-2xl">{n.message}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-3 text-slate-300 hover:text-rose-500 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-50 dark:bg-dark-800 rounded-full flex items-center justify-center text-slate-200 dark:text-dark-700 mb-6">
              <Bell size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-400">لا توجد تنبيهات حالياً</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
