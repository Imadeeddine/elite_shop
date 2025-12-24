
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Order, OrderStatus, CartItem, Notification, PaymentMethod } from '../types';
import { cloudService } from '../services/storeService';

type Language = 'ar' | 'en' | 'fr';
type Theme = 'light' | 'dark';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  notifications: Notification[];
  activeBuyerTab: 'home' | 'orders' | 'cart' | 'favorites' | 'profile';
  setActiveBuyerTab: (tab: 'home' | 'orders' | 'cart' | 'favorites' | 'profile') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  logout: () => void;
  refreshData: () => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  placeOrder: (method: PaymentMethod) => Promise<{ success: boolean, message: string }>;
  rateOrder: (orderId: string, rating: number) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(() => {
    const saved = localStorage.getItem('current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeBuyerTab, setActiveBuyerTab] = useState<'home' | 'orders' | 'cart' | 'favorites' | 'profile'>('home');

  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('app_lang') as Language) || 'ar');
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('app_theme') as Theme) || 'light');

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('shop_users');
    const ADMIN_EMAIL = 'redjaimiaimadeddine24@gmail.com';
    const defaultUsers = [{
      id: 'admin-1',
      firstName: 'Imad',
      lastName: 'Seller',
      email: ADMIN_EMAIL,
      phone: '00000000',
      isAdmin: true,
      balance: 0,
      password: 'admin'
    }];
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  useEffect(() => {
    localStorage.setItem('shop_users', JSON.stringify(users));
  }, [users]);

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem('current_user', JSON.stringify(u));
    else localStorage.removeItem('current_user');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('app_theme', t);
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const refreshData = async () => {
    const cloudProducts = await cloudService.fetchProducts();
    const cloudOrders = await cloudService.fetchOrders();
    setProducts(cloudProducts);
    setOrders(cloudOrders);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addProduct = async (product: Product) => {
    try {
      await cloudService.addProduct(product);
      setProducts(prev => {
        const exists = prev.find(p => p.id === product.id);
        if (exists) {
          return prev.map(p => p.id === product.id ? product : p);
        }
        return [product, ...prev];
      });
      return { success: true };
    } catch (e: any) {
      console.error("Add Product Error:", e);
      return { success: false, error: e.message || "Unknown error" };
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await cloudService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (e) {
      console.error("Delete Product Error:", e);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item);
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const placeOrder = async (method: PaymentMethod): Promise<{ success: boolean, message: string }> => {
    if (!user) return { success: false, message: 'يجب تسجيل الدخول' };

    // التحقق من توفر المخزون لجميع العناصر في السلة
    for (const item of cart) {
      const product = products.find(p => p.id === item.id);
      if (!product || product.stock < item.cartQuantity) {
        return { success: false, message: `عذراً، الكمية المطلوبة من ${item.name} غير متوفرة حالياً` };
      }
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.cartQuantity), 0);

    if (method === 'Wallet' && user.balance < total) {
      return { success: false, message: 'رصيدك في المحفظة غير كافٍ' };
    }

    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      buyerId: user.id,
      buyerName: `${user.firstName} ${user.lastName}`,
      buyerPhone: user.phone,
      items: [...cart],
      totalPrice: total,
      status: OrderStatus.PENDING,
      paymentMethod: method,
      date: new Date().toISOString()
    };

    // 1. خصم المخزون من المنتجات
    setProducts(prev => prev.map(p => {
      const itemInCart = cart.find(item => item.id === p.id);
      if (itemInCart) {
        const updatedProduct = { ...p, stock: p.stock - itemInCart.cartQuantity };
        cloudService.addProduct(updatedProduct); // مزامنة مع التخزين
        return updatedProduct;
      }
      return p;
    }));

    // إرسال الطلب للسحابة
    try {
      await cloudService.placeOrder(newOrder);

      // 2. تحديث الطلبات
      setOrders(prev => [newOrder, ...prev]);

      // 3. تحديث رصيد المحفظة إذا كان الدفع عبرها
      if (method === 'Wallet') {
        const updatedUser = { ...user, balance: user.balance - total };
        setUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      }

      setCart([]);
      return { success: true, message: 'تم إرسال الطلب بنجاح' };
    } catch (e) {
      console.error("Order process error:", e);
      return { success: false, message: 'حدث خطأ أثناء إرسال الطلب' };
    }
  };

  const rateOrder = (orderId: string, rating: number) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, isRated: true } : o));
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setFavorites([]);
    setActiveBuyerTab('home');
  };

  return (
    <AppContext.Provider value={{
      user, setUser, products, setProducts, orders, setOrders, users, setUsers,
      cart, setCart, favorites, setFavorites, notifications, activeBuyerTab, setActiveBuyerTab,
      language, setLanguage, theme, setTheme,
      logout, refreshData, addToCart, removeFromCart, toggleFavorite, placeOrder, rateOrder,
      addProduct, deleteProduct
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within an AppProvider');
  return context;
};
