
import React, { useState, useRef } from 'react';
import { useAppState } from '../../context/AppContext';
import { 
  User, Shield, Globe, Moon, Sun, Save, Lock, ArrowRight,
  Store, Camera, CreditCard, X, RefreshCw, Image as ImageIcon
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { user, setUser, language, setLanguage, theme, setTheme } = useAppState();
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const isRTL = language === 'ar';
  const labelClass = "block text-xs font-black text-slate-500 dark:text-slate-400 mb-2 mr-1 uppercase tracking-widest";
  const inputClass = "w-full p-4 bg-slate-50 dark:bg-dark-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none text-right font-bold text-slate-900 dark:text-white transition-all";

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setIsCameraOpen(true);
    } catch (err) { alert("فشل الوصول إلى الكاميرا."); }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setStream(null);
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
        if (user) {
          const updatedUser = { ...user, avatar: imageData };
          setUser(updatedUser);
          localStorage.setItem('current_user', JSON.stringify(updatedUser));
        }
        stopCamera();
      }
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">الإعدادات</h1>
        <p className="text-slate-500 mt-1 font-medium">تحكم في مظهر متجرك وبياناتك الشخصية</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-dark-900 rounded-[40px] p-8 border border-slate-100 dark:border-dark-800 shadow-sm space-y-8">
            <div className="flex items-center gap-6 pb-6 border-b border-slate-50 dark:border-dark-800">
               <div className="relative">
                 <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-xl overflow-hidden border-4 border-white dark:border-dark-800">
                   {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.firstName[0]}
                 </div>
                 <div className="absolute -bottom-2 -left-2 flex gap-1">
                    <button onClick={startCamera} className="p-2 bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-slate-100 dark:border-dark-700 text-indigo-600 hover:scale-110 transition-all"><Camera size={14} /></button>
                    <button onClick={() => galleryInputRef.current?.click()} className="p-2 bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-slate-100 dark:border-dark-700 text-indigo-600 hover:scale-110 transition-all"><ImageIcon size={14} /></button>
                 </div>
                 <input type="file" ref={galleryInputRef} hidden accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const updatedUser = { ...user!, avatar: reader.result as string };
                        setUser(updatedUser);
                        localStorage.setItem('current_user', JSON.stringify(updatedUser));
                      };
                      reader.readAsDataURL(file);
                    }
                 }} />
               </div>
               <div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white">{user?.firstName} {user?.lastName}</h3>
                 <p className="text-slate-400 font-bold text-sm">{user?.email}</p>
                 <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-lg uppercase tracking-widest">حساب بائع موثق</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div><label className={labelClass}>الاسم الأول</label><input type="text" defaultValue={user?.firstName} className={inputClass} /></div>
               <div><label className={labelClass}>اللقب</label><input type="text" defaultValue={user?.lastName} className={inputClass} /></div>
               <div><label className={labelClass}>اسم المتجر</label><input type="text" defaultValue="إليت شوب" className={inputClass} /></div>
               <div><label className={labelClass}>رقم الهاتف</label><input type="text" defaultValue={user?.phone} className={inputClass} /></div>
            </div>
            <button className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3"><Save size={20} /> حفظ التعديلات</button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-dark-900 rounded-[40px] p-8 border border-slate-100 dark:border-dark-800 shadow-sm">
             <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Globe size={18} className="text-indigo-600" /> لغة لوحة التحكم</h3>
             <div className="space-y-3">
               {['ar', 'en', 'fr'].map((lang) => (
                 <button key={lang} onClick={() => setLanguage(lang as any)} className={`w-full py-4 rounded-2xl font-black text-sm border-2 transition-all ${language === lang ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-dark-800 border-transparent text-slate-400 hover:border-indigo-100'}`}>
                   {lang === 'ar' ? 'العربية' : lang === 'en' ? 'English' : 'Français'}
                 </button>
               ))}
             </div>
          </div>
          <div className="bg-white dark:bg-dark-900 rounded-[40px] p-8 border border-slate-100 dark:border-dark-800 shadow-sm">
             <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Moon size={18} className="text-indigo-600" /> مظهر الواجهة</h3>
             <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setTheme('light')} className={`flex flex-col items-center gap-3 p-6 rounded-[28px] border-2 transition-all ${theme === 'light' ? 'bg-white border-indigo-600 text-indigo-600 shadow-xl' : 'bg-slate-50 dark:bg-dark-800 border-transparent text-slate-400'}`}><Sun size={24} /><span className="text-xs font-black">نهاري</span></button>
                <button onClick={() => setTheme('dark')} className={`flex flex-col items-center gap-3 p-6 rounded-[28px] border-2 transition-all ${theme === 'dark' ? 'bg-slate-900 border-indigo-600 text-white shadow-xl' : 'bg-slate-50 dark:bg-dark-800 border-transparent text-slate-400'}`}><Moon size={24} /><span className="text-xs font-black">ليلي</span></button>
             </div>
          </div>
        </div>
      </div>

      {isCameraOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white dark:bg-dark-900 w-full max-w-xl rounded-[48px] overflow-hidden shadow-2xl relative text-right" dir="rtl">
              <div className="p-8 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center"><h3 className="text-xl font-black text-slate-900 dark:text-white">التقط صورة الشخصية</h3><button onClick={stopCamera} className="p-3 bg-slate-50 dark:bg-dark-800 rounded-2xl hover:text-rose-500 transition-all"><X size={24} /></button></div>
              <div className="relative aspect-square bg-black flex items-center justify-center overflow-hidden"><video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover -scale-x-100" /><canvas ref={canvasRef} className="hidden" /></div>
              <div className="p-10 flex gap-4"><button onClick={capturePhoto} className="flex-1 bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"><Camera size={24} /> التقاط الصورة</button></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
