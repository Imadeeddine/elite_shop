
import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { User } from '../types';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { setUser, setUsers, users } = useAppState();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const foundUser = users.find(u => u.email === formData.email && u.password === formData.password);
      if (foundUser) {
        setUser(foundUser);
      } else {
        setError('خطأ في البريد الإلكتروني أو كلمة المرور');
      }
    } else {
      if (!formData.email || !formData.password || !formData.firstName || !formData.phone) {
        setError('يرجى ملء جميع الحقول بما في ذلك رقم الهاتف');
        return;
      }
      
      if (formData.email === 'redjaimiaimadeddine24@gmail.com') {
        setError('هذا البريد مخصص للإدارة فقط.');
        return;
      }

      if (users.find(u => u.email === formData.email)) {
        setError('المستخدم موجود مسبقاً');
        return;
      }
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        isAdmin: false,
        balance: 0
      };
      
      setUsers([...users, newUser]);
      setUser(newUser);
    }
  };

  const inputClass = "w-full px-5 py-4 border-2 border-slate-100 rounded-[22px] focus:border-indigo-500 outline-none transition-all bg-slate-50 text-slate-900 font-bold placeholder:text-slate-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-6 text-right font-['Cairo']" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-[48px] shadow-2xl p-10 border border-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="text-center mb-10 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[28px] text-white font-black italic text-4xl mb-6 shadow-2xl shadow-indigo-200 animate-pulse">E</div>
          <h1 className="text-3xl font-black text-slate-900">إليت شوب</h1>
          <p className="text-slate-500 mt-2 font-bold">{isLogin ? 'سجل دخولك لبدء التسوق' : 'أنشئ حسابك الجديد مجاناً'}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-black text-center border border-rose-100 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="الاسم" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className={inputClass} required />
                <input type="text" placeholder="اللقب" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className={inputClass} required />
              </div>
              <input type="tel" placeholder="رقم الهاتف" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass} required />
            </>
          )}

          <input type="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} required />
          
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="كلمة المرور" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              className={inputClass} 
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-[22px] shadow-xl transition-all active:scale-95 text-lg flex items-center justify-center gap-2">
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            {isLogin ? 'دخول للمتجر' : 'إنشاء الحساب'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-indigo-600 hover:text-indigo-800 text-sm font-black transition underline decoration-2 underline-offset-4">
            {isLogin ? "لا تملك حساباً؟ اشترك الآن" : "لديك حساب؟ سجل دخولك"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
