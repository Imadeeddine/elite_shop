
import React, { useState, useMemo } from 'react';
import { useAppState } from '../../context/AppContext';
import { Product } from '../../types';
import { ShoppingCart, Star, Heart, Search, Filter, SlidersHorizontal, Package, ArrowLeft, ChevronLeft, X } from 'lucide-react';

const BuyerHome: React.FC = () => {
  const { products, addToCart, toggleFavorite, favorites } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // تحديث قائمة التصنيفات لتشمل "المفضلة" كخيار أساسي في الفلترة
  const categories = useMemo(() => {
    const baseCategories = ['الكل', 'المفضلة'];
    const productCategories = Array.from(new Set(products.map(p => p.category)));
    return [...baseCategories, ...productCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesCategory = true;
      if (selectedCategory === 'المفضلة') {
        matchesCategory = favorites.includes(p.id);
      } else if (selectedCategory !== 'الكل') {
        matchesCategory = p.category === selectedCategory;
      }
      
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    
    return result;
  }, [products, searchTerm, selectedCategory, sortBy, favorites]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Search & Filter Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
          <input 
            type="text" 
            placeholder="ابحث عن الماركات، الإلكترونيات، أو أي شيء تريده..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-[28px] py-5 pr-14 pl-6 text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 shadow-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select 
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-sm outline-none focus:border-indigo-500"
          >
            <option value="newest">الأحدث أولاً</option>
            <option value="price-low">السعر: من الأقل</option>
            <option value="price-high">السعر: من الأعلى</option>
          </select>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex space-x-3 space-x-reverse overflow-x-auto pb-4 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-8 py-3.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all border-2 flex items-center gap-2 ${
              selectedCategory === cat 
              ? (cat === 'المفضلة' ? 'bg-rose-500 text-white border-rose-500 shadow-xl shadow-rose-200' : 'bg-slate-900 text-white border-slate-900 shadow-xl')
              : (cat === 'المفضلة' ? 'bg-white text-rose-500 border-rose-100 hover:border-rose-300' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300')
            }`}
          >
            {cat === 'المفضلة' && <Heart size={16} fill={selectedCategory === 'المفضلة' ? "currentColor" : "none"} />}
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="group relative bg-white rounded-[40px] p-4 border border-slate-50 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
          >
            {/* Wishlist Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
              className={`absolute top-8 left-8 z-10 p-3 rounded-2xl backdrop-blur-md transition-all ${favorites.includes(product.id) ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-white/80 text-slate-400 hover:text-rose-500 shadow-sm'}`}
            >
              <Heart size={20} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
            </button>

            {/* Product Image */}
            <div className="relative aspect-square rounded-[32px] overflow-hidden bg-slate-50 mb-6 cursor-pointer" onClick={() => setSelectedProduct(product)}>
              <img 
                src={product.image} 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110" 
                alt={product.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end p-6">
                <div className="w-full bg-white/90 backdrop-blur-md text-slate-900 font-black py-4 rounded-2xl text-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition">
                  عرض التفاصيل
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col px-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{product.category}</span>
                <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg">
                  <Star size={12} className="fill-current ml-1" />
                  <span className="text-xs font-black">{product.rating}</span>
                </div>
              </div>
              <h4 className="font-black text-slate-900 text-lg mb-1 leading-tight">{product.name}</h4>
              <p className="text-slate-400 text-xs font-medium mb-6 line-clamp-1">{product.description}</p>
              
              <div className="mt-auto flex items-center justify-between gap-4">
                <p className="text-xl font-black text-slate-900">{product.price.toLocaleString()} د.ج</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-90"
                >
                  <ShoppingCart size={22} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full py-40 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
              <Package size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              {selectedCategory === 'المفضلة' ? 'قائمة المفضلات فارغة' : 'لم نعثر على ما تبحث عنه'}
            </h3>
            <p className="text-slate-400 mt-2 text-lg">
              {selectedCategory === 'المفضلة' ? 'أضف بعض السلع إلى مفضلاتك لتظهر هنا.' : 'جرب كلمات بحث مختلفة أو تصفح أقساماً أخرى.'}
            </p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-5xl rounded-[48px] shadow-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh] scale-100 animate-in zoom-in duration-500">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-8 left-8 z-10 p-3 bg-white/90 hover:bg-white rounded-2xl shadow-lg transition-all text-slate-900"
              >
                <X size={24} />
              </button>
              <div className="w-full md:w-1/2 overflow-hidden bg-slate-50">
                <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="w-full md:w-1/2 p-12 flex flex-col text-right" dir="rtl">
                <div className="flex-1 space-y-6">
                   <span className="text-indigo-600 font-black uppercase tracking-widest text-xs">{selectedProduct.category}</span>
                   <h2 className="text-4xl font-black text-slate-900 leading-tight">{selectedProduct.name}</h2>
                   <div className="flex items-center space-x-2 space-x-reverse text-amber-500">
                      <Star size={20} className="fill-current" />
                      <span className="font-black">{selectedProduct.rating}</span>
                      <span className="text-slate-400 font-bold">({selectedProduct.reviewsCount} مراجعة)</span>
                   </div>
                   <p className="text-slate-500 text-lg leading-relaxed">{selectedProduct.description}</p>
                   <div className="bg-slate-50 p-6 rounded-[32px] flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-slate-400 mb-1">السعر</p>
                        <p className="text-3xl font-black text-slate-900">{selectedProduct.price.toLocaleString()} د.ج</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-slate-400 mb-1">المخزون</p>
                        <p className="text-sm font-black text-emerald-600">{selectedProduct.stock} متوفرة</p>
                      </div>
                   </div>
                </div>
                <div className="pt-8">
                  <button 
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-[28px] shadow-2xl shadow-indigo-200 transition-all text-xl flex items-center justify-center"
                  >
                    أضف إلى السلة
                    <ShoppingCart size={24} className="mr-3" />
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BuyerHome;
