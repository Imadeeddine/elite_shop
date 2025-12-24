
import React, { useState } from 'react';
import { useAppState } from '../../context/AppContext';
import { OrderStatus, Order } from '../../types';
import { Clock, CheckCircle2, XCircle, Truck, Package, ShoppingBag, ArrowLeft, Star, X, Loader2, FileText } from 'lucide-react';

const BuyerOrders: React.FC = () => {
  const { orders, user, setActiveBuyerTab, rateOrder } = useAppState();
  const [ratingOrder, setRatingOrder] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [comment, setComment] = useState('');
  const [isRating, setIsRating] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  
  const myOrders = orders.filter(o => o.buyerId === user?.id).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getStatusDisplay = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return { text: 'قيد المراجعة', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: <Clock size={16} /> };
      case OrderStatus.ACCEPTED: return { text: 'تم قبول الطلب', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: <CheckCircle2 size={16} /> };
      case OrderStatus.REJECTED: return { text: 'الطلب مرفوض', color: 'text-red-600 bg-red-50 border-red-100', icon: <XCircle size={16} /> };
      case OrderStatus.SHIPPED: return { text: 'جاري التوصيل', color: 'text-blue-600 bg-blue-50 border-blue-100', icon: <Truck size={16} /> };
      case OrderStatus.COMPLETED: return { text: 'تم الاستلام', color: 'text-slate-900 bg-slate-100 border-slate-200', icon: <Package size={16} /> };
      default: return { text: status, color: 'text-slate-600 bg-slate-50 border-slate-100', icon: <Package size={16} /> };
    }
  };

  const handleRate = () => {
    if (!ratingOrder) return;
    setIsRating(true);
    setTimeout(() => {
      rateOrder(ratingOrder, ratingValue);
      setIsRating(false);
      setRatingOrder(null);
      setComment('');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">متابعة طلباتي</h2>
          <p className="text-slate-500 mt-3 text-lg font-medium italic">تتبع الخطوات من الإرسال حتى الاستلام والتقييم</p>
        </div>
      </div>

      <div className="space-y-8">
        {myOrders.map(order => {
          const status = getStatusDisplay(order.status);
          const canRate = (order.status === OrderStatus.ACCEPTED || order.status === OrderStatus.COMPLETED || order.status === OrderStatus.SHIPPED) && !order.isRated;

          return (
            <div key={order.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-all duration-500 group relative">
              <div className="w-full md:w-64 h-64 md:h-auto overflow-hidden bg-slate-50 border-l border-slate-50">
                <img src={order.items?.[0]?.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="" />
              </div>
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: #{order.id}</span>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{order.paymentMethod === 'Wallet' ? 'محفظة' : 'عند الاستلام'}</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-1">{order.items?.[0]?.name} {order.items.length > 1 && `+ ${order.items.length - 1}`}</h3>
                      <p className="text-sm text-slate-400 font-bold">{new Date(order.date).toLocaleDateString('ar-DZ')}</p>
                    </div>
                    <div className={`px-6 py-2.5 rounded-2xl border text-sm font-black flex items-center space-x-2 space-x-reverse shadow-sm ${status.color}`}>
                      {status.icon}
                      <span>{status.text}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-1">المبلغ الإجمالي</p>
                      <p className="text-2xl font-black text-slate-900">{order.totalPrice.toLocaleString()} د.ج</p>
                    </div>
                    {canRate && (
                      <button 
                        onClick={() => setRatingOrder(order.id)}
                        className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-amber-100 hover:bg-amber-600 transition-all flex items-center gap-2"
                      >
                        <Star size={16} className="fill-current" /> تقييم المنتج
                      </button>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedInvoice(order)}
                  className="mt-8 flex items-center gap-2 text-indigo-600 font-black text-sm cursor-pointer hover:underline group/link w-fit"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  عرض تفاصيل الفاتورة والعناصر ({order.items.length})
                </button>
              </div>
            </div>
          );
        })}

        {myOrders.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-[48px] border-4 border-dashed border-slate-50">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
              <ShoppingBag size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">سجل طلباتك خالٍ تماماً</h3>
            <button 
              onClick={() => setActiveBuyerTab('home')}
              className="bg-indigo-600 text-white px-12 py-5 rounded-[22px] font-black shadow-2xl"
            >
              اذهب للتسوق الآن
            </button>
          </div>
        )}
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden relative animate-in zoom-in duration-500">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><FileText size={24} /></div>
                  <h3 className="text-2xl font-black text-slate-900">تفاصيل الفاتورة</h3>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="p-3 bg-slate-50 rounded-2xl hover:text-rose-500 transition-all"><X size={24} /></button>
             </div>
             
             <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar">
                <div className="space-y-4">
                   {selectedInvoice.items.map((item, idx) => (
                     <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-slate-100 flex-shrink-0">
                           <img src={item.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                           <h4 className="font-black text-slate-900">{item.name}</h4>
                           <p className="text-xs text-slate-400 font-bold">الكمية: {item.cartQuantity}</p>
                        </div>
                        <div className="text-left font-black text-slate-900">
                           {item.price.toLocaleString()} د.ج
                        </div>
                     </div>
                   ))}
                </div>
                <div className="mt-8 p-6 bg-indigo-900 rounded-[32px] text-white">
                   <div className="flex justify-between items-center pt-4 border-t border-indigo-800">
                      <span className="font-black text-lg">المجموع النهائي</span>
                      <span className="text-2xl font-black">{selectedInvoice.totalPrice.toLocaleString()} د.ج</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
           <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl p-10 relative">
              <button onClick={() => setRatingOrder(null)} className="absolute top-8 left-8 p-3 bg-slate-50 rounded-2xl"><X size={24} /></button>
              <h3 className="text-3xl font-black text-slate-900 text-center mb-8">كيف كانت تجربتك؟</h3>
              <div className="flex justify-center gap-3 mb-10">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setRatingValue(star)} className={`p-2 transition-all ${star <= ratingValue ? 'text-amber-400' : 'text-slate-200'}`}>
                    <Star size={48} className="fill-current" />
                  </button>
                ))}
              </div>
              <button onClick={handleRate} disabled={isRating} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3">
                {isRating ? <Loader2 className="animate-spin" size={24} /> : "إرسال التقييم"}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOrders;
