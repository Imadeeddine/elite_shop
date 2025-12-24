
import React, { useState, useRef } from 'react';
import { useAppState } from '../../context/AppContext';
import { 
  User as UserIcon, Wallet, Settings, LogOut, Shield, ChevronLeft, Bell, 
  ArrowRight, Save, Lock, Plus, CheckCircle, X, Camera, Image as ImageIcon,
  Eye, EyeOff, AlertCircle, Info, Moon, Sun, Globe
} from 'lucide-react';

const BuyerProfile: React.FC = () => {
  const { user, setUser, users, setUsers, logout, orders, language, setLanguage, theme, setTheme } = useAppState();
  const [activeSubTab, setActiveSubTab] = useState<'main' | 'settings' | 'notifications' | 'security' | 'recharge'>('main');
  const [rechargeAmount, setRechargeAmount] = useState('');
  
  // Password Logic
  const [passwordData, setPasswordData] = useState({ current: '', new: '' });
  const [passStatus, setPassStatus] = useState<{type: 'success' | 'error' | null, msg: string}>({ type: null, msg: '' });
  
  // Camera Refs
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const isRTL = language === 'ar';
  const t = (ar: string, en: string, fr: string) => {
    if (language === 'ar') return ar;
    if (language === 'en') return en;
    return fr;
  };

  const inputClass = "w-full p-4 bg-white dark:bg-dark-800 border-2 border-slate-100 dark:border-dark-700 rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400";
  const labelClass = "block text-sm font-black text-slate-600 dark:text-slate-400 mb-2 mr-1";

  const userNotifications = orders
    .filter(o => o.buyerId === user?.id)
    .map(order => ({
      id: `notif-${order.id}`,
      title: order.status === 'Accepted' ? t('تم قبول طلبك', 'Order Accepted', 'Commande Acceptée') : order.status === 'Shipped' ? t('طلبك في الطريق', 'Order Shipped', 'Commande Expédiée') : t('تحديث الطلب', 'Order Update', 'Mise à jour'),
      message: t(`الطلب #${order.id.substr(-6)} الآن بحالة: ${order.status}`, `Order #${order.id.substr(-6)} is now: ${order.status}`, `Commande #${order.id.substr(-6)} est: ${order.status}`),
      type: 'info'
    }));

  const handleUpdatePassword = () => {
    setPassStatus({ type: null, msg: '' });
    if (!user || !passwordData.current || !passwordData.new) return;
    if (user.password !== passwordData.current) {
      setPassStatus({ type: 'error', msg: t('كلمة المرور الحالية غير صحيحة', 'Current password incorrect', 'Mot de passe incorrect') });
      return;
    }
    const updatedUser = { ...user, password: passwordData.new };
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    setUser(updatedUser);
    setPassStatus({ type: 'success', msg: t('تم التحديث بنجاح', 'Updated successfully', 'Mis à jour') });
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setIsCameraOpen(true);
    } catch (err) { alert(t('فشل الوصول للكاميرا', 'Camera access failed', 'Échec de la caméra')); }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && user) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/png');
        const updatedUser = { ...user, avatar: imageData };
        setUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
        stopCamera();
      }
    }
  };

  const renderSubContent = () => {
    switch (activeSubTab) {
      case 'notifications':
        return (
          <div className="space-y-8 animate-in slide-in-from-left-4">
            <button onClick={() => setActiveSubTab('main')} className="flex items-center text-indigo-600 font-black gap-2">
              <ArrowRight size={20} className={isRTL ? "" : "rotate-180"} /> {t("العودة", "Back", "Retour")}
            </button>
            <div className="bg-white dark:bg-dark-900 rounded-[32px] overflow-hidden border border-slate-100 dark:border-dark-800 shadow-sm">
              <div className="p-8 border-b border-slate-50 dark:border-dark-800">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{t("الإشعارات", "Notifications", "Notifications")}</h3>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-dark-800">
                {userNotifications.length > 0 ? (
                  userNotifications.map((n) => (
                    <div key={n.id} className="p-6 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-all">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl"><Bell size={20} /></div>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white mb-1">{n.title}</h4>
                        <p className="text-sm text-slate-500 font-medium">{n.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center flex flex-col items-center">
                    <Info size={48} className="text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold">{t("لا توجد إشعارات", "No notifications", "Pas de notifications")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-8 animate-in slide-in-from-left-4">
            <button onClick={() => setActiveSubTab('main')} className="flex items-center text-indigo-600 font-black gap-2">
              <ArrowRight size={20} className={isRTL ? "" : "rotate-180"} /> {t("العودة", "Back", "Retour")}
            </button>
            
            <div className="bg-white dark:bg-dark-900 rounded-[32px] p-8 border border-slate-100 dark:border-dark-800 shadow-sm space-y-10">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center">
                 <div className="relative">
                    <div className="w-32 h-32 rounded-[40px] bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center text-4xl font-black shadow-2xl overflow-hidden border-4 border-white dark:border-dark-800">
                      {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.firstName[0]}
                    </div>
                    <div className="absolute -bottom-2 flex gap-2">
                       <button onClick={startCamera} className="p-3 bg-white dark:bg-dark-800 rounded-2xl shadow-xl text-indigo-600"><Camera size={20} /></button>
                       <button onClick={() => galleryInputRef.current?.click()} className="p-3 bg-white dark:bg-dark-800 rounded-2xl shadow-xl text-indigo-600"><ImageIcon size={20} /></button>
                    </div>
                    <input type="file" hidden ref={galleryInputRef} accept="image/*" onChange={(e) => {
                       const file = e.target.files?.[0];
                       if (file) {
                         const reader = new FileReader();
                         reader.onloadend = () => {
                           const updatedUser = { ...user!, avatar: reader.result as string };
                           setUser(updatedUser);
                           setUsers(prev => prev.map(u => u.id === user!.id ? updatedUser : u));
                         };
                         reader.readAsDataURL(file);
                       }
                    }} />
                 </div>
              </div>

              {/* Theme & Language Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-slate-50 dark:border-dark-800">
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2"><Moon size={18} className="text-indigo-600" /> {t("مظهر الواجهة", "Theme", "Apparence")}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setTheme('light')} className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all ${theme === 'light' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 dark:bg-dark-800 text-slate-400 border-transparent'}`}>
                      <Sun size={20} /> <span className="font-black text-xs">{t("نهاري", "Light", "Clair")}</span>
                    </button>
                    <button onClick={() => setTheme('dark')} className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 dark:bg-dark-800 text-slate-400 border-transparent'}`}>
                      <Moon size={20} /> <span className="font-black text-xs">{t("ليلي", "Dark", "Sombre")}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2"><Globe size={18} className="text-indigo-600" /> {t("لغة التطبيق", "Language", "Langue")}</h4>
                  <div className="flex gap-2">
                    {['ar', 'en', 'fr'].map((lang) => (
                      <button key={lang} onClick={() => setLanguage(lang as any)} className={`flex-1 py-4 rounded-2xl border-2 font-black text-xs transition-all ${language === lang ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-dark-800 text-slate-400 border-transparent'}`}>
                        {lang === 'ar' ? 'العربية' : lang === 'en' ? 'EN' : 'FR'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inputs Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className={labelClass}>{t("الاسم الأول", "First Name", "Prénom")}</label><input type="text" defaultValue={user?.firstName} className={inputClass} /></div>
                <div><label className={labelClass}>{t("اللقب", "Last Name", "Nom")}</label><input type="text" defaultValue={user?.lastName} className={inputClass} /></div>
              </div>
              
              <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                <Save size={20} /> {t("حفظ البيانات", "Save", "Enregistrer")}
              </button>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-8 animate-in slide-in-from-left-4">
            <button onClick={() => setActiveSubTab('main')} className="flex items-center text-indigo-600 font-black gap-2">
               <ArrowRight size={20} className={isRTL ? "" : "rotate-180"} /> {t("العودة", "Back", "Retour")}
            </button>
            <div className="bg-white dark:bg-dark-900 rounded-[32px] p-8 border border-slate-100 dark:border-dark-800 shadow-sm space-y-8">
               <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">{t("كلمة المرور والأمان", "Security", "Sécurité")}</h3>
               <div className="space-y-6">
                  <div>
                    <label className={labelClass}>{t("كلمة المرور الحالية", "Current Password", "Mot de passe actuel")}</label>
                    <input type="password" value={passwordData.current} onChange={e => setPasswordData({...passwordData, current: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t("كلمة المرور الجديدة", "New Password", "Nouveau mot de passe")}</label>
                    <input type="password" value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})} className={inputClass} />
                  </div>
                  <button onClick={handleUpdatePassword} className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-lg">
                    {t("تحديث كلمة المرور", "Update", "Mettre à jour")}
                  </button>
                  {passStatus.msg && (
                    <p className={`text-center font-bold text-sm ${passStatus.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>{passStatus.msg}</p>
                  )}
               </div>
            </div>
          </div>
        );
      case 'recharge':
        return (
          <div className="space-y-8 animate-in slide-in-from-left-4">
            <button onClick={() => setActiveSubTab('main')} className="flex items-center text-indigo-600 font-black gap-2">
               <ArrowRight size={20} className={isRTL ? "" : "rotate-180"} /> {t("العودة", "Back", "Retour")}
            </button>
            <div className="bg-white dark:bg-dark-900 rounded-[40px] p-12 border border-slate-100 dark:border-dark-800 shadow-xl max-w-lg mx-auto text-center">
                <Wallet size={48} className="text-indigo-600 mx-auto mb-8" />
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8">{t("شحن المحفظة", "Recharge", "Recharger")}</h3>
                <input type="number" value={rechargeAmount} onChange={e => setRechargeAmount(e.target.value)} placeholder="0.00" className={inputClass + " text-center text-4xl py-8 mb-6"} />
                <button onClick={() => {
                   if (!rechargeAmount || !user) return;
                   const updatedUser = { ...user, balance: user.balance + Number(rechargeAmount) };
                   setUser(updatedUser);
                   setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
                   setActiveSubTab('main');
                }} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl">
                  {t("تأكيد الشحن", "Confirm", "Confirmer")}
                </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8 animate-in fade-in">
            <div className="bg-white dark:bg-dark-900 rounded-[40px] p-10 border border-slate-100 dark:border-dark-800 shadow-xl flex flex-col md:flex-row items-center gap-10">
              <div className="w-28 h-28 rounded-[32px] bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center text-4xl font-black shadow-2xl overflow-hidden">
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.firstName[0]}
              </div>
              <div className="flex-1 text-center md:text-right">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">{user?.firstName} {user?.lastName}</h2>
                <p className="text-slate-400 font-bold text-lg mt-3">{user?.email}</p>
              </div>
              <button onClick={() => setActiveSubTab('settings')} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 transition-all">
                {t("تعديل الحساب", "Settings", "Paramètres")}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900 dark:bg-dark-800 rounded-[40px] p-10 text-white relative overflow-hidden group">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                  <Wallet size={28} className="mb-10 text-white/50 relative z-10" />
                  <p className="text-slate-400 font-black text-xs uppercase tracking-[3px] mb-2 relative z-10">{t("الرصيد المتاح", "Balance", "Solde")}</p>
                  <h3 className="text-4xl font-black mb-10 tracking-tight relative z-10">{user?.balance.toLocaleString()} {t("د.ج", "DZD", "DZD")}</h3>
                  <button onClick={() => setActiveSubTab('recharge')} className="w-full bg-indigo-600 text-white py-5 rounded-[20px] font-black text-lg shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 relative z-10"><Plus size={20} /> {t("شحن الرصيد", "Recharge", "Recharger")}</button>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'settings', label: t('الإعدادات والمظهر', 'Settings & Theme', 'Paramètres'), icon: Settings, bg: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' },
                  { id: 'notifications', label: t('الإشعارات', 'Notifications', 'Notifications'), icon: Bell, bg: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600' },
                  { id: 'security', label: t('الأمان وكلمة المرور', 'Security', 'Sécurité'), icon: Shield, bg: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600' },
                ].map((item) => (
                  <button key={item.id} onClick={() => setActiveSubTab(item.id as any)} className="w-full bg-white dark:bg-dark-900 p-6 rounded-[24px] border border-slate-100 dark:border-dark-800 flex items-center justify-between hover:border-indigo-200 dark:hover:border-indigo-500 transition-all">
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-2xl ${item.bg}`}><item.icon size={22} /></div>
                      <span className="font-black text-slate-700 dark:text-slate-200 text-lg">{item.label}</span>
                    </div>
                    <ChevronLeft size={20} className={`text-slate-300 ${!isRTL && 'rotate-180'}`} />
                  </button>
                ))}
                <button onClick={logout} className="w-full bg-rose-50 dark:bg-rose-950/30 p-6 rounded-[24px] border border-rose-100 dark:border-rose-900/30 flex items-center justify-center gap-3 text-rose-500 font-black hover:bg-rose-500 hover:text-white transition-all mt-4"><LogOut size={22} /> {t("تسجيل الخروج", "Logout", "Déconnexion")}</button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-right font-['Cairo'] pb-12" dir={isRTL ? "rtl" : "ltr"}>
      {renderSubContent()}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in">
           <div className="bg-white dark:bg-dark-900 w-full max-w-xl rounded-[48px] overflow-hidden shadow-2xl relative">
              <div className="p-8 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center"><h3 className="text-xl font-black text-slate-900 dark:text-white">{t("التقط صورة", "Take a Photo", "Prendre une photo")}</h3><button onClick={stopCamera} className="p-3 bg-slate-50 dark:bg-dark-800 rounded-2xl"><X size={24} /></button></div>
              <div className="relative aspect-square bg-black overflow-hidden"><video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover -scale-x-100" /><canvas ref={canvasRef} className="hidden" /></div>
              <div className="p-10"><button onClick={capturePhoto} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3"><Camera size={24} /> {t("التقاط", "Capture", "Capturer")}</button></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BuyerProfile;
