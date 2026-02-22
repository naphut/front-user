import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-10 h-10 text-black/20" />
        </div>
        <h2 className="text-3xl font-bold text-black mb-4">Your cart is empty</h2>
        <p className="text-black/40 mb-10 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Explore our collection and find something you love.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center justify-center px-10 py-4 bg-black text-white rounded-2xl font-bold hover:bg-black/80 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-black mb-12">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-white rounded-3xl border border-black/5"
              >
                <div className="w-32 h-32 bg-black/5 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">{item.category_name}</p>
                  <h3 className="text-lg font-bold text-black mb-1">{item.name}</h3>
                  <p className="text-sm text-black/60 mb-4">${item.price.toFixed(2)}</p>
                  
                  <div className="flex items-center justify-center sm:justify-start space-x-4">
                    <div className="flex items-center bg-black/5 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-black/20 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <p className="text-lg font-bold text-black">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[40px] p-8 border border-black/5 sticky top-24">
            <h2 className="text-2xl font-bold text-black mb-8">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-black/40 font-bold uppercase tracking-widest">Subtotal ({totalItems} items)</span>
                <span className="text-black font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-black/40 font-bold uppercase tracking-widest">Shipping</span>
                <span className="text-black font-bold">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-black/40 font-bold uppercase tracking-widest">Tax</span>
                <span className="text-black font-bold">$0.00</span>
              </div>
            </div>

            <div className="pt-8 border-t border-black/5 mb-10">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-black uppercase tracking-widest">Total</span>
                <span className="text-4xl font-bold text-black">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full py-5 bg-black text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-black/80 transition group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-8 flex items-center justify-center space-x-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-20" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-20" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
