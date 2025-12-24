
import React from 'react';
import { useAppState } from '../context/AppContext';
import BuyerHome from '../pages/buyer/Home';
import BuyerOrders from '../pages/buyer/Orders';
import BuyerCart from '../pages/buyer/Cart';
import BuyerFavorites from '../pages/buyer/Favorites';
import BuyerProfile from '../pages/buyer/Profile';
import { 
  Home, 
  ShoppingBag, 
  User as UserIcon, 
  ShoppingCart,
  Heart,
  Bell
} from 'lucide-react';

const BuyerLayout: React.FC = () => {
  const { user, cart, activeBuyerTab, setActiveBuyerTab, language } = useAppState();
  const isRTL = language === 'ar';

  const renderContent = () => {
    switch (activeBuyerTab) {
      case 'home': return <BuyerHome />;
      case 'orders': return <BuyerOrders />;
      case 'cart': return <BuyerCart />;
      case 'favorites': return <BuyerFavorites />;
      case 'profile': return <BuyerProfile />;
      default: return <BuyerHome />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#fcfdfe] dark:bg-dark-950 flex flex-col font-['Cairo'] transition-colors duration-300`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-[60] bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className={`flex items-center ${isRTL ? 'space-x-4 space-x-reverse' : 'space-x-4'} cursor-pointer`} onClick={() => setActiveBuyerTab('home')}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic text-xl shadow-lg">E</div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white hidden sm:block">إليت شوب</h1>
            </div>

            {/* Actions */}
            <div className={`flex items-center ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
              <button 
                onClick={() => setActiveBuyerTab('cart')}
                className={`p-2.5 rounded-xl relative transition-all ${activeBuyerTab === 'cart' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800'}`}
              >
                <ShoppingCart size={22} />
                {cart.length > 0 && (
                  <span className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-dark-900`}>
                    {cart.length}
                  </span>
                )}
              </button>
              
              <div className="h-8 w-px bg-slate-200 dark:bg-dark-800 mx-2"></div>
              
              <div 
                onClick={() => setActiveBuyerTab('profile')}
                className={`flex items-center ${isRTL ? 'space-x-3 space-x-reverse' : 'space-x-3'} cursor-pointer p-1.5 rounded-xl transition-all ${activeBuyerTab === 'profile' ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/30' : 'hover:bg-slate-50 dark:hover:bg-dark-800'}`}
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                  {user?.firstName[0]}
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-black text-slate-900 dark:text-white leading-none">{user?.firstName}</p>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-1 tracking-wider">{user?.balance.toLocaleString() || '0'} د.ج</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-dark-900 border-t border-slate-100 dark:border-dark-800 flex items-center justify-around h-20 md:hidden px-4 shadow-2xl">
        {[
          { id: 'home', label: isRTL ? 'الرئيسية' : 'Home', icon: Home },
          { id: 'cart', label: isRTL ? 'السلة' : 'Cart', icon: ShoppingCart },
          { id: 'orders', label: isRTL ? 'طلباتي' : 'Orders', icon: ShoppingBag },
          { id: 'profile', label: isRTL ? 'حسابي' : 'Profile', icon: UserIcon },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveBuyerTab(item.id as any)}
            className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-all ${activeBuyerTab === item.id ? 'text-indigo-600 scale-105' : 'text-slate-400 dark:text-slate-500'}`}
          >
            <item.icon size={22} className={activeBuyerTab === item.id ? 'fill-indigo-50 dark:fill-indigo-950/50' : ''} />
            <span className="text-[10px] font-black">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default BuyerLayout;
