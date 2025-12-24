
import React from 'react';
import { useAppState } from '../../context/AppContext';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';

const BuyerFavorites: React.FC = () => {
  const { products, favorites, toggleFavorite, addToCart } = useAppState();
  
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="py-40 flex flex-col items-center text-center animate-in fade-in">
        <div className="w-32 h-32 bg-rose-50 rounded-full flex items-center justify-center text-rose-400 mb-8">
          <Heart size={64} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">المفضلة فارغة</h2>
        <p className="text-slate-400 text-lg mb-10">المنتجات التي تحبها ستظهر هنا. ابدأ بالاستكشاف!</p>
        <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl transition">تصفح المتجر</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 text-right animate-in slide-in-from-bottom-6" dir="rtl">
      <h2 className="text-4xl font-black text-slate-900">المنتجات المفضلة ({favoriteProducts.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {favoriteProducts.map(product => (
          <div key={product.id} className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm flex gap-6 group hover:shadow-xl transition-all duration-500">
            <div className="w-40 h-40 rounded-3xl overflow-hidden bg-slate-50 flex-shrink-0 relative">
              <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="" />
              <button 
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-3 left-3 p-2 bg-white/90 rounded-xl text-rose-500 shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex-1 flex flex-col py-2">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{product.category}</span>
              <h3 className="text-xl font-black text-slate-900 mb-2">{product.name}</h3>
              <p className="text-2xl font-black text-slate-900 mb-auto">${product.price.toLocaleString()}</p>
              <button 
                onClick={() => addToCart(product)}
                className="w-full bg-slate-900 text-white py-3 rounded-2xl font-black text-sm flex items-center justify-center hover:bg-indigo-600 transition shadow-lg"
              >
                نقل للسلة
                <ShoppingCart size={16} className="mr-2" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerFavorites;
