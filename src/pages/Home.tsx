import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Truck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getProducts({ featured: true });
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();

    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else setItemsToShow(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < featuredProducts.length - itemsToShow) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(Math.max(0, featuredProducts.length - itemsToShow)); // Loop to end
    }
  };

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-[#F5F5F5]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/hero/1920/1080"
            alt="Hero"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 bg-black text-white text-[10px] font-bold rounded-full uppercase tracking-widest mb-6">
              New Collection 2026
            </span>
            <h1 className="text-7xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 text-black">
              PREMIUM <br />
              FABRICS. <br />
              TIMELESS CUTS.
            </h1>
            <p className="text-xl text-black/60 mb-10 leading-relaxed max-w-lg">
              Discover our curated collection of high-quality shirts designed for the modern wardrobe. From essential tees to tailored oxfords.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-black/80 transition-all group"
              >
                Shop Collection
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products?category=1"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black border border-black/10 rounded-2xl font-bold hover:bg-black/5 transition-all"
              >
                Explore Tees
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-12 right-12 hidden lg:flex space-x-12">
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-black">12k+</span>
            <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Happy Customers</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-black">4.9</span>
            <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Average Rating</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-black/5">
            <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mb-6">
              <Truck className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-lg font-bold mb-2">Free Shipping</h3>
            <p className="text-sm text-black/60">On all orders over $150. Fast and secure delivery to your doorstep.</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-black/5">
            <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-lg font-bold mb-2">Secure Payment</h3>
            <p className="text-sm text-black/60">Your security is our priority. We use industry-leading encryption.</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-black/5">
            <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mb-6">
              <RotateCcw className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-lg font-bold mb-2">Easy Returns</h3>
            <p className="text-sm text-black/60">Not satisfied? Return your items within 30 days for a full refund.</p>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-2 block">Curated Selection</span>
            <h2 className="text-4xl font-bold text-black">Featured Products</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2 mr-6">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Link to="/products" className="text-sm font-bold text-black hover:text-black/60 transition flex items-center">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-square bg-black/5 rounded-2xl" />
                  <div className="h-4 bg-black/5 rounded w-3/4" />
                  <div className="h-4 bg-black/5 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="flex gap-8"
              animate={{ x: `calc(-${currentIndex * (100 / itemsToShow)}% - ${currentIndex * (32 / itemsToShow)}px)` }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
            >
              {featuredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="flex-shrink-0"
                  style={{ 
                    width: `calc(${100 / itemsToShow}% - ${(32 * (itemsToShow - 1)) / itemsToShow}px)` 
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[40px] overflow-hidden bg-black py-24 px-8 md:px-24 text-center">
          <div className="absolute inset-0 z-0 opacity-30">
            <img
              src="https://picsum.photos/seed/cta/1920/1080"
              alt="CTA"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
              Upgrade your wardrobe today.
            </h2>
            <p className="text-lg text-white/60 mb-10 leading-relaxed">
              Join our community of style enthusiasts and get early access to new drops and exclusive offers.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-black rounded-2xl font-bold hover:bg-white/90 transition-all"
            >
              Shop All Shirts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
