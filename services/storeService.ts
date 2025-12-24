
import { Product, Order, OrderStatus } from '../types';
import { supabase } from '../supabaseClient';

export const cloudService = {
  async fetchProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(p => ({
        ...p,
        reviewsCount: p.reviews_count
      }));
    } catch (e) {
      console.error("Fetch Products Error:", e);
      return [];
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
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (e) {
      console.error("Add Product Error:", e);
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
