
import React, { useState } from 'react';
import { useAppState } from '../../context/AppContext';
import { PaymentMethod } from '../../types';
import { Trash2, Plus, Minus, ShoppingBag, Wallet, Truck, Loader2, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';

const BuyerCart: React.FC = () => {
  const { cart, setCart, removeFromCart, setActiveBuyerTab, placeOrder, user } = useAppState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Wallet');
  const [orderResult, setOrderResult] = useState<{status: 'success' | 'error' | null, message: string}>({status: null, message: ''});

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.cartQuantity + delta);
        return { ...item, cartQuantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.cartQuantity), 0);
  const total = subtotal;

  const handleCheckout = async () => {
    // التنفيذ الفوري
    setIsProcessing(true);
    const result = await placeOrder(paymentMethod);
    setIsProcessing(false);
    
    if (result.success) {
      // الانتقال فوراً لصفحة الطلبات ليرى المستخدم طلبه الجديد
      setActiveBuyerTab('orders');
    } else {
      setOrderResult({ status: 'error', message: result.message });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center text-center animate-in fade-in" dir="rtl">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3">سلة المشتريات فارغة</h2>
        <p className="text-slate-400 font-bold mb-10 max-w-xs text-lg">استكشف المنتجات وأضف ما يعجبك هنا.</p>
        <button onClick={() => setActiveBuyerTab('home')} className="bg-indigo-600 text-white px-12 py-5 rounded-[24px] font-black shadow-xl hover:scale-105 active:scale-95 transition-all">اكتشف المتجر</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 text-right animate-in slide-in-from-bottom-6" dir="rtl">
      <div className="xl:col-span-2 space-y-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-black text-slate-900">سلة المشتريات</h2>
          <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full font-black text-sm">{cart.length} منتجات</span>
        </div>

        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-[32px] p-6 border border-slate-50 shadow-sm flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-all">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" />
              </div>
              <div className="flex-1 text-center sm:text-right">
                <h3 className="text-xl font-black text-slate-900 mb-1">{item.name}</h3>
                <p className="text-indigo-600 font-black text-lg">{item.price.toLocaleString()} د.ج</p>
              </div>
              <div className="flex items-center bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:text-rose-500 transition"><Minus size={18} /></button>
                <span className="w-12 text-center font-black text-lg text-slate-900">{item.cartQuantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:text-emerald-500 transition"><Plus size={18} /></button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="p-3 bg-rose-50 text-rose-300 hover:text-rose-500 hover:bg-rose-100 rounded-2xl transition">
                <Trash2 size={22} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8 h-fit">
        <div className="bg-white rounded-[40px] p-8 border border-slate-50 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 mb-8">إتمام الطلب</h3>
          
          <div className="space-y-4 mb-10">
            <p className="font-black text-slate-400 text-xs uppercase tracking-widest mr-1">طريقة الدفع</p>
            <div className="grid grid-cols-1 gap-3">
               <button 
                onClick={() => setPaymentMethod('Wallet')}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${paymentMethod === 'Wallet' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200'}`}
               >
                 <div className={`p-3 rounded-xl ${paymentMethod === 'Wallet' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}><Wallet size={20} /></div>
                 <div className="text-right">
                    <p className={`font-black text-sm ${paymentMethod === 'Wallet' ? 'text-indigo-900' : 'text-slate-600'}`}>محفظة إليت شوب</p>
                    <p className="text-[10px] font-bold text-slate-400">رصيدك: {user?.balance.toLocaleString()} د.ج</p>
                 </div>
               </button>
               <button 
                onClick={() => setPaymentMethod('COD')}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${paymentMethod === 'COD' ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-300'}`}
               >
                 <div className={`p-3 rounded-xl ${paymentMethod === 'COD' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}><Truck size={20} /></div>
                 <div className="text-right">
                    <p className={`font-black text-sm ${paymentMethod === 'COD' ? 'text-slate-900' : 'text-slate-600'}`}>الدفع عند الاستلام</p>
                    <p className="text-[10px] font-bold text-slate-400">ادفع نقداً عند استلام المنتج</p>
                 </div>
               </button>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl space-y-4 mb-8">
            <div className="flex justify-between font-bold text-slate-500">
              <span>قيمة المنتجات</span>
              <span>{subtotal.toLocaleString()} د.ج</span>
            </div>
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="font-black text-slate-900">الإجمالي النهائي</span>
              <span className="text-2xl font-black text-indigo-600">{total.toLocaleString()} د.ج</span>
            </div>
          </div>

          {orderResult.status === 'error' && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 flex items-center gap-3 animate-bounce">
              <AlertCircle size={20} />
              <span className="text-sm font-black">{orderResult.message}</span>
            </div>
          )}

          <button 
            onClick={handleCheckout}
            disabled={isProcessing}
            className={`w-full py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-xl transition-all ${isProcessing ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black active:scale-95 shadow-slate-200'}`}
          >
            {isProcessing ? <Loader2 className="animate-spin" size={24} /> : <>إرسال الطلب فوراً</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerCart;
