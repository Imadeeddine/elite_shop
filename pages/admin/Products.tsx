
import React, { useState, useRef } from 'react';
import { useAppState } from '../../context/AppContext';
import { Product } from '../../types';
import { 
  Plus, Search, Edit2, Trash2, X, Upload, Box
} from 'lucide-react';

const AdminProducts: React.FC = () => {
  const { products, addProduct, deleteProduct } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<Product, 'id' | 'rating' | 'reviewsCount'>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    stock: 0
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: 0, category: '', image: '', stock: 0 });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert("يرجى اختيار صورة");

    const productData: Product = {
      ...formData,
      id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
      rating: editingProduct?.rating || 4.5,
      reviewsCount: editingProduct?.reviewsCount || 0
    };

    // إضافة أو تحديث فوراً في السياق (والذي يحفظ في LocalStorage أيضاً)
    addProduct(productData);
    
    // إغلاق النافذة فوراً
    setIsModalOpen(false);
  };

  const inputClass = "w-full p-4 bg-slate-50 dark:bg-dark-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none text-right font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-400";
  const labelClass = "block text-xs font-black text-slate-500 dark:text-slate-400 mb-2 mr-1 uppercase tracking-widest";

  return (
    <div className="space-y-8 text-right animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">إدارة السلع</h1>
          <p className="text-slate-500 font-medium">أضف منتجاتك ونظم مخزونك بسهولة</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 transition-all active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span className="font-black">إضافة منتج جديد</span>
        </button>
      </div>

      <div className="bg-white dark:bg-dark-900 p-3 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-800 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="ابحث بالاسم أو الفئة..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-6 py-3 bg-transparent border-none outline-none font-bold text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {products.filter(p => p.name.includes(searchTerm) || p.category.includes(searchTerm)).map(product => (
          <div key={product.id} className="bg-white dark:bg-dark-900 rounded-[35px] border border-slate-50 dark:border-dark-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col">
            <div className="relative h-60 overflow-hidden">
              <img src={product.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-indigo-600 shadow-sm">
                {product.category}
              </div>
            </div>
            <div className="p-7 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-black text-xl text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                <p className="text-xl font-black text-slate-900 dark:text-white">{product.price.toLocaleString()} د.ج</p>
              </div>
              
              <div className="flex items-center gap-2 mb-6 text-slate-400 text-xs font-bold">
                <Box size={14} />
                <span>المخزون: <span className={product.stock < 5 ? "text-rose-500" : "text-emerald-500"}>{product.stock} قطعة</span></span>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleOpenModal(product)} 
                  className="py-3.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl text-xs font-black hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 size={14} /> تعديل
                </button>
                <button 
                  onClick={() => deleteProduct(product.id)}
                  className="py-3.5 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl text-xs font-black hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} /> حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dark-900 w-full max-w-2xl rounded-[45px] shadow-2xl p-10 overflow-y-auto max-h-[90vh] border border-slate-100 dark:border-dark-800">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">بيانات المنتج</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 dark:bg-dark-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 rounded-2xl transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div 
                 className="border-4 border-dashed border-slate-100 dark:border-dark-800 rounded-[35px] aspect-video flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-slate-50 dark:bg-dark-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all group" 
                 onClick={() => fileInputRef.current?.click()}
               >
                 {formData.image ? (
                   <img src={formData.image} className="w-full h-full object-cover" />
                 ) : (
                   <div className="text-center text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 transition-colors">
                     <Upload size={48} className="mx-auto mb-3" />
                     <p className="font-black text-sm">ارفع صورة المنتج</p>
                   </div>
                 )}
               </div>
               <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className={labelClass}>اسم المنتج</label>
                    <input type="text" className={inputClass} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                 </div>
                 <div>
                    <label className={labelClass}>الفئة</label>
                    <input type="text" className={inputClass} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className={labelClass}>السعر (د.ج)</label>
                    <input type="number" className={inputClass} value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                 </div>
                 <div>
                    <label className={labelClass}>الكمية</label>
                    <input type="number" className={inputClass} value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} required />
                 </div>
               </div>

               <div>
                 <label className={labelClass}>وصف السلعة</label>
                 <textarea className={`${inputClass} h-32 resize-none`} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
               </div>
               
               <div className="flex gap-4 pt-6">
                 <button 
                   type="submit" 
                   className="flex-1 bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-indigo-200 transition-all active:scale-95"
                 >
                   حفظ فوراً
                 </button>
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-5 bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 rounded-3xl font-black">إلغاء</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
