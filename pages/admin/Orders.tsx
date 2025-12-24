
import React from 'react';
import { useAppState } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import { 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Phone, 
  User, 
  Calendar,
  Wallet,
  Truck as TruckIcon,
  PackageCheck,
  MoreHorizontal
} from 'lucide-react';

const AdminOrders: React.FC = () => {
  const { orders, setOrders } = useAppState();

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const getStatusDisplay = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.ACCEPTED: return { text: 'تم القبول', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' };
      case OrderStatus.REJECTED: return { text: 'مرفوض', color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800' };
      case OrderStatus.PENDING: return { text: 'بانتظار المراجعة', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800' };
      case OrderStatus.SHIPPED: return { text: 'جاري الشحن', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' };
      case OrderStatus.COMPLETED: return { text: 'تم التسليم', color: 'text-slate-900 bg-slate-100 dark:bg-dark-800 border-slate-200 dark:border-dark-700' };
      default: return { text: status, color: 'text-slate-600 bg-slate-50 dark:bg-dark-800 border-slate-100 dark:border-dark-700' };
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 text-right">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">إدارة المبيعات</h1>
          <p className="text-slate-500 font-medium">راجع الطلبات وقم بقبولها أو رفضها (الخطوة رقم 7)</p>
        </div>
        <div className="flex bg-white dark:bg-dark-900 p-1.5 rounded-2xl border border-slate-100 dark:border-dark-800 shadow-sm">
           <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg">الكل ({orders.length})</button>
           <button className="px-6 py-2.5 text-slate-400 text-xs font-black">المعلقة ({orders.filter(o => o.status === OrderStatus.PENDING).length})</button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-900 rounded-[40px] border border-slate-100 dark:border-dark-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 dark:bg-dark-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-dark-800">
                <th className="px-8 py-6">المنتج والزبون</th>
                <th className="px-8 py-6">تفاصيل الدفع</th>
                <th className="px-8 py-6">التاريخ / القيمة</th>
                <th className="px-8 py-6">الحالة</th>
                <th className="px-8 py-6">الإجراء (قبول/رفض)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-dark-800">
              {orders.map(order => {
                const statusInfo = getStatusDisplay(order.status);
                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/30 transition-colors group">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[22px] bg-slate-100 dark:bg-dark-800 overflow-hidden shadow-sm border border-slate-100 dark:border-dark-700 group-hover:scale-105 transition-all">
                          <img src={order.items?.[0]?.image} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-base mb-1">{order.buyerName}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold">
                            <Phone size={12} className="text-emerald-500" /> {order.buyerPhone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                       <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black ${order.paymentMethod === 'Wallet' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 'text-slate-600 bg-slate-50 border-slate-200'}`}>
                          {order.paymentMethod === 'Wallet' ? <Wallet size={12} /> : <TruckIcon size={12} />}
                          {order.paymentMethod === 'Wallet' ? 'دفع عبر المحفظة' : 'الدفع عند الاستلام'}
                       </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] mb-1">
                        <Calendar size={12} /> {new Date(order.date).toLocaleDateString('ar-DZ')}
                      </div>
                      <p className="text-xl font-black text-indigo-600">{order.totalPrice.toLocaleString()} د.ج</p>
                    </td>
                    <td className="px-8 py-8">
                      <span className={`px-4 py-2 rounded-2xl text-[10px] font-black border ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-3">
                        {order.status === OrderStatus.PENDING && (
                          <>
                            <button 
                              onClick={() => updateStatus(order.id, OrderStatus.ACCEPTED)}
                              className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-100/50"
                              title="قبول الطلب"
                            >
                              <CheckCircle2 size={20} />
                            </button>
                            <button 
                              onClick={() => updateStatus(order.id, OrderStatus.REJECTED)}
                              className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-lg shadow-rose-100/50"
                              title="رفض الطلب"
                            >
                              <XCircle size={20} />
                            </button>
                          </>
                        )}
                        {order.status === OrderStatus.ACCEPTED && (
                          <button 
                            onClick={() => updateStatus(order.id, OrderStatus.SHIPPED)}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                          >
                            <Truck size={16} /> شحن المنتج
                          </button>
                        )}
                        {order.status === OrderStatus.SHIPPED && (
                          <button 
                            onClick={() => updateStatus(order.id, OrderStatus.COMPLETED)}
                            className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-xl hover:bg-black transition-all flex items-center gap-2"
                          >
                            <PackageCheck size={16} /> تأكيد التسليم
                          </button>
                        )}
                        <button className="p-3 text-slate-300 hover:text-slate-600 dark:hover:text-white transition-all">
                           <MoreHorizontal size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-32 text-center text-slate-300 font-black italic">
                    لا توجد عمليات بيع حالياً بانتظار نشاطك التجاري...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
