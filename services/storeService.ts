
import { Product, Order, OrderStatus } from '../types';
import { supabase } from '../supabaseClient';

export const cloudService = {
  async fetchProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase Fetch Products Error:", error);
        throw error;
      }
      return (data || []).map(p => ({
        ...p,
        reviewsCount: p.reviews_count
      }));
    } catch (e) {
      console.error("Fetch Products Error:", e);
      // If it's a fetch error, it might be project paused
      if (e instanceof TypeError && e.message === 'Failed to fetch') {
        throw new Error("تعذر الاتصال بقاعدة البيانات. تأكد من أن مشروع Supabase ليس متوقفاً (Paused) أو جرب تعطيل Ad-blocker.");
      }
      return [];
    }
  },

  async checkConnection() {
    try {
      const { data, error } = await supabase.from('products').select('id').limit(1);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Connection Check Failed:", e);
      return false;
    }
  },

  async addProduct(product: Product) {
    try {
      const { data, error } = await supabase
        .from('products')
        .upsert({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          stock: product.stock,
          rating: product.rating,
          reviews_count: product.reviewsCount
        }, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.error("Supabase Add Product Error:", error);
        throw error;
      }
      return data;
    } catch (e: any) {
      console.error("Add Product Error Details:", e);
      if (e instanceof TypeError && e.message === 'Failed to fetch') {
        throw new Error("فشل الاتصال بـ Supabase. يرجى التأكد من أن المشروع فعال (Active) وليس (Paused) في لوحة تحكم Supabase.");
      }
      // Check for common Postgres errors if available
      if (e.code === '42P01') throw new Error("جدول الـ products غير موجود في قاعدة البيانات.");
      if (e.code === '23505') throw new Error("هذا المنتج موجود مسبقاً.");

      throw e;
    }
  },

  async deleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      console.error("Delete Product Error:", e);
      throw e;
    }
  },

  async placeOrder(order: Order) {
    try {
      // 1. Insert into orders table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          id: order.id,
          buyer_id: order.buyerId,
          buyer_name: order.buyerName,
          buyer_phone: order.buyerPhone,
          total_price: order.totalPrice,
          status: order.status,
          payment_method: order.paymentMethod
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert order items
      const orderItems = order.items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.cartQuantity,
        price_at_purchase: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return orderData;
    } catch (e) {
      console.error("Place Order Error:", e);
      throw e;
    }
  },

  async fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            product:products(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(order => ({
        ...order,
        buyerId: order.buyer_id,
        buyerName: order.buyer_name,
        buyerPhone: order.buyer_phone,
        totalPrice: order.total_price,
        paymentMethod: order.payment_method,
        date: order.created_at, // ربط تاريخ الإنشاء بالتاريخ المستخدم في الواجهة
        items: order.items.map((item: any) => ({
          ...item.product,
          cartQuantity: item.quantity,
          price: item.price_at_purchase,
          reviewsCount: item.product?.reviews_count || 0
        }))
      }));
    } catch (e) {
      console.error("Fetch Orders Error:", e);
      return [];
    }
  }
};
