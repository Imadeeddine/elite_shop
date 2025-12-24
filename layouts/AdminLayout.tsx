
import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import AdminOrders from '../pages/admin/Orders';
import AdminSettings from '../pages/admin/Settings';
import AdminNotifications from '../pages/admin/Notifications';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  LogOut, 
  Menu, 
  X,
  Settings,
  Bell
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings' | 'notifications'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, user, notifications } = useAppState();

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'products', label: 'المتجر', icon: Package },
    { id: 'orders', label: 'المبيعات', icon: ShoppingBag },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'products': return <AdminProducts />;
      case 'orders': return <AdminOrders />;
      case 'settings': return <AdminSettings />;
      case 'notifications': return <AdminNotifications />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-dark-950 font-['Cairo'] transition-colors duration-300" dir="rtl">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-slate-950 text-white transform transition-transform duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          {/* Logo Section */}
          <div className="flex items-center justify-between mb-10 px-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center font-black italic text-xl shadow-lg shadow-indigo-500/20">E</div>
              <span className="text-xl font-black tracking-tight">إليت <span className="text-indigo-500">أدمن</span></span>
            </div>
            <button className="lg:hidden p-2 hover:bg-slate-800 rounded-xl" onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(false); }}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-4 space-x-reverse px-5 py-4 rounded-2xl transition-all duration-300 group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 translate-x-1' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
              >
                <item.icon size={20} className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="font-bold">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="pt-6 border-t border-slate-900 mt-6">
            <div 
              className={`flex items-center space-x-3 space-x-reverse mb-6 px-2 p-2 rounded-xl cursor-pointer transition-all ${activeTab === 'settings' ? 'bg-slate-900' : 'hover:bg-slate-900/50'}`}
              onClick={() => setActiveTab('settings')}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-black shadow-lg">
                {user?.firstName[0]}
              </div>
              <div className="flex-1 overflow-hidden text-right">
                <p className="font-black text-white text-sm truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">المسؤول</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center space-x-4 space-x-reverse px-5 py-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all font-black text-sm"
            >
              <LogOut size={18} />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-slate-100 dark:border-dark-800 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-50 dark:hover:bg-dark-800 rounded-xl transition">
              <Menu size={24} className="text-slate-900 dark:text-white" />
            </button>
            <h2 className="hidden md:block font-black text-slate-800 dark:text-white text-lg">
              {activeTab === 'dashboard' ? 'لوحة التحكم' : 
               activeTab === 'products' ? 'إدارة السلع' : 
               activeTab === 'orders' ? 'إدارة المبيعات' : 
               activeTab === 'settings' ? 'الإعدادات' : 'التنبيهات'}
            </h2>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`p-2.5 rounded-xl relative transition-all ${activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-dark-800'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-dark-900"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`p-2.5 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-dark-800'}`}
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
